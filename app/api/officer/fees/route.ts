import { NextResponse } from "next/server"
import { currentUser } from "@/lib/services/auth"
import { getFees, updateFees } from "@/lib/fees"

export async function GET() {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const fees = await getFees()
  return NextResponse.json(fees)
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { siteVisitFee } = body as { siteVisitFee?: number }

  if (siteVisitFee === undefined || Number.isNaN(Number(siteVisitFee))) {
    return NextResponse.json(
      { error: "siteVisitFee is required" },
      { status: 400 },
    )
  }

  const fees = await updateFees({ siteVisitFee: Number(siteVisitFee) })
  return NextResponse.json(fees)
}
