import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { sendInstallationUpdate } from "@/lib/notifications"

function mapApplication(application: any) {
  const siteVisitInvoice = application.invoices?.find(
    (invoice: any) =>
      invoice.type === "authority_fee" &&
      invoice.description === "Site visit fee",
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

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const application = await prisma.application.findFirst({
    where: { reference: id },
    include: {
      customer: true,
      installerOrganization: true,
      selectedPackage: true,
      bids: true,
      invoices: true,
    },
  })

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (user.role === "customer" && application.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ application: mapApplication(application) })
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const application = await prisma.application.findFirst({
    where: { reference: id },
    include: { customer: true, installerOrganization: true, selectedPackage: true, bids: true, invoices: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (user.role === "customer" && application.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      status: body.status || application.status,
      siteVisitDate: body.siteVisitDate ? new Date(body.siteVisitDate) : application.siteVisitDate,
      rejectionReason: body.rejectionReason ?? application.rejectionReason,
      installerOrganizationId: body.installerOrganizationId ?? application.installerOrganizationId,
      selectedPackageId: body.selectedPackageId ?? application.selectedPackageId,
    },
    include: { customer: true, installerOrganization: true, selectedPackage: true, bids: true, invoices: true },
  })

  if (user.role === "installer") {
    const nextStatus = body.status
    if (nextStatus === "installation_in_progress" && application.status !== nextStatus) {
      await sendInstallationUpdate(application.customerId, "Installation started")
    }
    if (nextStatus === "installation_complete" && application.status !== nextStatus) {
      await sendInstallationUpdate(application.customerId, "Installation completed")
    }
  }

  return NextResponse.json({ application: mapApplication(updated) })
}
