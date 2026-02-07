import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ notifications })
}

export async function PATCH() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  })

  return NextResponse.json({ ok: true })
}
