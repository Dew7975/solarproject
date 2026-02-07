import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { currentUser } from "@/lib/services/auth"
import { getFees } from "@/lib/fees"

export const runtime = "nodejs"

/** Remove keys with undefined values (important for JSON fields) */
function removeUndefined(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

function mapApplication(application: any) {
  const siteVisitInvoice = application.invoices?.find(
    (invoice: any) =>
      invoice.type === "authority_fee" && invoice.description === "Site visit fee"
  )
  const siteVisitFeePaid = siteVisitInvoice?.status === "paid"
  const normalizedStatus =
    siteVisitFeePaid && application.status === "pre_visit_approved"
      ? "site_visit_payment_completed"
      : application.status

  return {
    id: application.reference,
    reference: application.reference,
    status: normalizedStatus,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    customerId: application.customerId,
    customerName: application.customer.name,
    email: application.customer.email,
    phone: application.customer.phone,
    address: application.customer.address,
    documents: application.documents,
    technicalDetails: application.technicalDetails,
    siteVisitDate: application.siteVisitDate,
    rejectionReason: application.rejectionReason,
    siteVisitFeePaid,
    selectedInstaller: application.installerOrganization
      ? {
          id: application.installerOrganization.id,
          name: application.installerOrganization.name,
          phone: application.installerOrganization.phone,
          address: application.installerOrganization.address,
          packageName: application.selectedPackage?.name,
          price: application.selectedPackage?.price,
        }
      : undefined,
    bidId: application.bids[0]?.id,
    invoices: application.invoices,
  }
}

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const applications = await prisma.application.findMany({
    where:
      user.role === "customer"
        ? { customerId: user.id }
        : user.role === "installer" && user.organization
          ? { installerOrganizationId: user.organization.id }
          : undefined,
    include: {
      customer: true,
      installerOrganization: true,
      selectedPackage: true,
      bids: true,
      invoices: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ applications: applications.map(mapApplication) })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (user.role !== "customer") {
    return NextResponse.json(
      { error: "Only customers can create applications" },
      { status: 403 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const metaRaw = formData.get("meta")
  if (!metaRaw || typeof metaRaw !== "string") {
    return NextResponse.json(
      { error: "Missing application details" },
      { status: 400 }
    )
  }

  // ✅ FIX: confirmSingleSystem exists here because you use it later
  const meta = JSON.parse(metaRaw) as {
    siteAddress?: string
    systemCapacity?: string
    connectionPhase?: string
    selectedPackageId?: string
    installerOrganizationId?: string
    purchaseMode?: "direct"
    applicationId?: string
    technicalDetails?: Record<string, unknown>
    confirmSingleSystem?: boolean
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadsDir, { recursive: true })

  async function persistFile(field: string) {
    const file = formData.get(field)
    if (!file || typeof file === "string") return undefined

    const f = file as File
    const arrayBuffer = await f.arrayBuffer()
    const ext = path.extname(f.name || "") || ".bin"
    const storedName = `${randomUUID()}${ext}`
    const storedPath = path.join(uploadsDir, storedName)
    await fs.writeFile(storedPath, Buffer.from(arrayBuffer))

    return {
      fileName: f.name,
      url: `/uploads/${storedName}`,
      uploadedAt: new Date().toISOString(),
    }
  }

  const documents = {
    nic: await persistFile("nicDocument"),
    bankDetails: await persistFile("bankDetails"),
    electricityBill: await persistFile("electricityBill"),
    propertyDocument: await persistFile("propertyDocument"),
  }

  const filteredDocuments = Object.fromEntries(
    Object.entries(documents).filter(([, value]) => value)
  )

  const reference = `APP-${randomUUID().slice(0, 8).toUpperCase()}`

  const paidFee = await prisma.invoice.findFirst({
    where: {
      customerId: user.id,
      type: "authority_fee",
      description: "Site visit fee",
      status: "paid",
    },
    orderBy: { createdAt: "desc" },
  })

  const mode = new URL(request.url).searchParams.get("mode")
  const directPurchase = mode === "direct"

  if (!directPurchase && !meta.confirmSingleSystem) {
    return NextResponse.json(
      {
        error:
          "One application is limited to one solar system. Please confirm to proceed.",
      },
      { status: 400 }
    )
  }

  const include = {
    customer: true,
    installerOrganization: true,
    selectedPackage: true,
    bids: true,
    invoices: true,
  }

  // Build technicalDetails without undefined values (JSON cannot contain undefined)
  const baseTech = (meta.technicalDetails ?? {}) as Record<string, unknown>
  const mergedTech = removeUndefined({
    ...baseTech,
    siteAddress: meta.siteAddress,
    systemCapacity: meta.systemCapacity,
    connectionPhase: meta.connectionPhase,
  })

  // schema requires Json (not optional) so always set an object
  const technicalDetailsJson = mergedTech as Prisma.InputJsonValue

  const documentsJson =
    Object.keys(filteredDocuments).length > 0
      ? (filteredDocuments as Prisma.InputJsonValue)
      : ({} as Prisma.InputJsonValue)

  // =========================
  // DIRECT PURCHASE FLOW
  // =========================
  if (directPurchase) {
    if (!meta.selectedPackageId) {
      return NextResponse.json(
        { error: "Package is required for direct purchase" },
        { status: 400 }
      )
    }
    if (!meta.applicationId) {
      return NextResponse.json(
        { error: "Application is required for direct purchase" },
        { status: 400 }
      )
    }

    const pendingPayment = await prisma.application.findFirst({
      where: { customerId: user.id, status: "payment_pending" },
    })

    if (pendingPayment && pendingPayment.reference !== meta.applicationId) {
      return NextResponse.json(
        { error: "Complete your pending payment before buying another package" },
        { status: 409 }
      )
    }

    const pkg = await prisma.installerPackage.findUnique({
      where: { id: meta.selectedPackageId },
    })

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // FIX: schema does NOT have pkg.active, so remove that check
    // If you need activation later, add a boolean field in schema.

    if (
      meta.installerOrganizationId &&
      meta.installerOrganizationId !== pkg.organizationId
    ) {
      return NextResponse.json(
        { error: "Installer does not match package" },
        { status: 400 }
      )
    }

    const existing = await prisma.application.findFirst({
      where: { reference: meta.applicationId, customerId: user.id },
      include,
    })

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // FIX: use UncheckedUpdateInput so you can set FK scalar IDs
    const updateData: Prisma.ApplicationUncheckedUpdateInput = {
      status: "payment_pending",
      installerOrganizationId: pkg.organizationId,
      selectedPackageId: pkg.id,

      // Only update documents if new docs provided; otherwise keep existing
      ...(Object.keys(filteredDocuments).length > 0 ? { documents: documentsJson } : {}),

      // Always safe (JSON object)
      technicalDetails: technicalDetailsJson,
    }

    const application = await prisma.application.update({
      where: { id: existing.id },
      data: updateData,
      include,
    })

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)

    const invoice = await prisma.invoice.create({
      data: {
        applicationId: application.id,
        customerId: user.id,
        amount: pkg.price,
        description: "Installer payment",
        dueDate,
        status: "pending",
        type: "installation",
      },
    })

    return NextResponse.json(
      { application: mapApplication(application), invoiceId: invoice.id },
      { status: 201 }
    )
  }

  // =========================
  // NORMAL FLOW (SITE VISIT FEE)
  // =========================
  if (!paidFee) {
    let pendingApp = await prisma.application.findFirst({
      where: { customerId: user.id, status: "pending", siteVisitDate: null },
      orderBy: { createdAt: "desc" },
      include,
    })

    if (pendingApp) {
      const updateData: Prisma.ApplicationUpdateInput = {
        technicalDetails: technicalDetailsJson,
        ...(Object.keys(filteredDocuments).length > 0 ? { documents: documentsJson } : {}),
      }

      pendingApp = await prisma.application.update({
        where: { id: pendingApp.id },
        data: updateData,
        include,
      })
    } else {
      pendingApp = await prisma.application.create({
        data: {
          reference,
          customerId: user.id,
          status: "pending",
          documents: documentsJson,
          technicalDetails: technicalDetailsJson,
        },
        include,
      })
    }

    if (!pendingApp) {
      return NextResponse.json({ error: "Unable to create application" }, { status: 500 })
    }

    if (mode === "fee") {
      const fees = await getFees()
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 7)

      const invoice = await prisma.invoice.create({
        data: {
          applicationId: pendingApp.id,
          customerId: user.id,
          amount: fees.siteVisitFee,
          description: "Site visit fee",
          dueDate,
          status: "pending",
          type: "authority_fee",
        },
      })

      return NextResponse.json(
        {
          error: "Payment required",
          invoiceId: invoice.id,
          applicationId: pendingApp.reference,
          paymentRequired: true,
        },
        { status: 402 }
      )
    }

    return NextResponse.json(
      { application: mapApplication(pendingApp), paymentRequired: false },
      { status: 201 }
    )
  }

  // =========================
  // NORMAL FLOW (FEE PAID -> CREATE NEW)
  // =========================
  const application = await prisma.application.create({
    data: {
      reference,
      customerId: user.id,
      status: "pending",
      documents: documentsJson,
      technicalDetails: technicalDetailsJson,
    },
    include,
  })

  return NextResponse.json({ application: mapApplication(application) }, { status: 201 })
}