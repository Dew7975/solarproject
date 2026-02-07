import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function PATCH(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification || notification.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true },
  })

  return NextResponse.json({ notification: updated })
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification || notification.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.notification.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
