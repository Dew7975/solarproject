export type UserRole = "customer" | "installer" | "officer"

export interface User {
  id?: string
  role: UserRole
  email: string
  name: string
  verified?: boolean
  phone?: string
  address?: string
}

export interface Application {
  id: string
  customerId: string
  customerName: string
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
  siteVisitDate?: string
  siteAddress?: string
  systemCapacity?: string
  rejectionReason?: string
  documents: {
    nic?: string
    bankDetails?: string
    electricityBill?: string
  }
  technicalDetails: {
    roofType: string
    roofArea: string
    monthlyConsumption: string
    connectionPhase: string
  }
  selectedInstaller?: {
    id: string
    name: string
    packageName: string
    price: number
  }
  bidId?: string
}

export interface Installer {
  id: string
  companyName: string
  email: string
  phone: string
  address: string
  description: string
  registrationNumber?: string
  verified: boolean
  verifiedAt?: string
  documents: string[]
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
  contact?: {
    phone?: string
    email?: string
  }
  installerRating?: number
  completedProjects?: number
  message?: string
}

export interface BidSession {
  id: string
  applicationId: string
  customerId: string
  startedAt: string
  expiresAt: string
  status: "open" | "closed" | "expired"
  bidType: "open" | "specific"
  requirements?: string
  maxBudget?: number
  bids: Bid[]
  selectedBidId?: string
  applicationDetails?: {
    address?: string
    capacity?: string
  }
}

export interface Invoice {
  id: string
  applicationId: string
  customerId: string
  type: "authority_fee" | "installation" | "monthly_bill"
  amount: number
  status: "pending" | "paid" | "overdue"
  createdAt: string
  paidAt?: string
  dueDate: string
  description: string
}

export interface MonthlyBill {
  id: string
  customerId: string
  applicationId: string
  month: string
  year: number
  kwhGenerated: number
  kwhExported: number
  kwhImported: number
  amount: number
  status: "pending" | "paid"
  createdAt: string
}

export interface Notification {
  id: string
  customerId: string
  message: string
  createdAt: string
  type: "info" | "warning" | "success"
}
