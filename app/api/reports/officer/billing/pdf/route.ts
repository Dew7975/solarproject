import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser, requireRole } from "@/lib/auth-server"
import { UserRole } from "@prisma/client"
import { buildReportPdf } from "@/lib/pdf"

export async function GET(_: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const forbidden = requireRole(user.role, [UserRole.officer])
  if (forbidden) return forbidden

  const invoices = await prisma.invoice.findMany({
    include: { application: { select: { reference: true } } },
    orderBy: { createdAt: "desc" },
  })
  const readings = await prisma.meterReading.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  })

  const monthlyBills = invoices.filter((inv) => inv.type === "monthly_bill")
  const totalPending = monthlyBills.filter((inv) => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0)
  const totalCredits = monthlyBills.filter((inv) => inv.amount < 0).reduce((sum, inv) => sum + Math.abs(inv.amount), 0)
  const totalNetExport = readings.reduce((sum, r) => sum + Math.max(0, r.kwhExported - r.kwhImported), 0)

  const pdf = buildReportPdf({
    title: "Billing Summary Report",
    subtitle: `Generated ${new Date().toLocaleDateString()}`,
    sections: [
      {
        title: "Totals",
        lines: [
          { label: "Monthly Bills", value: String(monthlyBills.length) },
          { label: "Pending Collection", value: `LKR ${totalPending.toLocaleString()}` },
          { label: "Customer Credits", value: `LKR ${totalCredits.toLocaleString()}` },
          { label: "Net Grid Export", value: `${totalNetExport} kWh` },
        ],
      },
      {
        title: "Recent Bills",
        lines: monthlyBills.slice(0, 8).map((inv) => ({
          label: inv.application?.reference ?? "N/A",
          value: `${inv.description} | ${inv.amount} | ${inv.status}`,
        })),
      },
    ],
    footer: "SolarConnect - Generated electronically.",
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"billing-summary.pdf\"",
      "Cache-Control": "no-store",
    },
  })
}
