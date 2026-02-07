import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "installer" || !user.organization) {
    return NextResponse.json(
      { error: "Only installers can update packages" },
      { status: 403 },
    )
  }

  const { id } = await context.params
  const existing = await prisma.installerPackage.findFirst({
    where: { id, organizationId: user.organization.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const data: Record<string, unknown> = {}
    if (body.name !== undefined) data.name = body.name
    if (body.capacity !== undefined) data.capacity = body.capacity
    if (body.description !== undefined) data.description = body.description
    if (body.panelCount !== undefined) data.panelCount = body.panelCount
    if (body.panelType !== undefined) data.panelType = body.panelType
    if (body.inverterType !== undefined) data.inverterType = body.inverterType
    if (body.inverterBrand !== undefined) data.inverterBrand = body.inverterBrand
    if (body.installationDays !== undefined) data.installationDays = body.installationDays
    if (body.warranty !== undefined) data.warranty = body.warranty
    if (body.price !== undefined) data.price = body.price
    if (body.active !== undefined) data.active = body.active
    if (body.features !== undefined) data.features = body.features || []
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    const updated = await prisma.installerPackage.update({
      where: { id },
      data,
    })

    return NextResponse.json({ package: updated })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update package"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "installer" || !user.organization) {
    return NextResponse.json(
      { error: "Only installers can delete packages" },
      { status: 403 },
    )
  }

  const { id } = await context.params
  const existing = await prisma.installerPackage.findFirst({
    where: { id, organizationId: user.organization.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  try {
    await prisma.installerPackage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete package"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
