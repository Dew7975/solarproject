import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { sendAgreementNotification } from "@/lib/notifications"
import { ApplicationStatus } from "@prisma/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Helper: Resolve all active installer users for an organization
async function resolveInstallerUserIds(organizationId?: string | null): Promise<string[]> {
  if (!organizationId) return []
  
  const users = await prisma.user.findMany({
    where: { 
      organizationId, 
      role: "installer",
      status: "active" // Ensure we only notify active users
    }, 
    select: { id: true },
  })
  
  return users.map((u) => u.id)
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const agreement = await prisma.agreement.findUnique({
    where: { id },
  })
  if (!agreement) return NextResponse.json({ error: "Agreement not found" }, { status: 404 })

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true },
  })

  // Access Control Checks
  if (user.role === "customer" && agreement.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  
  // Logic fix: Ensure dbUser organization matches agreement installer org
  if (user.role === "installer") {
    if (!dbUser?.organizationId || agreement.installerOrganizationId !== dbUser.organizationId) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  return NextResponse.json({ agreement })
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // 1. Fetch Agreement
  const agreement = await prisma.agreement.findUnique({
    where: { id },
    include: { application: true },
  })
  if (!agreement) return NextResponse.json({ error: "Agreement not found" }, { status: 404 })

  // 2. Access Control
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { organizationId: true },
  })

  if (user.role === "customer" && agreement.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (user.role === "installer" && agreement.installerOrganizationId !== dbUser?.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (user.role !== "customer" && user.role !== "installer") {
    return NextResponse.json({ error: "Only customer or installer can sign" }, { status: 403 })
  }

  // 3. Handle File Upload
  const formData = await request.formData().catch(() => null)
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 })

  const file = formData.get("file")
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Signed agreement file is required" }, { status: 400 })
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "agreements")
  await fs.mkdir(uploadsDir, { recursive: true })
  
  const arrayBuffer = await (file as Blob).arrayBuffer()
  const fileName = (file as any)?.name ?? "signed.pdf"
  const ext = path.extname(fileName) || ".pdf"
  const storedName = `${randomUUID()}${ext}`
  
  await fs.writeFile(path.join(uploadsDir, storedName), Buffer.from(arrayBuffer))
  const url = `/uploads/agreements/${storedName}`

  const now = new Date()

  // 4. Update Agreement Status
  const agreementUpdate =
    user.role === "customer"
      ? { customerSignedUrl: url, customerSignedAt: now, status: "customer_signed" as const }
      : { installerSignedUrl: url, installerSignedAt: now, status: "installer_signed" as const }

  const updated = await prisma.agreement.update({
    where: { id },
    data: agreementUpdate,
  })

  // 5. Update Application Status
  // Ensure the types match your Prisma Enum (Assuming 'customer_signed' and 'installer_signed' exist)
  const appStatus: ApplicationStatus = user.role === "customer" ? "customer_signed" : "installer_signed"

  await prisma.application.update({
    where: { id: agreement.applicationId },
    data: { status: appStatus },
  })

  // 6. Send Notifications
  const customerLink = `/customer/agreements/${agreement.id}`
  const installerLink = `/installer/agreements/${agreement.id}`

  if (user.role === "customer") {
    // Notify Installer(s)
    const installerUserIds = await resolveInstallerUserIds(agreement.installerOrganizationId)
    
    if (installerUserIds.length > 0) {
      await Promise.all(
        installerUserIds.map((uid) =>
          sendAgreementNotification(uid, "Agreement signed by customer. Please sign and upload.", installerLink),
        ),
      )
    } else {
        console.warn(`[Agreement Sign] No active installer users found for Organization: ${agreement.installerOrganizationId}`)
    }
  } else {
    // Notify Customer
    await sendAgreementNotification(agreement.customerId, "Agreement signed by installer. Please review/sign.", customerLink)
  }
  return NextResponse.json({ agreement: updated })
}
