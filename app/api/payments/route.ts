import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import {
  sendInvoicePaidNotification,
  sendInstallationPaymentCompletedNotification,
  sendSiteVisitPaymentCompletedNotification,
} from "@/lib/notifications"
import { InvoiceType } from "@prisma/client"

export const dynamic = "force-dynamic"

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function mapInvoice(invoice: any) {
  return {
    id: invoice.id,
    applicationId: invoice.application.reference,
    applicationStatus: invoice.application?.status ?? null,
    customerId: invoice.customerId,
    customerName: invoice.customer?.name,
    amount: invoice.amount,
    status: invoice.status,
    type: invoice.type,
    description: invoice.description,
    createdAt: invoice.createdAt,
    dueDate: invoice.dueDate,
    paidAt: invoice.paidAt,
    pdfUrl: invoice.pdfUrl ?? `/api/invoices/${invoice.id}/pdf`,
  }
}

/* ------------------------------------------------------------------ */
/* GET /api/payments                                                   */
/* ------------------------------------------------------------------ */

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  await prisma.invoice.updateMany({
    where: {
      status: "pending",
      dueDate: { lt: now },
    },
    data: { status: "overdue" },
  })

  const where =
    user.role === "customer"
      ? { customerId: user.id }
      : user.role === "installer" && user.organization
      ? { application: { installerOrganizationId: user.organization.id } }
      : {}

  const [invoices, meterReadings] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        application: { select: { reference: true, customerId: true, status: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.meterReading.findMany({
      where: user.role === "officer" ? undefined : { application: { customerId: user.id } },
    }),
  ])

  const invoiceList = invoices
    .filter((inv) => inv.type !== "monthly_bill")
    .map(mapInvoice)

  const monthlyBills = invoices
    .filter((inv) => inv.type === "monthly_bill")
    .map((inv) => {
      const reading = meterReadings.find(
        (r) =>
          r.applicationId === inv.applicationId &&
          r.year === inv.dueDate.getFullYear() &&
          r.month === inv.dueDate.getMonth() + 1,
      )

      return {
        id: inv.id,
        invoiceId: inv.id,
        customerId: inv.customerId,
        applicationId: inv.application.reference,
        month: inv.dueDate.getMonth() + 1,
        year: inv.dueDate.getFullYear(),
        kwhGenerated: reading?.kwhGenerated ?? 0,
        kwhExported: reading?.kwhExported ?? 0,
        kwhImported: reading?.kwhImported ?? 0,
        amount: inv.amount,
        status: inv.status,
        createdAt: inv.createdAt,
        pdfUrl: inv.pdfUrl ?? `/api/invoices/${inv.id}/pdf`,
      }
    })

  return NextResponse.json({ invoices: invoiceList, monthlyBills })
}

/* ------------------------------------------------------------------ */
/* POST /api/payments                                                  */
/* Create payment transaction + gateway intent                         */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    invoiceId,
    amount,
    type,
    description,
  }: {
    invoiceId?: string
    amount?: number
    type?: InvoiceType
    description?: string
  } = body

  if (!invoiceId) {
    return NextResponse.json(
      { error: "invoiceId is required" },
      { status: 400 },
    )
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  if (user.role === "customer" && invoice.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const resolvedAmount = amount ?? invoice.amount
  const resolvedType = type ?? invoice.type
  if (!resolvedAmount || !resolvedType) {
    return NextResponse.json(
      { error: "invoice amount and type are required" },
      { status: 400 },
    )
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      amount: resolvedAmount,
      type: resolvedType,
      description: description ?? invoice.description,
      status: "paid",
      paidAt: new Date(),
    },
  })

  const wasPaid = invoice.status === "paid"

  if (
    !wasPaid &&
    updated.type === "authority_fee" &&
    updated.description === "Site visit fee" &&
    updated.applicationId
  ) {
    await prisma.application.update({
      where: { id: updated.applicationId },
      data: { status: "site_visit_payment_completed" },
    })
    await sendSiteVisitPaymentCompletedNotification(
      updated.applicationId,
      updated.id,
      updated.amount,
    )
  }

  if (!wasPaid && updated.type === "installation" && updated.applicationId) {
    await prisma.application.update({
      where: { id: updated.applicationId },
      data: { status: "payment_confirmed" },
    })
    await sendInstallationPaymentCompletedNotification(
      updated.applicationId,
      updated.id,
      updated.amount,
    )
  }

  await sendInvoicePaidNotification(updated.customerId, updated.id, updated.amount)

  return NextResponse.json({ invoice: updated }, { status: 201 })
}
