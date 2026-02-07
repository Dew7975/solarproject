import { NextResponse } from "next/server"

import { getApprovedApplications } from "@/lib/data"

export async function GET() {
  const applications = getApprovedApplications()
  return NextResponse.json({ applications })
}
