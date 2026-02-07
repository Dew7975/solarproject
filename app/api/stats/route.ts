import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { userId } = body as { userId?: string }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  if (user.role !== "officer" && user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const applications = await prisma.application.findMany({
    where: { customerId: userId },
    select: { id: true, status: true },
  })

  const readings = await prisma.meterReading.findMany({
    where: { application: { customerId: userId } },
  })

  const totals = readings.reduce(
    (acc, reading) => {
      acc.kwhGenerated += reading.kwhGenerated
      acc.kwhExported += reading.kwhExported
      acc.kwhImported += reading.kwhImported
      return acc
    },
    { kwhGenerated: 0, kwhExported: 0, kwhImported: 0 },
  )

  const co2Kg = totals.kwhGenerated * 0.85

  return NextResponse.json({
    userId,
    totals: {
      kwhGenerated: totals.kwhGenerated,
      kwhExported: totals.kwhExported,
      kwhImported: totals.kwhImported,
      co2Kg,
    },
    applications: {
      total: applications.length,
      approved: applications.filter((a) => a.status === "approved").length,
      pending: applications.filter((a) => a.status === "pending").length,
    },
  })
}
