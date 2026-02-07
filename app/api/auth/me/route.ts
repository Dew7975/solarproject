import { NextResponse } from "next/server"
import { clearSession, getSessionUser } from "@/lib/auth-server"

export async function GET() {
  const user = await getSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.status === "suspended") {
    await clearSession()
    return NextResponse.json(
      { error: "Account is suspended. Please contact support." },
      { status: 403 },
    )
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      phone: user.phone,
      address: user.address,
      profileImageUrl: user.profileImageUrl ?? null,
      role: user.role,
      verified: user.verified,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            isRejected: Boolean(user.organization.isRejected),
          }
        : null,
    },
  })
}
