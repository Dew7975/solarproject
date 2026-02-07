import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@/lib/services/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verifiedOnly = searchParams.get("verified") === "true"
    const capacity = searchParams.get("capacity")

    const organizations = await prisma.organization.findMany({
      where: {
        verified: verifiedOnly ? true : undefined,
      },
      include: {
        packages: {
          where: {
            ...(capacity ? { capacity } : {}),
          },
        },
      },
    })

    // Count completed installations per organization separately to avoid using filtered _count in the include
    const completedCounts = await Promise.all(
      organizations.map((org) =>
        prisma.application.count({
          where: {
            status: "completed",
            installerOrganizationId: org.id,
          },
        }),
      ),
    )

    const installers = organizations.map((org, idx) => ({
      id: org.id,
      companyName: org.name,
      email: "",
      phone: org.phone || "",
      address: org.address || "",
      description: org.description || "",
      registrationNumber: (org as any).registrationNumber,
      status: "verified" as const,
      verified: org.verified,
      isRejected: (org as any).isRejected,
      verifiedAt: org.verifiedAt?.toISOString(),
      documents: [],
      packages: org.packages.map((pkg) => ({
        id: pkg.id,
        installerId: org.id,
        name: pkg.name,
        capacity: pkg.capacity,
        description: (pkg as any).description || undefined,
        panelCount: pkg.panelCount,
        panelType: pkg.panelType,
        inverterType: (pkg as any).inverterType || undefined,
        inverterBrand: pkg.inverterBrand,
        installationDays: (pkg as any).installationDays || undefined,
        warranty: pkg.warranty,
        price: pkg.price,
        active: (pkg as any).active ?? true,
        features: pkg.features,
      })),
      rating: org.rating,
      completedInstallations: completedCounts[idx],
    }))

    return NextResponse.json({ installers }, { status: 200 })
  } catch (error) {
    console.error("Error fetching installers:", error)
    return NextResponse.json({ error: "Failed to fetch installers" }, { status: 500 })
  }
}

/**
 * POST /api/installers
 * Creates a package under the logged-in installer's organization.
 * Your frontend can keep posting here (no 405).
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    const orgId = user?.organization?.id

    if (!user || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))

    // Minimal required fields (adjust to your form)
    const name = String(body?.name ?? "").trim()
    const capacity = String(body?.capacity ?? "").trim()
    const panelType = String(body?.panelType ?? "").trim()
    const inverterBrand = String(body?.inverterBrand ?? "").trim()
    const price = Number(body?.price ?? NaN)

    if (!name || !capacity || !panelType || !inverterBrand || !Number.isFinite(price)) {
      return NextResponse.json(
        { error: "Missing required fields (name, capacity, panelType, inverterBrand, price)" },
        { status: 400 },
      )
    }

    // Create via Organization.packages relation (works regardless of model delegate name)
    const updatedOrg = await prisma.organization.update({
      where: { id: orgId },
      data: {
        packages: {
          create: {
            name,
            capacity,
            description: body?.description ? String(body.description) : null,
            panelCount: Number(body?.panelCount ?? 0),
            panelType,
            inverterType: body?.inverterType ? String(body.inverterType) : null,
            inverterBrand,
            installationDays: body?.installationDays != null ? Number(body.installationDays) : null,
            warranty: body?.warranty ? String(body.warranty) : "Standard warranty",
            price,
            active: body?.active !== false,
            features: Array.isArray(body?.features) ? body.features.map(String) : [],
          } as any,
        },
      },
      include: {
        packages: true,
      },
    })

    // Return the latest package roughly by matching name+price (safe fallback)
    const createdPackage =
      [...(updatedOrg.packages ?? [])].reverse().find((p: any) => p.name === name && p.price === price) ??
      updatedOrg.packages?.[updatedOrg.packages.length - 1] ??
      null

    return NextResponse.json({ package: createdPackage }, { status: 201 })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create package" },
      { status: 500 },
    )
  }
}