import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { getFees } from "@/lib/fees"

export async function POST() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const fees = await getFees()

  const pendingApp = await prisma.application.findFirst({
    where: { customerId: user.id, status: "payment_pending" },
    orderBy: { createdAt: "desc" },
  })

  if (!pendingApp) {
    return NextResponse.json(
      { error: "Submit the application to generate a fee invoice." },
      { status: 400 },
    )
  }

  const existing = await prisma.invoice.findFirst({
    where: {
      customerId: user.id,
      applicationId: pendingApp.id,
      type: "authority_fee",
      description: "Site visit fee",
    },
    orderBy: { createdAt: "desc" },
  })

  if (existing) {
    return NextResponse.json({
      paid: existing.status === "paid",
      invoiceId: existing.id,
      status: existing.status,
      amount: fees.siteVisitFee,
    })
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 7)

  const invoice = await prisma.invoice.create({
    data: {
      applicationId: pendingApp.id,
      customerId: user.id,
      amount: fees.siteVisitFee,
      description: "Site visit fee",
      dueDate,
      status: "pending",
      type: "authority_fee",
    },
  })

  return NextResponse.json({
    paid: false,
    invoiceId: invoice.id,
    status: invoice.status,
    amount: fees.siteVisitFee,
  })
}
