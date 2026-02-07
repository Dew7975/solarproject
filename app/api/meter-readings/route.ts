import { NextRequest, NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getSessionUser, requireRole } from "@/lib/auth-server"
import { computeMonthlyAmount, getMeteringRates } from "@/lib/billing"
import { buildReportPdf, writePdfToPublic } from "@/lib/pdf"

export const dynamic = "force-dynamic"

/* ------------------------------------------------------------------ */
/* GET /api/meter-readings                                             */
/* ------------------------------------------------------------------ */

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role === UserRole.customer) {
    const readings = await prisma.meterReading.findMany({
      where: { application: { customerId: user.id } },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    })
    return NextResponse.json({ readings })
  }

  if (user.role === UserRole.installer) {
    const readings = await prisma.meterReading.findMany({
      where: user.organizationId
        ? { application: { installerOrganizationId: user.organizationId } }
        : { applicationId: "__none__" },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    })
    return NextResponse.json({ readings })
  }

  const forbidden = requireRole(user.role, [UserRole.officer])
  if (forbidden) return forbidden

  const readings = await prisma.meterReading.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })

  return NextResponse.json({ readings })
}

/* ------------------------------------------------------------------ */
/* POST /api/meter-readings                                            */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const forbidden = requireRole(user.role, [UserRole.officer])
  if (forbidden) return forbidden

  const body = await req.json()
  const {
    applicationId,
    readingDate,
    month,
    year,
    kwhGenerated,
    kwhExported,
    kwhImported,
  } = body as {
    applicationId?: string
    readingDate?: string
    month?: number
    year?: number
    kwhGenerated?: number
    kwhExported?: number
    kwhImported?: number
  }

  if (
    !applicationId ||
    (!readingDate && (!month || !year)) ||
    kwhGenerated === undefined ||
    kwhExported === undefined ||
    kwhImported === undefined
  ) {
    return NextResponse.json(
      {
        error:
          "applicationId, readingDate or month/year, kwhGenerated, kwhExported, and kwhImported are required",
      },
      { status: 400 },
    )
  }

  const effectiveDate = readingDate ? new Date(readingDate) : new Date(Number(year), Number(month) - 1, 1)

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  const existingReading = await prisma.meterReading.findFirst({
    where: {
      applicationId,
      month: effectiveDate.getMonth() + 1,
      year: effectiveDate.getFullYear(),
    },
  })

  if (existingReading) {
    return NextResponse.json(
      { error: "Meter reading already submitted for this month." },
      { status: 409 },
    )
  }

  const reading = await prisma.meterReading.create({
    data: {
      applicationId,
      userId: user.id,
      month: effectiveDate.getMonth() + 1,
      year: effectiveDate.getFullYear(),
      kwhGenerated,
      kwhExported,
      kwhImported,
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
      applicationId,
      type: "monthly_bill",
      dueDate: { gte: periodStart, lt: periodEnd },
    },
  })

  const invoice =
    existingInvoice ??
    (await prisma.invoice.create({
      data: {
        applicationId,
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

  return NextResponse.json({ reading, invoice }, { status: 201 })
}
