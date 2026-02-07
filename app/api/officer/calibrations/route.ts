import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function GET() {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // You can filter by assigned officer etc. if your schema supports it.
  const calibrations = await prisma.calibration.findMany({
    include: {
      application: {
        select: {
          id: true,
          
          // referenceNo: true,
          customer: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { scheduledAt: "asc" },
  })

  return NextResponse.json({ calibrations })
}