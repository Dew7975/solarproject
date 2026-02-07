import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { sendPaymentReminder } from "@/lib/notifications"

export const dynamic = "force-dynamic"

/* ------------------------------------------------------------------ */
/* GET /api/payments/[id]                                              */
/* ------------------------------------------------------------------ */

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
  })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  if (user.role === "customer" && invoice.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ payment: invoice })
}

/* ------------------------------------------------------------------ */
/* PATCH /api/payments/[id]                                            */
/* ------------------------------------------------------------------ */

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Only officers can verify or reject payments
  if (user.role !== "officer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const invoice = await prisma.invoice.findUnique({ where: { id } })

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  const body = await req.json()
  const { status, note } = body as {
    status?: "pending" | "paid" | "overdue"
    note?: string
  }

  if (!status) {
    return NextResponse.json(
      { error: "status is required" },
      { status: 400 },
    )
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      status,
      paidAt: status === "paid" ? new Date() : invoice.paidAt,
    },
  })

  if (status === "pending") {
    await sendPaymentReminder({
      ...updated,
      dueDate: updated.dueDate.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      paidAt: updated.paidAt?.toISOString() ?? null,
    })
  }

  if (note) {
    console.log("[payment-note]", { invoiceId: id, note })
  }

  return NextResponse.json({ payment: updated })
}
