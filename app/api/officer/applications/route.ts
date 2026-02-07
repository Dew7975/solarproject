import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { getFees } from "@/lib/fees"
import {
  sendApplicationDecisionNotification,
  sendPreVisitApprovalNotification,
  sendSiteVisitRescheduledNotification,
  sendSiteVisitScheduledNotification,
} from "@/lib/notifications"
import { ApplicationStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

/* ----------------------------- */
/* Helpers                       */
/* ----------------------------- */

function mapApplication(application: any) {
  const siteVisitInvoice = application.invoices?.find(
    (invoice: any) =>
      invoice.type === "authority_fee" && invoice.description === "Site visit fee",
  )

  return {
    id: application.reference,
    reference: application.reference,
    status: application.status,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    customerId: application.customerId,
    customerName: application.customer.name,
    email: application.customer.email,
    phone: application.customer.phone,
    address: application.customer.address,
    documents: application.documents,
    technicalDetails: application.technicalDetails,
    siteVisitDate: application.siteVisitDate,
    rejectionReason: application.rejectionReason,
    siteVisitFeePaid: siteVisitInvoice?.status === "paid",
  }
}

/* ----------------------------- */
/* GET – officer applications    */
/* ----------------------------- */

export async function GET() {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const applications = await prisma.application.findMany({
    include: {
      customer: true,
      invoices: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    applications: applications.map(mapApplication),
  })
}

/* ----------------------------- */
/* POST – officer decision       */
/* ----------------------------- */

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { applicationId, status, rejectionReason, siteVisitDate } = body || {}

  if (!applicationId || !status) {
    return NextResponse.json(
      { error: "applicationId and status are required" },
      { status: 400 },
    )
  }

  if (!Object.values(ApplicationStatus).includes(status)) {
    return NextResponse.json(
      { error: `Invalid status: ${status}` },
      { status: 400 },
    )
  }

  const application = await prisma.application.findFirst({
    where: { reference: applicationId },
    include: {
      customer: true,
      invoices: true,
    },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  /* ----------------------------- */
  /* ✅ compute nextSiteVisitDate  */
  /* ----------------------------- */

  const nextSiteVisitDate =
    siteVisitDate != null ? new Date(siteVisitDate) : application.siteVisitDate

  // If officer sent a date, validate it
  if (siteVisitDate != null && (!nextSiteVisitDate || Number.isNaN(nextSiteVisitDate.getTime()))) {
    return NextResponse.json({ error: "Invalid site visit date." }, { status: 400 })
  }

  /* ----------------------------- */
  /* ✅ compute isReschedule       */
  /* ----------------------------- */
  const isReschedule =
    status === "site_visit_scheduled" &&
    application.status === "site_visit_scheduled" &&
    !!application.siteVisitDate &&
    !!nextSiteVisitDate &&
    application.siteVisitDate.getTime() !== nextSiteVisitDate.getTime()

  /* ----------------------------- */
  /* Status rules                  */
  /* ----------------------------- */

  if (status === "approved" && application.status !== "site_visit_scheduled") {
    return NextResponse.json(
      { error: "Site visit must be completed before approval." },
      { status: 400 },
    )
  }

  if ((status === "approved" || status === "rejected") && application.siteVisitDate) {
    const now = new Date()
    if (now < application.siteVisitDate) {
      return NextResponse.json(
        { error: "Site visit cannot be completed before the scheduled time." },
        { status: 400 },
      )
    }
  }

  if (status === "site_visit_scheduled") {
    if (
      application.status !== "site_visit_payment_completed" &&
      application.status !== "site_visit_scheduled"
    ) {
      return NextResponse.json(
        { error: "Site visit payment must be completed before scheduling." },
        { status: 400 },
      )
    }

    const fees = await getFees()
    if (fees.siteVisitFee > 0) {
      const paidFee = await prisma.invoice.findFirst({
        where: {
          applicationId: application.id,
          type: "authority_fee",
          description: "Site visit fee",
          status: "paid",
        },
      })

      if (!paidFee) {
        return NextResponse.json({ error: "Site visit fee must be paid." }, { status: 400 })
      }
    }

    if (!nextSiteVisitDate) {
      return NextResponse.json({ error: "Invalid site visit date." }, { status: 400 })
    }

    if (nextSiteVisitDate <= application.createdAt) {
      return NextResponse.json(
        { error: "Site visit date must be after the application submission date." },
        { status: 400 },
      )
    }
  }

  /* ----------------------------- */
  /* ✅ APPROVED CAPACITY FIX      */
  /* ----------------------------- */

  let updatedTechnicalDetails = application.technicalDetails as Record<string, any>

  if (status === "approved") {
    const desiredCapacity = Number(updatedTechnicalDetails?.desiredCapacity)

    if (!desiredCapacity || isNaN(desiredCapacity)) {
      return NextResponse.json(
        {
          error:
            "Approved capacity missing. Officer must verify desired capacity before approval.",
        },
        { status: 400 },
      )
    }

    updatedTechnicalDetails = {
      ...updatedTechnicalDetails,
      approvedCapacityKw: desiredCapacity,
    }
  }

  /* ----------------------------- */
  /* Update application            */
  /* ----------------------------- */

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: {
      status,
      rejectionReason: rejectionReason ?? application.rejectionReason,
      siteVisitDate: nextSiteVisitDate,
      technicalDetails: updatedTechnicalDetails,
    },
    include: {
      customer: true,
      invoices: true,
    },
  })

  /* ----------------------------- */
  /* Notifications + invoices      */
  /* ----------------------------- */

  if (status === "pre_visit_approved") {
    const fees = await getFees()
    if (fees.siteVisitFee > 0) {
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          applicationId: application.id,
          type: "authority_fee",
          description: "Site visit fee",
        },
      })

      if (!existingInvoice) {
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 7)

        await prisma.invoice.create({
          data: {
            applicationId: application.id,
            customerId: application.customerId,
            amount: fees.siteVisitFee,
            description: "Site visit fee",
            dueDate,
            status: "pending",
            type: "authority_fee",
          },
        })
      }
    }

    await sendPreVisitApprovalNotification(updated.customerId)
  }

  if (status === "site_visit_scheduled" && updated.siteVisitDate) {
    if (isReschedule) {
      await sendSiteVisitRescheduledNotification(
        updated.customerId,
        updated.siteVisitDate,
        updated.customer.address ?? null,
      )
    } else {
      await sendSiteVisitScheduledNotification(
        updated.customerId,
        updated.siteVisitDate,
        updated.customer.address ?? null,
      )
    }
  }

  if (status === "approved" || status === "rejected") {
    await sendApplicationDecisionNotification(
      updated.customerId,
      status,
      updated.rejectionReason ?? null,
    )
  }

  return NextResponse.json({
    application: mapApplication(updated),
  })
}