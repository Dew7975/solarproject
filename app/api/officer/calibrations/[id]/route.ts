import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { sendInstallationUpdate } from "@/lib/notifications"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const user = await currentUser()
  
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { checklist, readings, recommendations } = await req.json()

  const calibration = await prisma.calibration.findUnique({
    where: { id },
    include: { application: true },
  })

  if (!calibration) {
    return NextResponse.json({ error: "Calibration not found" }, { status: 404 })
  }

  // Check if it's already completed to prevent duplicate next-steps
  if (calibration.status === "COMPLETED") {
    return NextResponse.json({ error: "Already completed" }, { status: 409 })
  }

  const now = new Date()
  
  // Logic: Calculate date for next month (30 days from now)
  const nextScheduledAt = new Date(now)
  nextScheduledAt.setDate(nextScheduledAt.getDate() + 30)

  // Transaction: Update current AND Create next
  const [updatedCalibration, newCalibration] = await prisma.$transaction([
    // 1. Update the current calibration to COMPLETED
    prisma.calibration.update({
      where: { id },
      data: {
        checklist,
        readings,
        recommendations,
        completedAt: now,
        status: "COMPLETED",
        nextScheduledAt: nextScheduledAt, // Keep this for reference in history
      },
    }),

    // 2. Create the NEW calibration record for next month
    prisma.calibration.create({
      data: {
        applicationId: calibration.applicationId,
        scheduledAt: nextScheduledAt,
        status: "SCHEDULED",
      },
    }),
  ])

  // Notify customer
  await sendInstallationUpdate(
    calibration.application.customerId,
    `Calibration completed. The next maintenance has been auto-scheduled for ${nextScheduledAt.toLocaleDateString()}.`
  )

  return NextResponse.json({ 
    calibration: updatedCalibration,
    nextCalibration: newCalibration 
  })
}