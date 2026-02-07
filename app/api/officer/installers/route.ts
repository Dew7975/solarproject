import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { sendInstallerVerificationNotification } from "@/lib/notifications"

function mapInstaller(org: any) {
  const primaryInstaller = org.users.find(
    (user: any) => user.role === "installer",
  )

  return {
    id: org.id,
    companyName: org.name,
    email: primaryInstaller?.email || "",
    phone: org.phone || primaryInstaller?.phone || "",
    address: org.address || "",
    description: org.description || "",
    verified: org.verified,
    isRejected: org.isRejected,
    verifiedAt: org.verifiedAt,
    status: org.isRejected ? "rejected" : org.verified ? "verified" : "pending",
    documents: (org.documents || []).map((doc: string) => ({
      fileName: doc,
      url: `/docs/${org.id}/${doc}`,
      uploadedAt: org.updatedAt?.toISOString?.() || new Date().toISOString(),
    })),
    rating: org.rating ?? 0,
    completedInstallations: org.completedInstallations ?? 0,
    packages: org.packages.map((pkg: any) => ({
      id: pkg.id,
      installerId: org.id,
      name: pkg.name,
      capacity: pkg.capacity,
      description: pkg.description ?? "",
      panelCount: pkg.panelCount,
      panelType: pkg.panelType,
      inverterType: pkg.inverterType ?? "",
      inverterBrand: pkg.inverterBrand,
      installationDays: pkg.installationDays ?? null,
      warranty: pkg.warranty,
      price: pkg.price,
      active: pkg.active,
      features: pkg.features || [],
    })),
  }
}

export async function GET() {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const organizations = await prisma.organization.findMany({
    include: {
      packages: true,
      users: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ installers: organizations.map(mapInstaller) })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { installerId, status, rejectionReason } = body || {}

  if (!installerId || !status) {
    return NextResponse.json({ error: "installerId and status are required" }, { status: 400 })
  }

  const organization = await prisma.organization.findUnique({
    where: { id: installerId },
  })

  if (!organization) {
    return NextResponse.json({ error: "Installer not found" }, { status: 404 })
  }

  const nextVerified = status === "verified"
  const nextRejected = status === "rejected"

  const updatedOrganization = await prisma.organization.update({
    where: { id: installerId },
    data: {
      verified: nextVerified,
      verifiedAt: nextVerified ? new Date() : null,
      isRejected: nextRejected,
    },
    include: {
      packages: true,
      users: true,
    },
  })

  await prisma.user.updateMany({
    where: { organizationId: installerId },
    data: { verified: nextVerified },
  })

  const installerUsers = updatedOrganization.users.filter(
    (orgUser) => orgUser.role === "installer",
  )
  await Promise.all(
    installerUsers.map((orgUser) =>
      sendInstallerVerificationNotification(
        orgUser.id,
        nextVerified ? "verified" : "rejected",
        nextRejected ? rejectionReason : undefined,
      ),
    ),
  )

  return NextResponse.json({ installer: mapInstaller(updatedOrganization) })
}
