import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth-server"
import { buildReportPdf } from "@/lib/pdf"

export async function GET(_: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (user.role !== "installer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (!user.organizationId) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 })
  }

  const applications = await prisma.application.findMany({
    where: { installerOrganizationId: user.organizationId },
  })

  const invoices = await prisma.invoice.findMany({
    where: { application: { installerOrganizationId: user.organizationId }, type: "installation" },
  })

  const bidSessions = await prisma.bidSession.findMany({
    where: { bids: { some: { organizationId: user.organizationId } } },
    include: { bids: true },
  })

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalInstallations = applications.filter((app) =>
    ["installation_in_progress", "installation_complete", "final_inspection", "completed"].includes(app.status),
  ).length
  const bidWins = bidSessions.filter((session) => session.bids.some((bid) => bid.status === "accepted")).length
  const bidSuccessRate = bidSessions.length ? Math.round((bidWins / bidSessions.length) * 100) : 0

  const pdf = buildReportPdf({
    title: "Installer Performance Report",
    subtitle: user.organization?.name ?? "Installer",
    sections: [
      {
        title: "Summary",
        lines: [
          { label: "Total Revenue", value: `LKR ${totalRevenue.toLocaleString()}` },
          { label: "Installations", value: String(totalInstallations) },
          { label: "Bid Success Rate", value: `${bidSuccessRate}%` },
        ],
      },
      {
        title: "Recent Orders",
        lines: applications.slice(0, 6).map((app) => ({
          label: app.reference,
          value: `${app.status} | ${app.updatedAt.toLocaleDateString()}`,
        })),
      },
    ],
    footer: "SolarConnect - Generated electronically.",
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"installer-report.pdf\"",
      "Cache-Control": "no-store",
    },
  })
}
