/* ------------------------------------------------------------------ */
/* Core domain types                                                    */
/* ------------------------------------------------------------------ */

export type UserRole = "customer" | "installer" | "officer"

export interface User {
  id: string
  role: UserRole
  email: string
  name: string
  status?: "active" | "suspended"
  verified?: boolean
  phone?: string
  address?: string
  profileImageUrl?: string | null
  createdAt?: string
  organization?: {
    id: string
    name: string
    isRejected?: boolean
  } | null
}

export type InstallerStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "suspended"

export interface DocumentMeta {
  fileName: string
  url: string
  uploadedAt: string
  mimeType?: string
  sizeKb?: number
}

export interface Application {
  id: string
  reference?: string
  customerId: string
  customerName: string
  email?: string
  phone?: string
  address?: string
  connectionPhase?: string
  status:
    | "pending"
    | "under_review"
    | "pre_visit_approved"
    | "site_visit_scheduled"
    | "approved"
    | "site_visit_payment_completed"
    | "rejected"
    | "payment_pending"
    | "payment_confirmed"
    | "finding_installer"
    | "installation_in_progress"
    | "installation_complete"
    | "final_inspection"
    | "agreement_pending"
    | "inspection_approved"
    | "agreement_sent"
    | "customer_signed"
    | "installer_signed"
    | "officer_final_approved"
    | "completed"
  createdAt: string
  updatedAt: string
  reviewedAt?: string
  siteVisitDate?: string
  rejectionReason?: string
  siteVisitFeePaid?: boolean
  documents: {
    nic?: DocumentMeta
    bankDetails?: DocumentMeta
    electricityBill?: DocumentMeta
    propertyDocument?: DocumentMeta
  }
  technicalDetails: {
    roofType: string
    roofArea: string
    monthlyConsumption: string
    connectionPhase: string
    propertyType?: string
    propertyOwnership?: string
    electricityAccountNumber?: string
    tariffCategory?: string
    roofOrientation?: string
    shading?: string
    desiredCapacity?: string
  }
  selectedInstaller?: {
    id: string
    name: string
    phone?: string | null
    address?: string | null
    packageName?: string
    price?: number
  }
  bidId?: string
  invoices?: Invoice[]
}

export interface Installer {
  id: string
  companyName: string
  email: string
  phone: string
  address: string
  description: string
  registrationNumber?: string
  status: InstallerStatus
  verified: boolean
  isRejected?: boolean
  verifiedAt?: string
  rejectionReason?: string
  suspendedReason?: string
  documents: DocumentMeta[]
  packages: SolarPackage[]
  rating: number
  completedInstallations: number
}

export interface SolarPackage {
  id: string
  installerId: string
  name: string
  capacity: string
  description?: string
  panelCount: number
  panelType: string
  inverterType?: string
  inverterBrand: string
  installationDays?: number | null
  warranty: string
  price: number
  active?: boolean
  features: string[]
}

export interface Bid {
  id: string
  applicationId: string
  installerId: string
  installerName: string
  price: number
  proposal: string
  warranty: string
  estimatedDays: number
  createdAt: string
  status: "pending" | "accepted" | "rejected" | "expired"
  packageName?: string
  installerRating?: number
  completedProjects?: number
  contact?: {
    email?: string
    phone?: string
  }
  message?: string
}

export interface BidSession {
  id: string
  applicationId: string
  customerId: string
  startedAt: string
  expiresAt: string
  status: "open" | "closed" | "expired"
  bids: Bid[]
  selectedBidId?: string
  bidType?: "open" | "specific"
  requirements?: string
  maxBudget?: number
  applicationDetails?: {
    address?: string
    capacity?: string
    customerPhone?: string
    customerEmail?: string
    selectedPackageName?: string
    selectedPackagePrice?: string
  }
}

export interface Invoice {
  id: string
  applicationId: string
  customerId: string
  customerName?: string
  type: "authority_fee" | "installation" | "monthly_bill"
  amount: number
  status: "pending" | "paid" | "overdue"
  createdAt: string
  paidAt?: string
  dueDate: string
  description: string
  paymentId?: string
  meterReadingId?: string
  pdfUrl?: string
  channel?: "email" | "sms" | "in_app"
  nextAction?: string
}

export interface MonthlyBill {
  id: string
  customerId: string
  applicationId: string
  month: number
  year: number
  kwhGenerated: number
  kwhExported: number
  kwhImported: number
  amount: number
  status: "pending" | "paid" | "overdue" | "credited"
  createdAt: string
  meterReadingId?: string
  invoiceId?: string
  pdfUrl?: string
}

/* ------------------------------------------------------------------ */
/* API helpers                                                          */
/* ------------------------------------------------------------------ */

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const message = (data as any)?.error || response.statusText
    throw new Error(message || "Request failed")
  }
  return response.json() as Promise<T>
}

/* ------------------------------------------------------------------ */
/* Auth                                                                 */
/* ------------------------------------------------------------------ */

export async function fetchCurrentUser(): Promise<User | null> {
  const response = await fetch("/api/auth/me", { cache: "no-store" })
  if (response.status === 401) return null
  const data = await handleResponse<{ user: User }>(response)
  return data.user
}

export async function login(payload: {
  email: string
  password: string
}) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = await handleResponse<{ user: User }>(response)
  return data.user
}

export async function register(payload: {
  role: UserRole
  email: string
  password: string
  name: string
  phone?: string
  address?: string
  companyName?: string
  description?: string
}) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = await handleResponse<{ user: User }>(response)
  return data.user
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" })
}

/* ------------------------------------------------------------------ */
/* Data fetchers                                                        */
/* ------------------------------------------------------------------ */

export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch("/api/applications", { cache: "no-store" })
  const data = await handleResponse<{ applications: Application[] }>(response)
  return data.applications
}

export async function fetchApplication(
  reference: string,
): Promise<Application | null> {
  const response = await fetch(`/api/applications/${reference}`, {
    cache: "no-store",
  })
  if (response.status === 404) return null
  const data = await handleResponse<{ application: Application }>(response)
  return data.application
}

export async function fetchInstallers(
  verifiedOnly = true,
): Promise<Installer[]> {
  const url = verifiedOnly
    ? "/api/installers?verified=true"
    : "/api/installers"

  const response = await fetch(url, { cache: "no-store" })
  const data = await handleResponse<{ installers: Installer[] }>(response)
  return data.installers
}

export async function fetchBidSessions(): Promise<BidSession[]> {
  const response = await fetch("/api/bids", { cache: "no-store" })
  const data = await handleResponse<{ bidSessions: BidSession[] }>(response)
  return data.bidSessions
}

export async function fetchPayments(): Promise<{
  invoices: Invoice[]
  monthlyBills: MonthlyBill[]
}> {
  const response = await fetch("/api/payments", { cache: "no-store" })
  return handleResponse(response)
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users", { cache: "no-store" })
  const data = await handleResponse<{ users: User[] }>(response)
  return data.users
}
