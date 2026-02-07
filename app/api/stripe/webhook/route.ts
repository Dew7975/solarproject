import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import {
  sendInvoicePaidNotification,
  sendInstallationPaymentCompletedNotification,
  sendSiteVisitPaymentCompletedNotification,
} from "@/lib/notifications"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const signature = headers().get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const body = await req.text()
  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    console.warn("[stripe] webhook signature error", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const invoiceId = session.metadata?.invoiceId
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
      if (invoice && invoice.status !== "paid") {
        const updated = await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "paid",
            paidAt: new Date(),
          },
        })

        if (
          updated.type === "authority_fee" &&
          updated.description === "Site visit fee" &&
          updated.applicationId
        ) {
          await prisma.application.update({
            where: { id: updated.applicationId },
            data: { status: "site_visit_payment_completed" },
          })
          await sendSiteVisitPaymentCompletedNotification(
            updated.applicationId,
            updated.id,
            updated.amount,
          )
        }

        if (updated.type === "installation" && updated.applicationId) {
          await prisma.application.update({
            where: { id: updated.applicationId },
            data: { status: "payment_confirmed" },
          })
          await sendInstallationPaymentCompletedNotification(
            updated.applicationId,
            updated.id,
            updated.amount,
          )
        }

        await sendInvoicePaidNotification(updated.customerId, updated.id, updated.amount)
      }
    }
  }

  return NextResponse.json({ received: true })
}
