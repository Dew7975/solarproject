import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"
import { ApplicationStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

const REVIEW_ALLOWED_STATUSES: ApplicationStatus[] = [
  "installation_complete",
  "officer_final_approved",
  "completed",
]

async function updateOrganizationRating(installerOrgId: string) {
  const agg = await prisma.review.aggregate({
    where: { installerOrganizationId: installerOrgId },
    _avg: { rating: true },
    _count: { rating: true },
  })

  await prisma.organization.update({
    where: { id: installerOrgId },
    data: { rating: agg._avg.rating ?? 0 },
  })

  return { avg: agg._avg.rating ?? 0, count: agg._count.rating }
}

// GET /api/reviews?installerId=...   (installerId == Organization.id)
export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const installerId = searchParams.get("installerId")
    if (!installerId) {
      return NextResponse.json({ error: "installerId is required" }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { installerOrganizationId: installerId },
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, profileImageUrl: true } },
      },
    })

    const stats = await prisma.review.aggregate({
      where: { installerOrganizationId: installerId },
      _avg: { rating: true },
      _count: { rating: true },
    })

    return NextResponse.json({
      reviews,
      ratingAvg: stats._avg.rating ?? 0,
      ratingCount: stats._count.rating,
    })
  } catch (e) {
    console.error("GET /api/reviews error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/reviews  body: { applicationRef, rating, comment? }
export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "customer") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const applicationRef = String(body.applicationRef ?? "")
    const rating = Number(body.rating)
    const comment = body.comment ? String(body.comment) : null

    if (!applicationRef) {
      return NextResponse.json({ error: "applicationRef is required" }, { status: 400 })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 })
    }

    const app = await prisma.application.findUnique({
      where: { reference: applicationRef },
      select: {
        id: true,
        customerId: true,
        status: true,
        installerOrganizationId: true,
      },
    })

    if (!app || app.customerId !== user.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
    if (!REVIEW_ALLOWED_STATUSES.includes(app.status)) {
      return NextResponse.json({ error: `Not allowed in status: ${app.status}` }, { status: 400 })
    }
    if (!app.installerOrganizationId) {
      return NextResponse.json({ error: "Installer not assigned for this application" }, { status: 400 })
    }

    // Upsert = create if first time, otherwise update (supports “edit later”)
    const review = await prisma.review.upsert({
      where: {
        customerId_applicationId: {
          customerId: user.id,
          applicationId: app.id,
        },
      },
      create: {
        rating,
        comment,

        // IMPORTANT: connect relations (fixes “Argument `application` is missing.”)
        application: { connect: { id: app.id } },
        customer: { connect: { id: user.id } },
        installerOrganization: { connect: { id: app.installerOrganizationId } },
      },
      update: {
        rating,
        comment,
      },
    })

    await updateOrganizationRating(app.installerOrganizationId)

    return NextResponse.json({ review }, { status: 201 })
  } catch (e: any) {
    console.error("POST /api/reviews error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}