import { cookies } from "next/headers"
import crypto from "crypto"
import { prisma } from "./prisma"
import type { Session, User } from "@prisma/client"

const SESSION_COOKIE = "session_token"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

export type SessionWithUser = Session & {
  user: User & {
    organization: { id: string; name: string; isRejected: boolean } | null
  }
}

export function serializeUser(
  user: User & { organization?: { id: string; name: string; isRejected?: boolean } | null },
) {
  const { passwordHash: _passwordHash, ...safeUser } = user

  return {
    ...safeUser,
    organization: user.organization
      ? {
          id: user.organization.id,
          name: user.organization.name,
          isRejected: Boolean(user.organization.isRejected),
        }
      : null,
  }
}

export async function getSession(): Promise<SessionWithUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          organization: {
            select: { id: true, name: true, isRejected: true },
          },
        },
      },
    },
  })

  if (!session) {
    cookieStore.delete(SESSION_COOKIE)
    return null
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } })
    cookieStore.delete(SESSION_COOKIE)
    return null
  }

  return session as SessionWithUser
}

export async function getCurrentUser() {
  const session = await getSession()
  return session ? serializeUser(session.user) : null
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000)

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  })

  return token
}

export async function clearSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("UNAUTHENTICATED")
  }
  return user
}
