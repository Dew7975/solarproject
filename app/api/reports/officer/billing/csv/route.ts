import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser, requireRole } from "@/lib/auth-server"
import { UserRole } from "@prisma/client"

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

  const headers = [
    "application",
    "invoice_id",
    "description",
    "amount",
    "status",
    "due_date",
    "net_kwh",
  ]

  const rows = invoices
    .filter((inv) => inv.type === "monthly_bill")
    .map((inv) => {
      const month = inv.dueDate.getMonth() + 1
      const year = inv.dueDate.getFullYear()
      const reading = readings.find((r) => r.applicationId === inv.applicationId && r.month === month && r.year === year)
      const net = reading ? reading.kwhExported - reading.kwhImported : 0
      return [
        inv.application?.reference ?? "",
        inv.id,
        inv.description.replace(/,/g, " "),
        String(inv.amount),
        inv.status,
        inv.dueDate.toISOString().split("T")[0],
        String(net),
      ].join(",")
    })

  const csv = [headers.join(","), ...rows].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=\"billing-summary.csv\"",
      "Cache-Control": "no-store",
    },
  })
}
