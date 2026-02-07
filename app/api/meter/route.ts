import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { computeMonthlyAmount, getMeteringRates } from "@/lib/billing"
import { buildReportPdf, writePdfToPublic } from "@/lib/pdf"

const API_KEY = process.env.METER_API_KEY

export async function POST(request: Request) {
  if (API_KEY) {
    const key = request.headers.get("x-api-key")
    if (key !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const {
    userId,
    totalGenerated,
    totalExported,
    totalImported,
    totalCo2,
    month,
    year,
  } = body as {
    userId?: string
    totalGenerated?: number
    totalExported?: number
    totalImported?: number
    totalCo2?: number
    month?: number
    year?: number
  }

  if (
    !userId ||
    totalGenerated === undefined ||
    totalExported === undefined ||
    totalCo2 === undefined
  ) {
    return NextResponse.json(
      {
        error:
          "userId, totalGenerated, totalExported, and totalCo2 are required",
      },
      { status: 400 },
    )
  }

  const application = await prisma.application.findFirst({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
  })

  if (!application) {
    return NextResponse.json(
      { error: "No application found for user" },
      { status: 404 },
    )
  }

  const now = new Date()
  const finalMonth = month ?? now.getMonth() + 1
  const finalYear = year ?? now.getFullYear()

  const existingReading = await prisma.meterReading.findFirst({
    where: { applicationId: application.id, month: finalMonth, year: finalYear },
  })

  if (existingReading) {
    return NextResponse.json(
      { error: "Meter reading already submitted for this month." },
      { status: 409 },
    )
  }

  const reading = await prisma.meterReading.create({
    data: {
      applicationId: application.id,
      userId,
      month: finalMonth,
      year: finalYear,
      kwhGenerated: Number(totalGenerated),
      kwhExported: Number(totalExported),
      kwhImported: Number(totalImported ?? 0),
    },
  })

  const { ratePerKwh, creditRatePerKwh } = getMeteringRates()
  const netUnits = reading.kwhImported - reading.kwhExported
  const amount = computeMonthlyAmount(netUnits, ratePerKwh, creditRatePerKwh)
  const dueDate = new Date(reading.year, reading.month - 1, 1)
  dueDate.setDate(dueDate.getDate() + 14)

  const periodStart = new Date(reading.year, reading.month - 1, 1)
  const periodEnd = new Date(reading.year, reading.month, 1)

  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      applicationId: application.id,
      type: "monthly_bill",
      dueDate: { gte: periodStart, lt: periodEnd },
    },
  })

  const invoice =
    existingInvoice ??
    (await prisma.invoice.create({
      data: {
        applicationId: application.id,
        customerId: application.customerId,
        type: "monthly_bill",
        description: `${dueDate.toLocaleString("default", { month: "long" })} Net Metering Bill`,
        amount,
        status: "pending",
        dueDate,
      },
    }))

  if (!invoice.pdfUrl) {
    const pdfBuffer = buildReportPdf({
      title: "SolarConnect Invoice",
      subtitle: `Invoice ${invoice.id}`,
      sections: [
        {
          title: "Invoice Details",
          lines: [
            { label: "Application", value: application.reference },
            { label: "Type", value: "monthly bill" },
            { label: "Description", value: invoice.description },
            { label: "Amount", value: `LKR ${Number(amount).toLocaleString()}` },
            { label: "Status", value: invoice.status },
            { label: "Due Date", value: invoice.dueDate.toLocaleDateString() },
          ],
        },
      ],
      footer: "SolarConnect - Generated electronically.",
    })
    const pdfUrl = await writePdfToPublic({
      filename: `invoice-${invoice.id}.pdf`,
      buffer: pdfBuffer,
    })
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdfUrl },
    })
  }

  return NextResponse.json({
    ok: true,
    readingId: reading.id,
    invoiceId: invoice.id,
    amount,
    stored: {
      month: reading.month,
      year: reading.year,
      kwhGenerated: reading.kwhGenerated,
      kwhExported: reading.kwhExported,
      kwhImported: reading.kwhImported,
    },
    totals: {
      co2Kg: Number(totalCo2),
    },
  })
}
