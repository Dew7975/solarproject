import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ParamsObj = Record<string, string | string[]>
type Ctx = { params: Promise<ParamsObj> | ParamsObj }

// ✅ minimum amount you must reduce by
const MIN_DECREMENT = 5000

function errorJson(message: string, status = 400, extra?: any) {
  return NextResponse.json({ error: message, ...extra }, { status })
}

async function getSessionId(ctx: Ctx): Promise<string | undefined> {
  const params = await Promise.resolve(ctx.params)
  const direct = (params["id"] as any) ?? Object.values(params)[0]
  if (!direct) return undefined
  return Array.isArray(direct) ? direct[0] : direct
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const sessionId = await getSessionId(ctx)
    if (!sessionId) return errorJson("Bid session id is required", 400)

    const me = await currentUser().catch(() => null)
    const installerId = me?.id
    const organizationId = me?.organization?.id
    if (!installerId || !organizationId) return errorJson("Unauthorized", 401)

    const body = await req.json().catch(() => ({}))

    const price = Number(body?.price ?? NaN)
    if (!Number.isFinite(price) || price <= 0) return errorJson("Please enter a valid bid amount.", 400)

    const packageId: string | null = body?.packageId ? String(body.packageId) : null

    // Required by your schema
    const warranty = String(body?.warranty ?? "Standard warranty").trim()
    const estimatedDays = Number(body?.estimatedDays ?? 14)
    if (!Number.isFinite(estimatedDays) || estimatedDays <= 0) {
      return errorJson("Please enter a valid installation timeline (days).", 400)
    }

    // No `message` field in schema, so keep notes inside proposal text
    const baseProposal = String(body?.proposal ?? body?.packageName ?? "Proposal").trim()
    const notes = String(body?.message ?? "").trim()
    const proposal = notes ? `${baseProposal}\n\nNotes: ${notes}` : baseProposal

    const session = await prisma.bidSession.findUnique({
      where: { id: sessionId },
      select: { id: true, status: true, applicationId: true },
    })
    if (!session) return errorJson("Bid session not found.", 404)
    if (session.status !== "open") return errorJson("This bid session is no longer open.", 400)

    const result = await prisma.$transaction(async (tx) => {
      // All bids in this session
      const allBids = await tx.bid.findMany({
        where: { bidSessionId: sessionId },
        select: { id: true, price: true, organizationId: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })

      // Your bids (same organization)
      const myBids = allBids.filter((b) => b.organizationId === organizationId)
      const myLatest = myBids[0] ?? null

      // Lowest bid from other organizations
      const otherBids = allBids.filter((b) => b.organizationId !== organizationId)
      const currentLowestOther = otherBids.length ? Math.min(...otherBids.map((b) => b.price)) : null

      // ---- Rule 1: If you already bid, you must reduce by MIN_DECREMENT
      if (myLatest) {
        const maxAllowed = myLatest.price - MIN_DECREMENT
        if (price > maxAllowed) {
          return {
            ok: false,
            status: 400,
            message:
              `Please enter a lower amount.\n` +
              `Your last bid: LKR ${myLatest.price.toLocaleString()}.\n` +
              `You must reduce by at least LKR ${MIN_DECREMENT.toLocaleString()}.\n` +
              `Maximum allowed: LKR ${maxAllowed.toLocaleString()}.`,
          }
        }
      }

      // ---- Rule 2: If others have bid, you must be at least MIN_DECREMENT lower than the current lowest
      if (currentLowestOther != null) {
        const maxAllowed = currentLowestOther - MIN_DECREMENT
        if (price > maxAllowed) {
          return {
            ok: false,
            status: 400,
            message:
              `Your bid is too high to compete.\n` +
              `Current lowest bid: LKR ${currentLowestOther.toLocaleString()}.\n` +
              `You must beat it by at least LKR ${MIN_DECREMENT.toLocaleString()}.\n` +
              `Maximum allowed: LKR ${maxAllowed.toLocaleString()}.`,
          }
        }
      }

      // Upsert: keep only 1 bid per organization per session
      const latestId = myLatest?.id ?? null

      const data = {
        applicationId: session.applicationId,
        bidSessionId: sessionId,
        installerId,
        organizationId,
        packageId,
        price: Math.round(price),
        proposal,
        warranty,
        estimatedDays: Math.round(estimatedDays),
        status: "pending" as const,
      }

      let bid
      if (latestId) {
        bid = await tx.bid.update({ where: { id: latestId }, data })
      } else {
        bid = await tx.bid.create({ data })
      }

      // Delete older duplicates
      const duplicatesToDelete = myBids.slice(1).map((b) => b.id)
      if (duplicatesToDelete.length) {
        await tx.bid.deleteMany({ where: { id: { in: duplicatesToDelete } } })
      }

      return { ok: true, bid }
    })

    if (!(result as any).ok) {
      return errorJson((result as any).message, (result as any).status)
    }

    return NextResponse.json({ bid: (result as any).bid }, { status: 201 })
  } catch (e) {
    console.error("POST /api/bids/[id]/proposals error:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unable to submit bid" },
      { status: 500 },
    )
  }
}