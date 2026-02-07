import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { buildSimplePdf, writePdfToPublic } from "@/lib/pdf"
import { sendAgreementNotification } from "@/lib/notifications"

function buildCustomerAgreementLines({
  customerName,
  installerName,
  senderName,
  dateLabel,
}: {
  customerName: string
  installerName?: string | null
  senderName: string
  dateLabel: string
}) {
  return [
    `To: ${customerName}`,
    `From: ${senderName}`,
    `Date: ${dateLabel}`,
    "Subject: Solar Installation Agreement",
    "",
    `I acknowledge that I selected ${installerName ?? "the installer"} through the platform and agree to the terms`,
    "of the solar installation. I am responsible for providing accurate information and cooperating",
    "with the installer and officer during installation, inspection, and commissioning.",
    "",
    "Signature: ______________________________",
    "Name: _________________________________",
    "Date: _________________________________",
  ]
}

function buildInstallerAgreementLines({
  installerName,
  customerName,
  senderName,
  dateLabel,
  packageName,
  panelCount,
  panelType,
  inverterBrand,
  warranty,
}: {
  installerName?: string | null
  customerName: string
  senderName: string
  dateLabel: string
  packageName?: string | null
  panelCount?: number | null
  panelType?: string | null
  inverterBrand?: string | null
  warranty?: string | null
}) {
  const panelDetails = [
    packageName ? `Package: ${packageName}` : null,
    panelCount ? `Panel Count: ${panelCount}` : null,
    panelType ? `Panel Type: ${panelType}` : null,
    inverterBrand ? `Inverter Brand: ${inverterBrand}` : null,
    warranty ? `Warranty: ${warranty}` : null,
  ].filter(Boolean) as string[]

  return [
    `To: ${installerName ?? "Installer"}`,
    `From: ${senderName}`,
    `Date: ${dateLabel}`,
    "Subject: Solar Installation Agreement",
    "",
    `I confirm the solar installation for ${customerName} and commit to providing the agreed`,
    "equipment, workmanship, and warranty coverage as described below.",
    ...panelDetails,
    "",
    "Signature: ______________________________",
    "Name: _________________________________",
    "Date: _________________________________",
  ]
}

export async function GET(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const applicationRef = url.searchParams.get("applicationId")
  if (!applicationRef) {
    return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
  }

  const application = await prisma.application.findFirst({
    where: { reference: applicationRef },
    include: { customer: true, installerOrganization: true, selectedPackage: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  if (user.role === "customer" && application.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (user.role === "installer" && application.installerOrganizationId !== user.organization?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const agreement = await prisma.agreement.findFirst({
    where: { applicationId: application.id },
  })

  return NextResponse.json({ agreement })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const applicationRef = body.applicationId as string | undefined
  if (!applicationRef) {
    return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
  }

  const application = await prisma.application.findFirst({
    where: { reference: applicationRef },
    include: { customer: true, installerOrganization: true, selectedPackage: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  const senderName = user.name || "Officer"
  const dateLabel = new Date().toLocaleDateString()

  const customerPdf = buildSimplePdf(
    "Solar Installation Agreement (Customer)",
    buildCustomerAgreementLines({
      customerName: application.customer.name,
      installerName: application.installerOrganization?.name ?? undefined,
      senderName,
      dateLabel,
    }),
  )

  const installerPdf = buildSimplePdf(
    "Solar Installation Agreement (Installer)",
    buildInstallerAgreementLines({
      installerName: application.installerOrganization?.name ?? undefined,
      customerName: application.customer.name,
      senderName,
      dateLabel,
      packageName: application.selectedPackage?.name ?? null,
      panelCount: application.selectedPackage?.panelCount ?? null,
      panelType: application.selectedPackage?.panelType ?? null,
      inverterBrand: application.selectedPackage?.inverterBrand ?? null,
      warranty: application.selectedPackage?.warranty ?? null,
    }),
  )

  const existing = await prisma.agreement.findFirst({
    where: { applicationId: application.id },
  })

  const agreement = existing
    ? await prisma.agreement.update({
        where: { id: existing.id },
        data: {
          customerId: application.customerId,
          installerOrganizationId: application.installerOrganizationId ?? null,
        },
      })
    : await prisma.agreement.create({
        data: {
          applicationId: application.id,
          customerId: application.customerId,
          installerOrganizationId: application.installerOrganizationId ?? null,
        },
      })

  const customerPdfUrl = await writePdfToPublic({
    filename: `agreement-${agreement.id}-customer.pdf`,
    buffer: customerPdf,
  })
  const installerPdfUrl = await writePdfToPublic({
    filename: `agreement-${agreement.id}-installer.pdf`,
    buffer: installerPdf,
  })

  const updated = await prisma.agreement.update({
    where: { id: agreement.id },
    data: {
      customerPdfUrl,
      installerPdfUrl,
      status: "draft",
      customerSignedUrl: null,
      installerSignedUrl: null,
      customerSignedAt: null,
      installerSignedAt: null,
      sentAt: null,
      officerApprovedAt: null,
    },
  })

  await prisma.application.update({
    where: { id: application.id },
    data: { status: "inspection_approved" },
  })

  await sendAgreementNotification(
    application.customerId,
    "Your agreement has been prepared and will be sent for signature soon.",
  )

  return NextResponse.json({ agreement: updated })
}
