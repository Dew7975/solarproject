import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/services/auth";
import type { ApplicationStatus } from "@prisma/client";

const ALLOWED_STATUSES: ApplicationStatus[] = [
  "approved",
  "payment_pending",
  "payment_confirmed",
  "finding_installer",
  "installation_in_progress",
  "final_inspection",
  "agreement_pending",
  "inspection_approved",
  "agreement_sent",
  "customer_signed",
  "installer_signed",
  "officer_final_approved",
  "completed",
];

function extractCapacity(td: unknown): string | null {
  if (!td || typeof td !== "object") return null;
  const obj = td as Record<string, any>;
  const v = obj.systemCapacity ?? obj.desiredCapacity ?? obj.capacity;
  return v == null ? null : String(v);
}

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ isApproved: false, status: null, capacity: null }, { status: 401 });
  }

  const app = await prisma.application.findFirst({
    where: { customerId: user.id, status: { in: ALLOWED_STATUSES } },
    orderBy: { updatedAt: "desc" },
    include: { selectedPackage: { select: { capacity: true } } },
  });

  if (!app) {
    return NextResponse.json({ isApproved: false, status: null, capacity: null }, { status: 200 });
  }

  const capacity = app.selectedPackage?.capacity ?? extractCapacity(app.technicalDetails);

  return NextResponse.json(
    { isApproved: true, status: app.status, capacity },
    { status: 200 }
  );
}