import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ParamsObj = Record<string, string | string[]>
type Ctx = { params: Promise<ParamsObj> | ParamsObj }

function errorJson(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

async function getIdFromCtx(ctx: Ctx): Promise<string | undefined> {
  const params = await Promise.resolve(ctx.params)
  const direct = (params["id"] as any) ?? (params["bidId"] as any) ?? (params["sessionId"] as any)
  const value = direct ?? Object.values(params)[0]
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

function mapSessionForUI(session: any) {
  const app: any = session.application
  const tech: any = app?.technicalDetails ?? {}
  const acceptedBid = (session.bids ?? []).find((b: any) => b.status === "accepted") ?? null

  return {
    id: session.id,
    status: session.status,
    bidType: session.bidType ?? "open",
    requirements: session.requirements ?? null,
    maxBudget: session.maxBudget ?? null,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    selectedBidId: acceptedBid?.id ?? null, // computed for UI

    bids: (session.bids ?? []).map((b: any) => ({
      id: b.id,
      status: b.status,
      price: b.price,
      proposal: b.proposal,
      warranty: b.warranty,
      estimatedDays: b.estimatedDays,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,

      installerName: b.organization?.name ?? b.installer?.name ?? "Installer",
      installerRating: b.organization?.rating ?? 0,
      completedProjects: b.organization?.completedInstallations ?? 0,

      packageId: b.packageId ?? null,
      packageName: b.package?.name ?? null,

      contact: {
        phone: b.organization?.phone ?? null,
        email: b.installer?.email ?? null,
      },
    })),

    applicationDetails: {
      address: tech.siteAddress || tech.address || app?.address || null,
      capacity: tech.desiredCapacity != null ? `${tech.desiredCapacity} kW` : null,
      customerPhone: app?.customer?.phone ?? null,
      customerEmail: app?.customer?.email ?? null,
    },
  }
}

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const id = await getIdFromCtx(ctx)
    if (!id) return errorJson("Bid session id is required", 400)

    const session = await prisma.bidSession.findUnique({
      where: { id },
      include: {
        application: { include: { customer: true } },
        bids: {
          include: { installer: true, organization: true, package: true },
          orderBy: { updatedAt: "desc" },
        },
      },
    })

    if (!session) return errorJson("Bid session not found", 404)

    return NextResponse.json(mapSessionForUI(session), { status: 200 })
  } catch (e) {
    console.error("GET /api/bids/[id] error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 })
  }
}

/**
 * Customer accept/reject
 * Body: { action: "accept" | "reject", bidId: string }
 *
 * ACCEPT will:
 * - accept chosen bid, reject others
 * - close bid session
 * - create invoice (installation)
 * - set application.status = payment_pending
 * - DO NOT assign installerOrganizationId yet
 */
export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const id = await getIdFromCtx(ctx)
    if (!id) return errorJson("Bid session id is required", 400)

    const body = await req.json().catch(() => ({}))
    const action = body?.action as "accept" | "reject" | undefined
    const bidId = body?.bidId as string | undefined
    if (!action || !bidId) return errorJson("action and bidId are required", 400)

    const session = await prisma.bidSession.findUnique({
      where: { id },
      include: { bids: true, application: true },
    })
    if (!session) return errorJson("Bid session not found", 404)
    if (session.status !== "open") return errorJson("Bid session is not open", 400)

    const target = session.bids.find((b) => b.id === bidId)
    if (!target) return errorJson("Bid not found in this session", 404)

    const invoiceResult = await prisma.$transaction(async (tx) => {
      if (action === "reject") {
        await tx.bid.update({ where: { id: bidId }, data: { status: "rejected" } })
        return { invoiceId: null as string | null }
      }

      // ACCEPT
      await tx.bid.update({ where: { id: bidId }, data: { status: "accepted" } })

      // Reject other pending bids
      const others = session.bids.filter((b) => b.id !== bidId && b.status === "pending")
      for (const b of others) {
        await tx.bid.update({ where: { id: b.id }, data: { status: "rejected" } })
      }

      // Close session and remember selected package (field exists in schema)
      await tx.bidSession.update({
        where: { id },
        data: { status: "closed", selectedPackageId: target.packageId ?? null },
      })

      // Create invoice for installation payment
      const invoice = await tx.invoice.create({
        data: {
          applicationId: session.applicationId,
          customerId: session.customerId,
          amount: target.price, // full amount (adjust if you want deposit)
          description: `Installation payment for application ${session.applicationId}`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "pending",
          type: "installation",
        },
      })

      // Move application to payment_pending; DO NOT assign installer yet
      await tx.application.update({
        where: { id: session.applicationId },
        data: {
          status: "payment_pending",
          selectedPackageId: target.packageId ?? null,
          installerOrganizationId: null,
        },
      })

      return { invoiceId: invoice.id }
    })

    // Return invoiceId so customer UI can redirect to payment
    return NextResponse.json({ ok: true, invoiceId: invoiceResult.invoiceId }, { status: 200 })
  } catch (e) {
    console.error("PATCH /api/bids/[id] error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 })
  }
}