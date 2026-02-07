import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { buildReportPdf, writePdfToPublic } from "@/lib/pdf"

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      application: { select: { reference: true, installerOrganizationId: true } },
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  if (user.role === "customer" && invoice.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (user.role === "installer") {
    if (!user.organization) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (invoice.application?.installerOrganizationId !== user.organization.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const pdf = buildReportPdf({
    title: "SolarConnect Invoice",
    subtitle: `Invoice ${invoice.id}`,
    sections: [
      {
        title: "Customer",
        lines: [
          { label: "Name", value: invoice.customer?.name ?? "N/A" },
          { label: "Email", value: invoice.customer?.email ?? "N/A" },
        ],
      },
      {
        title: "Invoice Details",
        lines: [
          { label: "Application", value: invoice.application?.reference ?? "N/A" },
          { label: "Type", value: invoice.type.replace("_", " ") },
          { label: "Description", value: invoice.description },
          { label: "Amount", value: `LKR ${Number(invoice.amount).toLocaleString()}` },
          { label: "Status", value: invoice.status },
          { label: "Due Date", value: invoice.dueDate.toLocaleDateString() },
          { label: "Issued", value: invoice.createdAt.toLocaleDateString() },
        ],
      },
    ],
    footer: "SolarConnect - Generated electronically.",
  })

  if (!invoice.pdfUrl) {
    const pdfUrl = await writePdfToPublic({
      filename: `invoice-${invoice.id}.pdf`,
      buffer: pdf,
    })
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdfUrl },
    })
  }

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}
