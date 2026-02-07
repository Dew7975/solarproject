import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { getFees } from "@/lib/fees"

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const fees = await getFees()
  const ignorePaid = new URL(req.url).searchParams.get("ignorePaid")
  if (ignorePaid === "true") {
    return NextResponse.json({
      amount: fees.siteVisitFee,
      paid: false,
      invoiceId: null,
      status: null,
    })
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      customerId: user.id,
      type: "authority_fee",
      description: "Site visit fee",
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    amount: fees.siteVisitFee,
    paid: invoice?.status === "paid",
    invoiceId: invoice?.id ?? null,
    status: invoice?.status ?? null,
  })
}
