import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { InvoiceStatus, InvoiceType, BidStatus, ApplicationStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { application: { select: { status: true } } },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  const payments: unknown[] = []
  let monthlyBill: {
    month: number
    year: number
    kwhGenerated: number
    kwhExported: number
    kwhImported: number
  } | null = null

  if (invoice.type === "monthly_bill") {
    const month = invoice.dueDate.getMonth() + 1
    const year = invoice.dueDate.getFullYear()
    const reading = await prisma.meterReading.findFirst({
      where: { applicationId: invoice.applicationId, month, year },
    })
    monthlyBill = {
      month,
      year,
      kwhGenerated: reading?.kwhGenerated ?? 0,
      kwhExported: reading?.kwhExported ?? 0,
      kwhImported: reading?.kwhImported ?? 0,
    }
  }

  return NextResponse.json({
    invoice: { ...invoice, pdfUrl: invoice.pdfUrl ?? `/api/invoices/${invoice.id}/pdf` },
    payments,
    monthlyBill,
  })
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  const body = await req.json().catch(() => ({}))
  const { status, paidAt } = body as { status?: string; paidAt?: string }

  const nextStatus: InvoiceStatus =
    status && ["pending", "paid", "overdue"].includes(status)
      ? (status as InvoiceStatus)
      : invoice.status

  // If caller sets paid status but doesn't provide paidAt, use now
  const nextPaidAt =
    nextStatus === "paid"
      ? paidAt
        ? new Date(paidAt)
        : invoice.paidAt ?? new Date()
      : invoice.paidAt

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) Update invoice
      const updatedInvoice = await tx.invoice.update({
        where: { id },
        data: {
          status: nextStatus,
          paidAt: nextPaidAt,
        },
      })

      // 2) If this is the installation invoice and it just became PAID, release order to installer
      const becamePaid = invoice.status !== "paid" && nextStatus === "paid"

      if (becamePaid && invoice.type === InvoiceType.installation) {
        const acceptedBid = await tx.bid.findFirst({
          where: {
            applicationId: invoice.applicationId,
            status: BidStatus.accepted,
          },
        })

        if (!acceptedBid?.organizationId) {
          throw new Error("Accepted bid not found for this application")
        }

        await tx.application.update({
          where: { id: invoice.applicationId },
          data: {
            installerOrganizationId: acceptedBid.organizationId,
            selectedPackageId: acceptedBid.packageId ?? null,
            status: ApplicationStatus.agreement_pending,
          },
        })
      }

      return { invoice: updatedInvoice }
    })

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update invoice" },
      { status: 500 },
    )
  }
}