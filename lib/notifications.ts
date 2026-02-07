import { PaymentTransaction, Invoice } from "./prisma-types"
import { prisma } from "@/lib/prisma"

interface EmailPayload {
  to: string
  subject: string
  body: string
}

async function sendEmail({ to, subject, body }: EmailPayload) {
  const smtpUser = process.env.GMAIL_USER
  const smtpPass = process.env.GMAIL_APP_PASSWORD

  if (!smtpUser || !smtpPass) {
    console.log("[notification] email", { to, subject, body })
    return
  }

  const module = await import("nodemailer").catch(() => null)
  if (!module) {
    console.log("[notification] email", { to, subject, body })
    return
  }

  const nodemailer = (module as any).default ?? module
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  try {
    await transporter.sendMail({
      from: smtpUser,
      to,
      subject,
      text: body,
    })
  } catch (error) {
    console.warn("[notification] email failed", error)
  }
}

async function createNotification(userId: string, title: string, body: string, link?: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        link,
      },
    })
  } catch (error) {
    console.warn("[notification] failed to persist notification", error)
  }
}

async function resolveEmail(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user?.email ?? `${userId}@example.com`
}

export async function sendPaymentApprovedNotification(payment: PaymentTransaction) {
  const to = await resolveEmail(payment.customerId)
  await sendEmail({
    to,
    subject: `Payment ${payment.id} approved`,
    body: `Your payment for ${payment.type} has been approved. Reference: ${payment.reference ?? payment.id}.`,
  })
  await createNotification(
    payment.customerId,
    "Payment approved",
    `Your payment ${payment.id} has been approved.`,
  )
}

export async function sendPaymentRejectedNotification(payment: PaymentTransaction) {
  const to = await resolveEmail(payment.customerId)
  await sendEmail({
    to,
    subject: `Payment ${payment.id} rejected`,
    body: `Your payment could not be approved. Notes: ${payment.notes ?? "None provided."}`,
  })
  await createNotification(
    payment.customerId,
    "Payment rejected",
    `Your payment ${payment.id} was rejected. ${payment.notes ?? ""}`.trim(),
  )
}

export async function sendPaymentReminder(invoice: Invoice) {
  const to = await resolveEmail(invoice.customerId)
  await sendEmail({
    to,
    subject: `Reminder: Invoice ${invoice.id} is pending`,
    body: `${invoice.description} is due on ${new Date(invoice.dueDate).toDateString()}. Amount: ${invoice.amount}.`,
  })
  await createNotification(
    invoice.customerId,
    "Payment reminder",
    `${invoice.description} is due on ${new Date(invoice.dueDate).toDateString()}.`,
  )
}

export async function sendInstallationUpdate(customerId: string, message: string) {
  const to = await resolveEmail(customerId)
  await sendEmail({
    to,
    subject: "Installation update",
    body: message,
  })
  await createNotification(customerId, "Installation update", message)
}

export async function sendAgreementNotification(userId: string, message: string, link?: string) {
  const to = await resolveEmail(userId)
  await sendEmail({
    to,
    subject: "Agreement update",
    body: message,
  })
  await createNotification(userId, "Agreement update", message, link)
}

export async function sendSiteVisitScheduledNotification(
  customerId: string,
  visitDate: Date,
  address?: string | null,
) {
  const dateLabel = visitDate.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const body = address
    ? `A site visit has been scheduled for ${dateLabel} at ${address}.`
    : `A site visit has been scheduled for ${dateLabel}.`
  const to = await resolveEmail(customerId)
  await sendEmail({
    to,
    subject: "Site visit scheduled",
    body,
  })
  await createNotification(customerId, "Site visit scheduled", body)
}

export async function sendSiteVisitRescheduledNotification(
  customerId: string,
  visitDate: Date,
  address?: string | null,
) {
  const dateLabel = visitDate.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const body = address
    ? `A site visit has been rescheduled for ${dateLabel} at ${address}.`
    : `A site visit has been rescheduled for ${dateLabel}.`
  const to = await resolveEmail(customerId)
  await sendEmail({
    to,
    subject: "Reschedule site visit",
    body,
  })
  await createNotification(customerId, "Reschedule site visit", body)
}

export async function sendApplicationDecisionNotification(
  customerId: string,
  status: "approved" | "rejected",
  reason?: string | null,
) {
  const subject = status === "approved" ? "Application approved" : "Application rejected"
  const body =
    status === "approved"
      ? "Your solar application has been approved. You may now proceed with package selection."
      : `Your solar application was rejected. ${reason ?? "Please contact support for details."}`
  const to = await resolveEmail(customerId)
  await sendEmail({
    to,
    subject,
    body,
  })
  await createNotification(customerId, subject, body)
}

export async function sendPreVisitApprovalNotification(customerId: string) {
  const subject = "Application approved - site visit payment required"
  const body =
    "Your application has been approved. Please pay the site visit fee so we can schedule your visit."
  const to = await resolveEmail(customerId)
  await sendEmail({
    to,
    subject,
    body,
  })
  await createNotification(customerId, subject, body)
}

export async function sendInstallerVerificationNotification(
  installerUserId: string,
  status: "verified" | "suspended" | "rejected",
  reason?: string | null,
) {
  const subject =
    status === "verified"
      ? "Installer verification approved"
      : status === "suspended"
      ? "Installer account suspended"
      : "Installer verification rejected"
  const body =
    status === "verified"
      ? "Your installer organization has been verified."
      : status === "suspended"
      ? "Your installer organization has been suspended. Please contact support."
      : `Your installer organization was rejected.${reason ? ` Reason: ${reason}` : " Please contact support for details."}`

  const to = await resolveEmail(installerUserId)
  await sendEmail({
    to,
    subject,
    body,
  })
  await createNotification(installerUserId, subject, body)
}

export async function sendBidAcceptedNotification(
  customerId: string,
  installerUserId: string,
  bidPrice: number,
) {
  const subject = "Bid accepted"
  const body = `A bid has been accepted for LKR ${bidPrice.toLocaleString()}. Please proceed with the installation payment.`
  const installerEmail = await resolveEmail(installerUserId)
  await sendEmail({
    to: installerEmail,
    subject,
    body,
  })
  await createNotification(installerUserId, subject, body)
  await createNotification(customerId, subject, body)
}

export async function sendInvoicePaidNotification(
  customerId: string,
  invoiceId: string,
  amount: number,
) {
  const subject = "Payment received"
  const body = `Your payment for invoice ${invoiceId} (LKR ${amount.toLocaleString()}) was received.`
  const to = await resolveEmail(customerId)
  await sendEmail({
    to,
    subject,
    body,
  })
  await createNotification(customerId, subject, body)
}

export async function sendSiteVisitPaymentCompletedNotification(
  applicationId: string,
  invoiceId: string,
  amount: number,
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { customer: true },
  })

  if (!application) return

  const officers = await prisma.user.findMany({
    where: { role: "officer", status: "active" },
    select: { id: true },
  })

  if (officers.length === 0) return

  const amountLabel = `LKR ${Number(amount).toLocaleString()}`
  const visitDate = application.siteVisitDate
    ? ` Site visit date: ${application.siteVisitDate.toLocaleString()}.`
    : ""
  const address = application.customer?.address
    ? ` Address: ${application.customer.address}.`
    : ""

  const title = "Site visit payment completed"
  const body = `Application ${application.reference} for ${application.customer?.name ?? "customer"} paid the site visit fee (${amountLabel}). Invoice ${invoiceId}.${visitDate}${address}`.trim()

  await Promise.all(
    officers.map((officer) =>
      createNotification(officer.id, title, body, "/officer/applications"),
    ),
  )
}

export async function sendInstallationPaymentCompletedNotification(
  applicationId: string,
  invoiceId: string,
  amount: number,
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      customer: true,
      installerOrganization: { include: { users: true } },
    },
  })

  if (!application?.installerOrganization) return

  const installerUsers = application.installerOrganization.users.filter(
    (user) => user.role === "installer" && user.status === "active",
  )

  if (installerUsers.length === 0) return

  const amountLabel = `LKR ${Number(amount).toLocaleString()}`
  const title = "Installation payment completed"
  const body = `Installation payment received for application ${application.reference} (${amountLabel}). Invoice ${invoiceId}. Customer: ${application.customer?.name ?? "N/A"}.`

  await Promise.all(
    installerUsers.map((user) =>
      createNotification(user.id, title, body, "/installer/orders"),
    ),
  )
}

