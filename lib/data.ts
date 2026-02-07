import { Application, DocumentMeta, Installer } from "./auth"
import type { Invoice as DemoInvoice, MonthlyBill as DemoMonthlyBill } from "./prisma-types"

type InstallerStatus = "pending" | "verified" | "rejected" | "suspended"

type UpdateInstallerPayload = {
  rejectionReason?: string
  suspendedReason?: string
  documents?: DocumentMeta[]
}

type ApplicationAction = "approved" | "rejected" | "site_visit_scheduled"

type UpdateApplicationPayload = {
  rejectionReason?: string
  siteVisitDate?: string
}

function makeDocument(fileName: string, url: string, uploadedAt = "2024-01-01") {
  return { fileName, url, uploadedAt }
}

let installers: Installer[] = [
  {
    id: "INS-001",
    companyName: "Solar Pro Ltd",
    email: "contact@solarpro.lk",
    phone: "+94 11 234 5678",
    address: "123 Solar Street, Colombo",
    description: "Leading solar installation company with 10+ years experience",
    registrationNumber: "REG-2024-001",
    verified: true,
    status: "verified",
    verifiedAt: "2024-01-10",
    documents: [
      makeDocument("Registration Certificate", "/docs/solarpro/registration.pdf", "2024-01-02"),
      makeDocument("Business License", "/docs/solarpro/license.pdf", "2024-01-03"),
      makeDocument("Insurance Certificate", "/docs/solarpro/insurance.pdf", "2024-01-04"),
    ],
    packages: [
      {
        id: "PKG-001",
        installerId: "INS-001",
        name: "Basic Solar Package",
        capacity: "3 kW",
        panelCount: 8,
        panelType: "Monocrystalline",
        inverterBrand: "Huawei",
        warranty: "10 years",
        price: 450000,
        features: ["Free installation", "1 year maintenance", "Net metering setup"],
      },
      {
        id: "PKG-002",
        installerId: "INS-001",
        name: "Premium Solar Package",
        capacity: "5 kW",
        panelCount: 12,
        panelType: "Monocrystalline",
        inverterBrand: "SMA",
        warranty: "15 years",
        price: 750000,
        features: ["Free installation", "2 years maintenance", "Net metering setup", "Monitoring system"],
      },
    ],
    rating: 4.8,
    completedInstallations: 150,
  },
  {
    id: "INS-002",
    companyName: "Green Energy Solutions",
    email: "info@greenenergy.lk",
    phone: "+94 11 345 6789",
    address: "456 Energy Lane, Kandy",
    description: "Eco-friendly solar solutions for residential and commercial",
    registrationNumber: "REG-2024-002",
    verified: true,
    status: "verified",
    verifiedAt: "2024-01-12",
    documents: [
      makeDocument("Registration Certificate", "/docs/greenenergy/registration.pdf", "2024-01-05"),
      makeDocument("Business License", "/docs/greenenergy/license.pdf", "2024-01-06"),
    ],
    packages: [
      {
        id: "PKG-003",
        installerId: "INS-002",
        name: "Economy Package",
        capacity: "2 kW",
        panelCount: 5,
        panelType: "Polycrystalline",
        inverterBrand: "Growatt",
        warranty: "8 years",
        price: 280000,
        features: ["Free installation", "Net metering setup"],
      },
    ],
    rating: 4.6,
    completedInstallations: 95,
  },
  {
    id: "INS-003",
    companyName: "SunPower Systems",
    email: "hello@sunpower.lk",
    phone: "+94 11 456 7890",
    address: "789 Renewable Road, Galle",
    description: "Premium solar installations with cutting-edge technology",
    registrationNumber: "REG-2024-003",
    verified: false,
    status: "pending",
    documents: [
      makeDocument("Registration Certificate", "/docs/sunpower/registration.pdf", "2024-01-07"),
      makeDocument("Business License", "/docs/sunpower/license.pdf", "2024-01-08"),
      makeDocument("Technical Certifications", "/docs/sunpower/technical.pdf", "2024-01-09"),
    ],
    packages: [],
    rating: 0,
    completedInstallations: 0,
  },
  {
    id: "INS-004",
    companyName: "Green Solar Co",
    email: "contact@greensolar.lk",
    phone: "+94 11 567 8901",
    address: "321 Sun Avenue, Matara",
    description: "Affordable solar solutions for every home",
    registrationNumber: "REG-2024-004",
    verified: false,
    status: "pending",
    documents: [
      makeDocument("Registration Certificate", "/docs/greensolar/registration.pdf", "2024-01-10"),
    ],
    packages: [],
    rating: 0,
    completedInstallations: 0,
  },
  {
    id: "INS-005",
    companyName: "Rejected Solar Inc",
    email: "info@rejected.lk",
    phone: "+94 11 678 9012",
    address: "999 Failed Street, Colombo",
    description: "Solar company with incomplete documentation",
    registrationNumber: "REG-2024-005",
    verified: false,
    status: "rejected",
    rejectionReason: "Incomplete documentation and invalid business license",
    documents: [
      makeDocument("Registration Certificate", "/docs/rejected/registration.pdf", "2024-01-11"),
    ],
    packages: [],
    rating: 0,
    completedInstallations: 0,
  },
]

let applications: Application[] = [
  {
    id: "APP-001",
    customerId: "CUST-001",
    customerName: "John Customer",
    email: "john.customer@example.com",
    phone: "+94 71 123 4567",
    address: "123 Solar Lane, Colombo 07",
    status: "approved",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    documents: {
      nic: makeDocument("NIC", "/docs/applications/app-001/nic.pdf", "2024-01-15"),
      bankDetails: makeDocument("Bank Details", "/docs/applications/app-001/bank.pdf", "2024-01-15"),
      electricityBill: makeDocument("Electricity Bill", "/docs/applications/app-001/bill.pdf", "2024-01-15"),
    },
    technicalDetails: {
      roofType: "Flat Concrete",
      roofArea: "50 sqm",
      monthlyConsumption: "350 kWh",
      connectionPhase: "Single Phase",
    },
    siteVisitDate: "2024-01-22",
  },
  {
    id: "APP-002",
    customerId: "CUST-002",
    customerName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+94 71 234 5678",
    address: "45 Palm Grove, Kandy",
    status: "pending",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
    documents: {
      nic: makeDocument("NIC", "/docs/applications/app-002/nic.pdf", "2024-01-18"),
      bankDetails: makeDocument("Bank Details", "/docs/applications/app-002/bank.pdf", "2024-01-18"),
      electricityBill: makeDocument("Electricity Bill", "/docs/applications/app-002/bill.pdf", "2024-01-18"),
    },
    technicalDetails: {
      roofType: "Sloped Tile",
      roofArea: "75 sqm",
      monthlyConsumption: "500 kWh",
      connectionPhase: "Three Phase",
    },
  },
  {
    id: "APP-003",
    customerId: "CUST-003",
    customerName: "Sam Taylor",
    email: "sam.taylor@example.com",
    phone: "+94 71 345 6789",
    address: "78 Lake Road, Galle",
    status: "site_visit_scheduled",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-19",
    siteVisitDate: "2024-01-25",
    documents: {
      nic: makeDocument("NIC", "/docs/applications/app-003/nic.pdf", "2024-01-17"),
      bankDetails: makeDocument("Bank Details", "/docs/applications/app-003/bank.pdf", "2024-01-17"),
      electricityBill: makeDocument("Electricity Bill", "/docs/applications/app-003/bill.pdf", "2024-01-17"),
    },
    technicalDetails: {
      roofType: "Metal Sheet",
      roofArea: "100 sqm",
      monthlyConsumption: "800 kWh",
      connectionPhase: "Three Phase",
    },
  },
]

const demoInvoices: DemoInvoice[] = [
  {
    id: "INV-001",
    applicationId: "APP-001",
    customerId: "CUST-001",
    type: "authority_fee",
    description: "Authority fee payment",
    amount: 15000,
    status: "paid",
    dueDate: "2024-01-25",
    paidAt: "2024-01-20",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "INV-002",
    applicationId: "APP-002",
    customerId: "CUST-002",
    type: "installation",
    description: "Installation advance payment",
    amount: 80000,
    status: "pending",
    dueDate: "2024-02-05",
    paidAt: null,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "INV-003",
    applicationId: "APP-003",
    customerId: "CUST-003",
    type: "monthly_bill",
    description: "January net metering bill",
    amount: -1200,
    status: "paid",
    dueDate: "2024-02-01",
    paidAt: "2024-02-01",
    createdAt: "2024-01-31",
    updatedAt: "2024-02-01",
  },
]

const demoMonthlyBills: DemoMonthlyBill[] = [
  {
    id: "MB-001",
    invoiceId: "INV-003",
    customerId: "CUST-003",
    applicationId: "APP-003",
    meterReadingId: "MR-003",
    month: 1,
    year: 2024,
    kwhGenerated: 420,
    kwhExported: 210,
    kwhImported: 170,
    netAmount: -1200,
    amount: -1200,
    status: "paid",
    createdAt: "2024-01-31",
  },
]

function cloneInstaller(installer: Installer): Installer {
  return JSON.parse(JSON.stringify(installer))
}

function cloneApplication(application: Application): Application {
  return JSON.parse(JSON.stringify(application))
}

export function getInstallers(filter?: { status?: InstallerStatus; verified?: boolean }) {
  let data = installers
  if (filter?.status) {
    data = data.filter((installer) => installer.status === filter.status)
  }
  if (typeof filter?.verified === "boolean") {
    data = data.filter((installer) => installer.verified === filter.verified)
  }
  return data.map(cloneInstaller)
}

export function updateInstallerStatus(
  installerId: string,
  status: InstallerStatus,
  payload: UpdateInstallerPayload = {},
) {
  const installer = installers.find((i) => i.id === installerId)
  if (!installer) {
    throw new Error("Installer not found")
  }

  const now = new Date().toISOString()

  switch (status) {
    case "verified":
      installer.status = "verified"
      installer.verified = true
      installer.verifiedAt = now
      if (payload.documents) {
        installer.documents = payload.documents
      }
      installer.rejectionReason = undefined
      installer.suspendedReason = undefined
      break
    case "rejected":
      installer.status = "rejected"
      installer.verified = false
      installer.rejectionReason = payload.rejectionReason || ""
      installer.suspendedReason = undefined
      break
    case "suspended":
      installer.status = "suspended"
      installer.verified = false
      installer.suspendedReason = payload.suspendedReason || ""
      break
    default:
      throw new Error("Invalid installer status")
  }

  return cloneInstaller(installer)
}

export function getApplications(filter?: { status?: Application["status"] }) {
  const data = filter?.status ? applications.filter((app) => app.status === filter.status) : applications
  return data.map(cloneApplication)
}

export function updateApplicationStatus(
  applicationId: string,
  action: ApplicationAction,
  payload: UpdateApplicationPayload = {},
) {
  const application = applications.find((app) => app.id === applicationId)
  if (!application) {
    throw new Error("Application not found")
  }

  const now = new Date().toISOString()

  switch (action) {
    case "approved":
      application.status = "approved"
      application.updatedAt = now
      application.rejectionReason = undefined
      break
    case "rejected":
      application.status = "rejected"
      application.updatedAt = now
      application.rejectionReason = payload.rejectionReason || ""
      break
    case "site_visit_scheduled":
      if (!payload.siteVisitDate) {
        throw new Error("Site visit date is required")
      }
      application.status = "site_visit_scheduled"
      application.siteVisitDate = payload.siteVisitDate
      application.updatedAt = now
      break
    default:
      throw new Error("Invalid application action")
  }

  return cloneApplication(application)
}

export function getApprovedApplications() {
  return getApplications({ status: "approved" })
}

function clone<T>(input: T): T {
  return JSON.parse(JSON.stringify(input))
}

export function getDemoInstallers() {
  return getInstallers()
}

export function getVerifiedInstallers() {
  return getInstallers({ verified: true })
}

export function getDemoApplications() {
  return getApplications()
}

export function getDemoInvoices() {
  return demoInvoices.map(clone)
}

export function getDemoMonthlyBills() {
  return demoMonthlyBills.map(clone)
}
