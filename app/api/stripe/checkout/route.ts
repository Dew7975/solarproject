import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { getStripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const invoiceId = body?.invoiceId as string | undefined
    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId is required" }, { status: 400 })
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    if (user.role === "customer" && invoice.customerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 409 })
    }

    if (invoice.amount <= 0) {
      return NextResponse.json({ error: "Invoice amount must be greater than 0" }, { status: 400 })
    }

    const stripe = getStripe()
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"

    const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase()
    const unitAmount = Math.round(invoice.amount * 100)
    const maxAmount = 999999.99
    if (invoice.amount > maxAmount) {
      return NextResponse.json(
        {
          error: `Invoice amount exceeds Stripe limit of ${maxAmount.toLocaleString()} ${currency.toUpperCase()}.`,
        },
        { status: 400 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: invoice.description || "Solar invoice",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoiceId: invoice.id,
        customerId: invoice.customerId,
      },
      success_url: `${origin}/customer/invoices/${invoice.id}?success=1`,
      cancel_url: `${origin}/customer/invoices/${invoice.id}?canceled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[stripe] checkout failed", error)
    return NextResponse.json(
      { error: "Unable to start payment. Check Stripe configuration." },
      { status: 500 },
    )
  }
}
