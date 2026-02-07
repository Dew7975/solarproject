import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const verified = url.searchParams.get("verified")

  const organizations = await prisma.organization.findMany({
    where: verified === "true" ? { verified: true } : undefined,
    include: {
      packages: true,
      users: true,
    },
  })

  return NextResponse.json({
    installers: organizations.map((org) => {
      const primaryInstaller = org.users.find(
        (user: any) => user.role === "installer"
      )
      const visiblePackages =
        verified === "true"
          ? org.packages.filter((pkg: any) => pkg.active)
          : org.packages

      return {
        id: org.id,
        companyName: org.name,
        email: primaryInstaller?.email || "",
        phone: org.phone || primaryInstaller?.phone || "",
        address: org.address || "",
        description: org.description || "",
        verified: org.verified,
        isRejected: org.isRejected,
        verifiedAt: org.verifiedAt,
        status: org.isRejected ? "rejected" : org.verified ? "verified" : "pending",
        documents: org.documents || [],
        rating: org.rating ?? 0,
        completedInstallations: org.completedInstallations ?? 0,
        packages: visiblePackages.map((pkg: any) => ({
          id: pkg.id,
          installerId: org.id,
          name: pkg.name,
          capacity: pkg.capacity,
          description: pkg.description ?? "",
          panelCount: pkg.panelCount,
          panelType: pkg.panelType,
          inverterType: pkg.inverterType ?? "",
          inverterBrand: pkg.inverterBrand,
          installationDays: pkg.installationDays ?? null,
          warranty: pkg.warranty,
          price: pkg.price,
          active: pkg.active,
          features: pkg.features || [],
        })),
      }
    }),
  })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "installer" || !user.organization) {
    return NextResponse.json(
      { error: "Only installers can add packages" },
      { status: 403 }
    )
  }

  const organization = await prisma.organization.findUnique({
    where: { id: user.organization.id },
    select: { verified: true },
  })

  if (!organization?.verified) {
    return NextResponse.json(
      { error: "Your company registration is pending verification." },
      { status: 403 }
    )
  }

  const body = await request.json()

  try {
    const pkg = await prisma.installerPackage.create({
      data: {
        organizationId: user.organization.id,
        name: body.name,
        capacity: body.capacity,
        description: body.description,
        panelCount: body.panelCount,
        panelType: body.panelType,
        inverterType: body.inverterType,
        inverterBrand: body.inverterBrand,
        installationDays: body.installationDays,
        warranty: body.warranty,
        price: body.price,
        active: body.active ?? true,
        features: body.features || [],
      },
    })

    return NextResponse.json({ package: pkg }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to add package"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
