import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export const dynamic = "force-dynamic"

// GET /api/installers/reviews?take=50
export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "installer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organizationId: true },
    })

    const orgId = dbUser?.organizationId
    if (!orgId) {
      return NextResponse.json(
        { error: "Installer organization not found" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const takeParam = searchParams.get("take")
    const take = takeParam
      ? Math.min(Math.max(parseInt(takeParam, 10) || 50, 1), 200)
      : 50

    const reviews = await prisma.review.findMany({
      where: { installerOrganizationId: orgId },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        customer: { select: { id: true, name: true, profileImageUrl: true } },
        application: { select: { id: true, reference: true, status: true } },
      },
    })

    const stats = await prisma.review.aggregate({
      where: { installerOrganizationId: orgId },
      _avg: { rating: true },
      _count: { rating: true },
    })

    return NextResponse.json({
      reviews,
      ratingAvg: stats._avg?.rating ?? 0,
      ratingCount: stats._count?.rating ?? 0,
    })
  } catch (e) {
    console.error("GET /api/installers/reviews error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
