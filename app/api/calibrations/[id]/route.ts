import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser()
  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const calibration = await prisma.calibration.findUnique({
    where: { id: params.id },
    include: { application: true },
  })

  if (!calibration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (calibration.application.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ calibration })
}