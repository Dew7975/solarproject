import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { prisma } from "@/lib/prisma"
import { getSessionUser, hashPassword, verifyPassword } from "@/lib/auth-server"

const uploadsDir = path.join(process.cwd(), "public", "uploads")

async function persistAvatar(file: File) {
  await fs.mkdir(uploadsDir, { recursive: true })
  const arrayBuffer = await file.arrayBuffer()
  const ext = path.extname(file.name || "") || ".png"
  const storedName = `${randomUUID()}${ext}`
  const storedPath = path.join(uploadsDir, storedName)
  await fs.writeFile(storedPath, Buffer.from(arrayBuffer))
  return `/uploads/${storedName}`
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profileImageUrl: user.profileImageUrl ?? null,
      role: user.role,
    },
  })
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contentType = req.headers.get("content-type") || ""
  let name: string | undefined
  let email: string | undefined
  let phone: string | undefined
  let address: string | undefined
  let currentPassword: string | undefined
  let newPassword: string | undefined
  let profileImageUrl: string | undefined

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData()
    name = (formData.get("name") as string | null) ?? undefined
    email = (formData.get("email") as string | null) ?? undefined
    phone = (formData.get("phone") as string | null) ?? undefined
    address = (formData.get("address") as string | null) ?? undefined
    currentPassword = (formData.get("currentPassword") as string | null) ?? undefined
    newPassword = (formData.get("newPassword") as string | null) ?? undefined
    const avatar = formData.get("avatar")
    if (avatar && typeof avatar !== "string") {
      profileImageUrl = await persistAvatar(avatar)
    }
  } else {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    name = body.name
    email = body.email
    phone = body.phone
    address = body.address
    currentPassword = body.currentPassword
    newPassword = body.newPassword
  }

  if (email && email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing && existing.id !== user.id) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 })
    }
    const valid = await verifyPassword(currentPassword, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }
  }

  const data: Record<string, unknown> = {
    name: name ?? user.name,
    email: email ?? user.email,
    phone: phone ?? user.phone,
    address: address ?? user.address,
  }

  if (profileImageUrl) {
    data.profileImageUrl = profileImageUrl
  }

  if (newPassword) {
    data.passwordHash = await hashPassword(newPassword)
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
  })

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      profileImageUrl: updated.profileImageUrl ?? null,
      role: updated.role,
    },
  })
}
