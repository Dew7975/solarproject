import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export const dynamic = "force-dynamic"

async function updateOrganizationRating(installerOrgId: string) {
  const agg = await prisma.review.aggregate({
    where: {
      installerOrganization: {
        id: installerOrgId,
      },
    },
    _avg: { rating: true },
  })

  await prisma.organization.update({
    where: { id: installerOrgId },
    data: {
      rating: agg._avg.rating ?? 0,
    },
  })
}

type Ctx = {
  params: Promise<{ id: string }> | { id: string }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "customer") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await Promise.resolve(ctx.params)
    if (!id) return NextResponse.json({ error: "Missing review id" }, { status: 400 })

    const body = await req.json()
    const rating = Number(body?.rating)
    const comment =
      body?.comment?.toString().trim() || null

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be 1–5" }, { status: 400 })
    }

  const existing = await prisma.review.findUnique({
  where: { id },
  select: {
    customerId: true,
    installerOrganization: { select: { id: true } }, // use relation to get the ID
  },
})


    if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 })
    if (existing.customerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const updated = await prisma.review.update({
      where: { id },
      data: { rating, comment },
    })

    await updateOrganizationRating(existing.installerOrganization!.id)



    return NextResponse.json({ review: updated })
  } catch (e: any) {
    console.error("PUT /api/reviews/[id] error:", e)

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: `Database error: ${e.code}` }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
