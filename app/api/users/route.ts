import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function GET() {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          verified: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      verified: u.verified,
      phone: u.phone,
      address: u.address,
      organization: u.organization,
      createdAt: u.createdAt,
    })),
  })
}

export async function PATCH(request: Request) {
  const user = await currentUser()
  if (!user || user.role !== "officer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const { userId, status } = body || {}

  if (!userId || !status) {
    return NextResponse.json({ error: "userId and status are required" }, { status: 400 })
  }

  if (!["active", "suspended"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
  })

  return NextResponse.json({ user: { id: updated.id, status: updated.status } })
}
