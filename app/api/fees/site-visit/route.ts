import { NextResponse } from "next/server"
import { getFees } from "@/lib/fees"

export async function GET() {
  const fees = await getFees()
  return NextResponse.json({ amount: fees.siteVisitFee })
}
