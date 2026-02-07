import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth-server"
import { buildReportPdf } from "@/lib/pdf"

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const application = await prisma.application.findFirst({
    where: { OR: [{ id }, { reference: id }] },
    include: {
      customer: true,
      installerOrganization: true,
      selectedPackage: true,
    },
  })

  if (!application) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  if (user.role === "customer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (user.role === "installer") {
    if (!user.organizationId || application.installerOrganizationId !== user.organizationId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const pdf = buildReportPdf({
    title: "Installation Order Report",
    subtitle: application.reference,
    sections: [
      {
        title: "Customer",
        lines: [
          { label: "Name", value: application.customer?.name ?? "N/A" },
          { label: "Phone", value: application.customer?.phone ?? "N/A" },
          { label: "Email", value: application.customer?.email ?? "N/A" },
          { label: "Address", value: application.customer?.address ?? "N/A" },
        ],
      },
      {
        title: "Installation",
        lines: [
          { label: "Installer", value: application.installerOrganization?.name ?? "N/A" },
          { label: "Package", value: application.selectedPackage?.name ?? "N/A" },
          { label: "Status", value: application.status },
          { label: "Site Visit", value: application.siteVisitDate?.toLocaleString() ?? "N/A" },
          { label: "Updated", value: application.updatedAt.toLocaleDateString() },
        ],
      },
    ],
    footer: "SolarConnect - Generated electronically.",
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="order-${application.reference}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}
