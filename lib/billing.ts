import { prisma } from "./prisma"
import { Invoice, MeterReading, MonthlyBill } from "./prisma-types"

interface MonthlyBillInput {
  month: number
  year: number
  ratePerKwh?: number
  creditRatePerKwh?: number
}

export function getMeteringRates() {
  const ratePerKwh = Number(process.env.NET_METER_RATE_PER_KWH ?? "30")
  const creditRatePerKwh = Number(process.env.NET_METER_CREDIT_RATE_PER_KWH ?? "25")
  return { ratePerKwh, creditRatePerKwh }
}

export function computeMonthlyAmount(
  netUnits: number,
  ratePerKwh: number,
  creditRatePerKwh: number,
) {
  if (netUnits >= 0) {
    return netUnits * ratePerKwh
  }
  return netUnits * creditRatePerKwh
}

export async function generateMonthlyBills(input: MonthlyBillInput) {
  const { month, year, ratePerKwh = 30, creditRatePerKwh = 25 } = input
  const readings = await prisma.meterReading.findMany({
    where: { month, year },
    include: { application: true },
  })
  const created: { bill: MonthlyBill; invoice: Invoice }[] = []

  for (const reading of readings) {
    const netUnits = reading.kwhImported - reading.kwhExported
    const amount = computeMonthlyAmount(netUnits, ratePerKwh, creditRatePerKwh)
    const dueDate = new Date(year, month - 1, 1)
    dueDate.setDate(dueDate.getDate() + 14)

    const invoice = await prisma.invoice.create({
      data: {
        applicationId: reading.applicationId ?? null,
        customerId: reading.application.customerId,
        type: "monthly_bill",
        description: `${dueDate.toLocaleString("default", { month: "long" })} Net Metering Bill`,
        amount,
        status: "pending",
        dueDate,
        paidAt: null,
      },
    })

    const bill: MonthlyBill = {
      id: `MB-${reading.id}`,
      invoiceId: invoice.id,
      customerId: reading.application.customerId,
      applicationId: reading.applicationId ?? null,
      month,
      year,
      kwhGenerated: reading.kwhGenerated,
      kwhExported: reading.kwhExported,
      kwhImported: reading.kwhImported,
      netAmount: amount,
      amount,
      status: "pending",
      createdAt: invoice.createdAt.toISOString(),
    }

    created.push({
      bill,
      invoice: {
        id: invoice.id,
        applicationId: invoice.applicationId,
        customerId: invoice.customerId,
        type: invoice.type,
        description: invoice.description,
        amount: invoice.amount,
        status: invoice.status,
        dueDate: invoice.dueDate.toISOString(),
        paidAt: invoice.paidAt?.toISOString() ?? null,
        createdAt: invoice.createdAt.toISOString(),
        updatedAt: invoice.updatedAt.toISOString(),
      },
    })
  }

  return created
}
