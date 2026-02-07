import "server-only"

import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { serializeUser } from "@/lib/session"
import { clearSession, createAuthSession, getSessionUser } from "@/lib/auth-server"

const registerSchema = z.object({
  role: z.enum(["customer", "installer"]),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  companyName: z.string().optional(),
  description: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type PublicUser = ReturnType<typeof serializeUser>

export async function registerUser(input: unknown) {
  const data = registerSchema.parse(input)

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    throw new Error("An account with this email already exists")
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  let organizationId: string | undefined
  if (data.role === "installer") {
    const organization = await prisma.organization.create({
      data: {
        name: data.companyName || `${data.name}'s Solar`,
        description: data.description,
        verified: false,
      },
    })
    organizationId = organization.id
  }

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      status: "active",
      phone: data.phone,
      address: data.address,
      passwordHash,
      organizationId,
      verified: data.role === "customer",
    },
    include: { organization: { select: { id: true, name: true, isRejected: true } } },
  })

  await createAuthSession(user.id, user.role)

  return serializeUser(user)
}

export async function loginUser(input: unknown) {
  const data = loginSchema.parse(input)

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { organization: { select: { id: true, name: true, isRejected: true } } },
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isValid = await bcrypt.compare(data.password, user.passwordHash)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  await createAuthSession(user.id, user.role)
  return serializeUser(user)
}

export async function logoutUser() {
  await clearSession()
}

export async function currentUser() {
  const user = await getSessionUser()
  if (!user) return null

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { organization: { select: { id: true, name: true, isRejected: true } } },
  })

  return fullUser ? serializeUser(fullUser) : null
}
