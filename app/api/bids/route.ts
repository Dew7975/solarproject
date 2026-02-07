import { addHours } from "date-fns"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export const dynamic = "force-dynamic"

function mapBid(bid: any, applicationReference: string) {
  return {
    id: bid.id,
    applicationId: applicationReference,
    installerId: bid.organizationId,
    installerName: bid.organization?.name || "Installer",
    packageName: bid.package?.name,
    contact: {
      email: bid.installer?.email,
      phone: bid.installer?.phone || bid.organization?.phone,
    },
    installerRating: bid.organization?.rating,
    completedProjects: bid.organization?.completedInstallations,
    price: bid.price,
    proposal: bid.proposal,
    warranty: bid.warranty,
    estimatedDays: bid.estimatedDays,
    createdAt: bid.createdAt,
    status: bid.status,
  }
}

function mapSession(session: any) {
  const details = session.application?.technicalDetails || {}
  const acceptedBid = session.bids.find((bid: any) => bid.status === "accepted")
  const selectedPackage =
    session.selectedPackage ?? session.application?.selectedPackage ?? null

  return {
    id: session.id,
    applicationId: session.application.reference,
    customerId: session.customerId,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    status: session.status,
    bidType: session.bidType ?? "open",
    requirements: session.requirements ?? null,
    maxBudget: session.maxBudget ?? null,
    selectedBidId: acceptedBid?.id,
    applicationDetails: {
      address:
        details.siteAddress ||
        details.address ||
        session.application.customer?.address ||
        "Address not provided",
      capacity:
        details.desiredCapacity ||
        details.systemCapacity ||
        details.capacity ||
        "Capacity TBD",
      customerPhone: session.application.customer?.phone,
      customerEmail: session.application.customer?.email,
      selectedPackageName: selectedPackage?.name,
      selectedPackagePrice: selectedPackage?.price,
    },
    bids: session.bids.map((bid: any) => mapBid(bid, session.application.reference)),
  }
}

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessions = await prisma.bidSession.findMany({
    where:
      user.role === "customer"
        ? { customerId: user.id }
        : user.role === "installer" && user.organization
        ? {
            OR: [
              { status: "open" },
              { bids: { some: { organizationId: user.organization.id } } },
            ],
          }
        : undefined,
    include: {
      application: { include: { customer: true, selectedPackage: true } },
      selectedPackage: true,
      bids: {
        include: {
          installer: true,
          organization: true,
          package: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
  })

  return NextResponse.json({
    bidSessions: sessions.map(mapSession),
  })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // ✅ IMPORTANT: your UI sends applicationId = application.reference
  const application = await prisma.application.findFirst({
    where: { reference: body.applicationId },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  // ✅ Security: customer can only open bids for own application
  if (user.role === "customer" && application.customerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // ✅ Customer opens or extends a bid session
  if (user.role === "customer") {
    // Only allow bidding for approved applications (change if you want)
    if (application.status !== "approved") {
      return NextResponse.json(
        { error: "Only approved applications can open bid sessions." },
        { status: 400 },
      )
    }

    // ✅ Support both:
    // - durationHours (your UI)
    // - expiresInDays (older code)
    const durationHoursRaw =
      body.durationHours != null ? Number(body.durationHours) : null

    const expiresInDaysRaw =
      body.expiresInDays != null ? Number(body.expiresInDays) : null

    const durationHours =
      durationHoursRaw && Number.isFinite(durationHoursRaw) && durationHoursRaw > 0
        ? durationHoursRaw
        : (expiresInDaysRaw && Number.isFinite(expiresInDaysRaw) && expiresInDaysRaw > 0
            ? expiresInDaysRaw * 24
            : 2 * 24) // fallback 48h

    // optional limit (ex: max 14 days)
    if (durationHours > 24 * 14) {
      return NextResponse.json({ error: "Duration too long." }, { status: 400 })
    }

    const existing = await prisma.bidSession.findFirst({
      where: { applicationId: application.id },
      include: {
        application: { include: { customer: true, selectedPackage: true } },
        selectedPackage: true,
        bids: {
          include: {
            installer: true,
            organization: true,
            package: true,
          },
        },
      },
    })

    const session = existing
      ? await prisma.bidSession.update({
          where: { id: existing.id },
          data: {
            status: "open",
            bidType: body.bidType ?? existing.bidType,
            requirements: body.requirements ?? existing.requirements,
            maxBudget: body.maxBudget ?? existing.maxBudget,
            selectedPackageId: body.selectedPackageId ?? existing.selectedPackageId,
            // ✅ FIX: use durationHours (not expiresInDays default)
            expiresAt: addHours(new Date(), durationHours),
          },
          include: {
            application: { include: { customer: true, selectedPackage: true } },
            selectedPackage: true,
            bids: {
              include: {
                installer: true,
                organization: true,
                package: true,
              },
            },
          },
        })
      : await prisma.bidSession.create({
          data: {
            applicationId: application.id,
            customerId: application.customerId,
            status: "open",
            bidType: body.bidType ?? "open",
            requirements: body.requirements ?? null,
            maxBudget: body.maxBudget ?? null,
            selectedPackageId: body.selectedPackageId ?? null,
            startedAt: new Date(),
            // ✅ FIX: use durationHours (not expiresInDays default)
            expiresAt: addHours(new Date(), durationHours),
          },
          include: {
            application: { include: { customer: true, selectedPackage: true } },
            selectedPackage: true,
            bids: {
              include: {
                installer: true,
                organization: true,
                package: true,
              },
            },
          },
        })

    return NextResponse.json({ bidSession: mapSession(session) }, { status: 201 })
  }

  // ✅ Installer submits a bid
  if (user.role !== "installer" || !user.organization) {
    return NextResponse.json({ error: "Only installers can submit bids" }, { status: 403 })
  }
  if (user.verified === false) {
    return NextResponse.json(
      { error: "Installer account is pending verification." },
      { status: 403 },
    )
  }

  const session =
    (body.bidSessionId &&
      (await prisma.bidSession.findUnique({
        where: { id: body.bidSessionId },
        include: { application: true, selectedPackage: true },
      }))) ||
    (await prisma.bidSession.findFirst({
      where: { applicationId: application.id },
      include: { application: true, selectedPackage: true },
    })) ||
    (await prisma.bidSession.create({
      data: {
        applicationId: application.id,
        customerId: application.customerId,
        status: "open",
        bidType: body.bidType ?? "open",
        requirements: body.requirements ?? null,
        maxBudget: body.maxBudget ?? null,
        selectedPackageId: body.selectedPackageId ?? null,
        startedAt: new Date(),
        expiresAt: addHours(new Date(), 48),
      },
      include: { application: true, selectedPackage: true },
    }))

  const numericPrice = Number(body.price)
  if (
    session.maxBudget !== null &&
    session.maxBudget !== undefined &&
    numericPrice > session.maxBudget
  ) {
    return NextResponse.json(
      { error: "Bid price exceeds the maximum budget for this session." },
      { status: 400 },
    )
  }

  const bid = await prisma.bid.create({
    data: {
      applicationId: application.id,
      bidSessionId: session.id,
      installerId: user.id,
      organizationId: user.organization.id,
      packageId: body.packageId,
      price: numericPrice,
      proposal: body.proposal || "Installer proposal",
      warranty: body.warranty || "Standard warranty",
      estimatedDays: body.estimatedDays || 7,
      status: "pending",
    },
    include: {
      installer: true,
      organization: true,
      package: true,
    },
  })

  return NextResponse.json({ bid: mapBid(bid, application.reference) }, { status: 201 })
}