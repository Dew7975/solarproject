import { prisma } from "@/lib/prisma"
import { sendCalibrationScheduledNotification } from "@/lib/notifications"

export async function scheduleNextCalibration(
  applicationId: string,
  customerId: string,
  baseDate: Date
) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + 30)

  const calibration = await prisma.calibration.create({
    data: {
      applicationId,
      scheduledAt: nextDate,
      status: "SCHEDULED",
    },
  })

  // 🔔 notify customer
  await sendCalibrationScheduledNotification(
    customerId,
    calibration.id,
    nextDate
  )

  return calibration
}
