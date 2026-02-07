import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { buildReportPdf } from "@/lib/pdf"
import { currentUser } from "@/lib/services/auth"

export const runtime = "nodejs"

type Ctx = { params: { id: string } | Promise<{ id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ✅ Works whether params is Promise or plain object
  const { id } = await Promise.resolve(ctx.params)

  if (!id) {
    return NextResponse.json({ error: "Missing calibration id" }, { status: 400 })
  }

  const calibration = await prisma.calibration.findUnique({
    where: { id },
    include: {
      application: { include: { customer: true } },
    },
  })

  if (!calibration) {
    return NextResponse.json({ error: "Calibration not found" }, { status: 404 })
  }

  // ✅ Only allow completed reports
  if (calibration.status !== "COMPLETED" || !calibration.completedAt) {
    return NextResponse.json(
      { error: "Report is available only after completion." },
      { status: 400 }
    )
  }

  // ✅ Customer can only access own report
  if (user.role === "customer" && calibration.application.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (user.role !== "customer" && user.role !== "officer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const pdfBuffer = await buildReportPdf({
    title: "CEB Solar Calibration Report",
    subtitle: `Application: ${calibration.applicationId}`,
    sections: [
      {
        title: "Calibration Details",
        lines: [
          { label: "Scheduled Date", value: calibration.scheduledAt.toISOString() },
          { label: "Completed Date", value: calibration.completedAt.toISOString() },
        ],
      },
      {
        title: "Recommendations",
        lines: [
          { label: "Officer Notes", value: calibration.recommendations || "N/A" },
        ],
      },
    ],
    footer: "Ceylon Electricity Board – Solar Division",
  })

  return new NextResponse(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="calibration-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}