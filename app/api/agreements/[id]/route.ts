import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { sendAgreementNotification } from "@/lib/notifications"

// Helper to find installer user ID
async function resolveInstallerUserId(organizationId?: string | null) {
  if (!organizationId) return null
  const installerUser = await prisma.user.findFirst({
    where: { organizationId, role: "installer" },
  })
  return installerUser?.id ?? null
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const agreement = await prisma.agreement.findUnique({
    where: { id },
    include: { application: true },
  })

  if (!agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
  }

  // Access control
  if (user.role === "customer" && agreement.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (user.role === "installer" && agreement.installerOrganizationId !== user.organization?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ agreement })
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  console.log("👉 PATCH /api/agreements/[id] called") // DEBUG LOG

  const { id } = await context.params
  const user = await currentUser()
  
  // 1. Auth Check
  if (!user || user.role !== "officer") {
    console.log("❌ Unauthorized user:", user?.role) // DEBUG LOG
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const action = body.action as "send" | "approve" | undefined

  console.log(`👉 Action received: ${action}`) // DEBUG LOG

  const agreement = await prisma.agreement.findUnique({
    where: { id },
    include: { application: true },
  })

  if (!agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
  }

  // --- HANDLE SEND ACTION ---
  if (action === "send") {
    const updated = await prisma.agreement.update({
      where: { id },
      data: { sentAt: new Date(), status: "sent" },
    })

    await prisma.application.update({
      where: { id: agreement.applicationId },
      data: { status: "agreement_sent" },
    })

    // Notifications
    const customerLink = `/customer/agreements/${agreement.id}`
    await sendAgreementNotification(
      agreement.customerId,
      "Your agreement is ready. Please sign and upload the signed copy.",
      customerLink,
    )

    const installerUserId = await resolveInstallerUserId(agreement.installerOrganizationId)
    if (installerUserId) {
      const installerLink = `/installer/agreements/${agreement.id}`
      await sendAgreementNotification(
        installerUserId,
        "A customer agreement is ready. Please sign and upload the signed copy.",
        installerLink,
      )
    }

    return NextResponse.json({ agreement: updated })
  }

  // --- HANDLE APPROVE ACTION (THE IMPORTANT PART) ---
  if (action === "approve") {
    if (!agreement.customerSignedUrl || !agreement.installerSignedUrl) {
      console.log("❌ Missing signatures") // DEBUG LOG
      return NextResponse.json({ error: "Both signatures are required" }, { status: 400 })
    }

    console.log("👉 Attempting to approve agreement and create calibration...") // DEBUG LOG

    try {
      // Calculate date 30 days from now
      const firstScheduleDate = new Date()
      firstScheduleDate.setDate(firstScheduleDate.getDate() + 30)

      // USE TRANSACTION TO ENSURE CALIBRATION IS CREATED
      const [updatedAgreement, , newCalibration] = await prisma.$transaction([
        // 1. Approve Agreement
        prisma.agreement.update({
          where: { id },
          data: { officerApprovedAt: new Date(), status: "officer_approved" },
        }),

        // 2. Mark Application Complete
        prisma.application.update({
          where: { id: agreement.applicationId },
          data: { status: "completed" },
        }),

        // 3. CREATE FIRST CALIBRATION
        prisma.calibration.create({
          data: {
            applicationId: agreement.applicationId,
            scheduledAt: firstScheduleDate,
            status: "SCHEDULED",
          },
        }),
      ])

      console.log("✅ SUCCESS! Created Calibration ID:", newCalibration.id) // DEBUG LOG

      // Notifications
      await sendAgreementNotification(
        agreement.customerId,
        "Your agreement has been approved by the officer. System is live.",
      )

      const installerUserId = await resolveInstallerUserId(agreement.installerOrganizationId)
      if (installerUserId) {
        await sendAgreementNotification(
          installerUserId,
          "The agreement has been approved by the officer. Installation complete.",
        )
      }

      return NextResponse.json({ agreement: updatedAgreement })
    } catch (error) {
      console.error("❌ TRANSATION FAILED:", error) // DEBUG LOG
      return NextResponse.json({ error: "Database transaction failed", details: String(error) }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}