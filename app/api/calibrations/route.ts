import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function GET() {
  const user = await currentUser()
  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const calibrations = await prisma.calibration.findMany({
    where: { application: { customerId: user.id } },
    orderBy: { scheduledAt: "desc" },
  })

  return NextResponse.json({ calibrations })
}