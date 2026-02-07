"use server"

import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createAuthSession, hashPassword, verifyPassword } from "@/lib/auth-server"

function getString(fd: FormData, key: string) {
  const v = fd.get(key)
  return typeof v === "string" ? v.trim() : ""
}

export async function loginAction(_: unknown, formData: FormData) {
  const email = getString(formData, "email").toLowerCase()
  const password = getString(formData, "password")
  const redirectTo = getString(formData, "redirect") || "/customer/dashboard"

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: "Invalid credentials" }

  if (user.status === "suspended") {
    return { error: "Account is suspended. Please contact support." }
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return { error: "Invalid credentials" }

  // ✅ uses your existing session/cookie helper
  await createAuthSession(user.id, user.role)

  const roleRedirect =
    user.role === "officer"
      ? "/officer/dashboard"
      : user.role === "installer"
      ? "/installer/dashboard"
      : "/customer/dashboard"

  // If redirect is default/home, go by role
  const finalRedirect =
    redirectTo === "/" || redirectTo === "/customer/dashboard"
      ? roleRedirect
      : redirectTo

  redirect(finalRedirect)
}

export async function registerAction(_: unknown, formData: FormData) {
  const name = getString(formData, "name")
  const email = getString(formData, "email").toLowerCase()
  const password = getString(formData, "password")
  const confirmPassword = getString(formData, "confirmPassword")

  const roleRaw = getString(formData, "role") || "customer"
  const phone = getString(formData, "phone") || undefined
  const address = getString(formData, "address") || undefined

  if (!name || !email || !password) {
    return { error: "Missing required fields" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (!Object.values(UserRole).includes(roleRaw as UserRole)) {
    return { error: "Invalid role" }
  }

  const role = roleRaw as UserRole

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "Email already registered" }

  const passwordHash = await hashPassword(password)

  let organizationId: string | undefined

  if (role === UserRole.installer) {
    const companyName = getString(formData, "companyName")
    const description = getString(formData, "description") || undefined

    const org = await prisma.organization.create({
      data: {
        name: companyName || name,
        description,
        phone,
        address,
        verified: false,
      },
    })

    organizationId = org.id
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      status: "active",
      phone,
      address,
      organizationId,
      verified: role !== UserRole.installer,
    },
  })

  await createAuthSession(user.id, user.role)

  redirect(
    role === UserRole.installer
      ? "/installer/dashboard"
      : role === UserRole.officer
      ? "/officer/dashboard"
      : "/customer/dashboard",
  )
}