import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth-server"
import { buildReportPdf } from "@/lib/pdf"

export async function GET(_: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (user.role !== "customer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const readings = await prisma.meterReading.findMany({
    where: { application: { customerId: user.id } },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })

  const invoices = await prisma.invoice.findMany({
    where: { customerId: user.id, type: "monthly_bill" },
    orderBy: { dueDate: "desc" },
  })

  const totalGenerated = readings.reduce((sum, r) => sum + r.kwhGenerated, 0)
  const totalExported = readings.reduce((sum, r) => sum + r.kwhExported, 0)
  const totalImported = readings.reduce((sum, r) => sum + r.kwhImported, 0)
  const totalSavings = invoices
    .map((inv) => inv.amount)
    .filter((amount) => amount < 0)
    .reduce((sum, amount) => sum + Math.abs(amount), 0)

  const pdf = buildReportPdf({
    title: "Customer Energy Report",
    subtitle: user.name,
    sections: [
      {
        title: "Summary",
        lines: [
          { label: "Total Generated", value: `${totalGenerated} kWh` },
          { label: "Total Exported", value: `${totalExported} kWh` },
          { label: "Total Imported", value: `${totalImported} kWh` },
          { label: "Net Export", value: `${totalExported - totalImported} kWh` },
          { label: "Total Savings", value: `LKR ${totalSavings.toLocaleString()}` },
        ],
      },
      {
        title: "Recent Months",
        lines: readings.slice(0, 6).map((reading) => {
          const bill = invoices.find(
            (inv) =>
              inv.dueDate.getMonth() + 1 === reading.month &&
              inv.dueDate.getFullYear() === reading.year,
          )
          return {
            label: `${reading.year}-${String(reading.month).padStart(2, "0")}`,
            value: `Gen ${reading.kwhGenerated} | Exp ${reading.kwhExported} | Imp ${reading.kwhImported} | Bill ${bill?.amount ?? 0}`,
          }
        }),
      },
    ],
    footer: "SolarConnect - Generated electronically.",
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"customer-report.pdf\"",
      "Cache-Control": "no-store",
    },
  })
}
