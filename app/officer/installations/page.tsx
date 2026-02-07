"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  Wrench,
  Eye,
  FileCheck,
  AlertTriangle,
  FileText,
} from "lucide-react"
import { fetchApplications, type Application } from "@/lib/auth"

type InstallationStatus =
  | "pending_start"
  | "in_progress"
  | "pending_inspection"
  | "agreement_sent"
  | "customer_signed"
  | "installer_signed"
  | "inspection_approved"
  | "officer_final_approved"
  | "completed"
  | "issues_reported"

interface Installation {
  id: string
  applicationId: string
  customerId: string
  customerName: string
  applicationStatus: Application["status"]
  customerEmail?: string
  customerPhone?: string
  address: string
  installerName?: string
  installerPhone?: string | null
  installerAddress?: string | null
  capacity?: string
  roofType?: string
  roofArea?: string
  desiredCapacity?: string
  paymentStatus?: "pending" | "paid" | "overdue" | "unknown"
  status: InstallationStatus
  progress: number
  siteVisitDate?: string
  siteVisitNotes?: string | null
}

export default function OfficerInstallationsPage() {
  const { t } = useLanguage()
  const [installations, setInstallations] = useState<Installation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [agreement, setAgreement] = useState<any | null>(null)
  const [agreementLoading, setAgreementLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const apps = await fetchApplications()
        const mapped = apps
          .filter((app) =>
            [
              "approved",
              "payment_confirmed",
              "finding_installer",
              "agreement_pending",
              "installation_in_progress",
              "installation_complete",
              "final_inspection",
              "inspection_approved",
              "agreement_sent",
              "customer_signed",
              "installer_signed",
              "officer_final_approved",
              "completed",
            ].includes(app.status),
          )
          .map<Installation>((app) => {
            const statusMap: Record<Application["status"], InstallationStatus> = {
              installation_in_progress: "in_progress",
              installation_complete: "pending_inspection",
              final_inspection: "pending_inspection",
              inspection_approved: "inspection_approved",
              agreement_sent: "agreement_sent",
              customer_signed: "customer_signed",
              installer_signed: "installer_signed",
              officer_final_approved: "officer_final_approved",
              completed: "completed",
              pending: "pending_start",
              under_review: "pending_start",
              pre_visit_approved: "pending_start",
              site_visit_scheduled: "pending_start",
              approved: "pending_start",
              site_visit_payment_completed: "pending_start",
              rejected: "issues_reported",
              payment_pending: "pending_start",
              payment_confirmed: "pending_start",
              finding_installer: "pending_start",
              agreement_pending: "pending_inspection",
            }
            const status = statusMap[app.status] || "pending_start"
            const progressByStatus: Record<InstallationStatus, number> = {
              pending_start: 10,
              in_progress: 55,
              pending_inspection: 85,
              inspection_approved: 88,
              agreement_sent: 90,
              customer_signed: 92,
              installer_signed: 94,
              officer_final_approved: 98,
              completed: 100,
              issues_reported: 30,
            }
            const installationInvoice = app.invoices?.find((inv) => inv.type === "installation")
            const paymentStatus =
              installationInvoice?.status ?? (app.invoices ? "unknown" : undefined)
            return {
              id: `INST-${app.id}`,
              applicationId: app.id,
              customerId: app.customerId,
              customerName: app.customerName,
              applicationStatus: app.status,
              customerEmail: app.email,
              customerPhone: app.phone,
              address:
                (app.technicalDetails as any)?.siteAddress ||
                (app.technicalDetails as any)?.address ||
                app.address ||
                t("pendingAddress"),
              installerName: app.selectedInstaller?.name,
              installerPhone: app.selectedInstaller?.phone ?? null,
              installerAddress: app.selectedInstaller?.address ?? null,
              capacity: app.selectedInstaller?.packageName,
              roofType: app.technicalDetails?.roofType,
              roofArea: app.technicalDetails?.roofArea,
              desiredCapacity: (app.technicalDetails as any)?.desiredCapacity,
              paymentStatus,
              status,
              progress: progressByStatus[status],
              siteVisitDate: app.siteVisitDate,
              siteVisitNotes: app.rejectionReason ?? null,
            }
          })
        setInstallations(mapped)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("officerInstallationsUnableToLoad"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [t])

  const getStatusBadge = (status: InstallationStatus) => {
    const config = {
      pending_start: { label: t("officerInstallationsStatusPending"), color: "bg-slate-500/10 text-slate-600", icon: Clock },
      in_progress: { label: t("officerInstallationsStatusInProgress"), color: "bg-blue-500/10 text-blue-600", icon: Wrench },
      pending_inspection: { label: t("officerInstallationsStatusPendingInspection"), color: "bg-amber-500/10 text-amber-600", icon: FileCheck },
      inspection_approved: { label: t("officerInstallationsStatusInspectionApproved"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
      agreement_sent: { label: t("officerInstallationsStatusAgreementSent"), color: "bg-cyan-500/10 text-cyan-600", icon: FileText },
      customer_signed: { label: t("officerInstallationsStatusCustomerSigned"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
      installer_signed: { label: t("officerInstallationsStatusInstallerSigned"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
      officer_final_approved: { label: t("officerInstallationsStatusFinalApproval"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
      completed: { label: t("officerInstallationsStatusCompleted"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
      issues_reported: { label: t("officerInstallationsStatusIssuesReported"), color: "bg-red-500/10 text-red-600", icon: AlertTriangle },
    }
    const { label, color, icon: Icon } = config[status]
    return (
      <Badge className={color} variant="secondary">
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const stats = useMemo(() => {
    return {
      total: installations.length,
      inProgress: installations.filter((i) => i.status === "in_progress").length,
      pendingInspection: installations.filter((i) => i.status === "pending_inspection").length,
      issues: installations.filter((i) => i.status === "issues_reported").length,
    }
  }, [installations])

  const handleApproveInspection = async () => {
    if (selectedInstallation) {
      await fetch(`/api/applications/${selectedInstallation.applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inspection_approved" }),
      })
      setInstallations((prev) =>
        prev.map((i) =>
          i.id === selectedInstallation.id
            ? { ...i, status: "inspection_approved", progress: 88, applicationStatus: "inspection_approved" }
            : i,
        ),
      )
      setApproveDialogOpen(false)
    }
  }

  const loadAgreement = async (applicationId: string) => {
    setAgreementLoading(true)
    setAgreement(null)
    try {
      const res = await fetch(`/api/agreements?applicationId=${applicationId}`)
      if (!res.ok) {
        setAgreement(null)
        return
      }
      const data = await res.json()
      setAgreement(data.agreement ?? null)
    } finally {
      setAgreementLoading(false)
    }
  }

  const handleGenerateAgreement = async () => {
    if (!selectedInstallation) return
    setAgreementLoading(true)
    try {
      const res = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selectedInstallation.applicationId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("officerInstallationsUnableToGenerate"))
      }
      const data = await res.json()
      setAgreement(data.agreement)
      setInstallations((prev) =>
        prev.map((i) =>
          i.id === selectedInstallation.id
            ? { ...i, status: "inspection_approved", progress: 88, applicationStatus: "inspection_approved" }
            : i,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("officerInstallationsUnableToGenerate"))
    } finally {
      setAgreementLoading(false)
    }
  }

  const handleSendAgreement = async () => {
    if (!agreement) return
    setAgreementLoading(true)
    try {
      const res = await fetch(`/api/agreements/${agreement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("officerInstallationsUnableToSend"))
      }
      const data = await res.json()
      setAgreement(data.agreement)
      setInstallations((prev) =>
        prev.map((i) =>
          i.applicationId === selectedInstallation?.applicationId
            ? { ...i, status: "agreement_sent", progress: 90, applicationStatus: "agreement_sent" }
            : i,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("officerInstallationsUnableToSend"))
    } finally {
      setAgreementLoading(false)
    }
  }

  const handleApproveAgreement = async () => {
    if (!agreement) return
    setAgreementLoading(true)
    try {
      const res = await fetch(`/api/agreements/${agreement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("officerInstallationsUnableToApprove"))
      }
      const data = await res.json()
      setAgreement(data.agreement)
      setInstallations((prev) =>
        prev.map((i) =>
          i.applicationId === selectedInstallation?.applicationId
            ? { ...i, status: "completed", progress: 100, applicationStatus: "completed" }
            : i,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("officerInstallationsUnableToApprove"))
    } finally {
      setAgreementLoading(false)
    }
  }

  const filteredInstallations = installations.filter(
    (i) =>
      i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.installerName || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isPrevious = (installation: Installation) =>
    installation.applicationStatus === "completed" || installation.applicationStatus === "officer_final_approved"

  const activeInstallations = filteredInstallations.filter((installation) => !isPrevious(installation))
  const previousInstallations = filteredInstallations.filter(isPrevious)

  const InstallationCard = ({ installation }: { installation: Installation }) => (
    <Card className="hover:border-emerald-500/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground">{installation.id}</p>
              {getStatusBadge(installation.status)}
            </div>
            <p className="text-sm text-muted-foreground">{installation.customerName}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-emerald-600">{installation.capacity || t("notAvailable")}</p>
            <p className="text-xs text-muted-foreground">{installation.applicationId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-foreground">{installation.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="w-4 h-4" />
            <span className="text-foreground">{installation.installerName || t("officerInstallationsAwaitingAssignment")}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <p className="text-muted-foreground">{t("officerInstallationsProgress")}</p>
            <p className="text-foreground">{installation.progress}%</p>
          </div>
          <Progress value={installation.progress} />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => {
                setSelectedInstallation(installation)
                setDetailsOpen(true)
                loadAgreement(installation.applicationId)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              {t("officerInstallationsViewDetails")}
            </Button>
          </div>
          {installation.status === "pending_inspection" && (
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => {
                setSelectedInstallation(installation)
                setApproveDialogOpen(true)
              }}
            >
              {t("officerInstallationsApproveInspection")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("officerInstallationsTitle")}</h1>
            <p className="text-muted-foreground">{t("officerInstallationsSubtitle")}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("officerInstallationsSearch")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

        {loading ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {t("officerInstallationsLoading")}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{t("officerInstallationsTotal")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{t("officerInstallationsInProgress")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{t("officerInstallationsPendingInspection")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingInspection}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{t("officerInstallationsIssues")}</p>
                  <p className="text-2xl font-bold text-foreground">{stats.issues}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">{t("officerInstallationsActive")}</h2>
                {activeInstallations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("officerInstallationsNoActive")}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeInstallations.map((installation) => (
                      <InstallationCard key={installation.id} installation={installation} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">{t("officerInstallationsPrevious")}</h2>
                {previousInstallations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("officerInstallationsNoPrevious")}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {previousInstallations.map((installation) => (
                      <InstallationCard key={installation.id} installation={installation} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent className="officer-dialog">
            <DialogHeader>
              <DialogTitle>{t("officerInstallationsApproveInspectionTitle")}</DialogTitle>
              <DialogDescription>{t("officerInstallationsApproveInspectionDesc")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                {t("officerInstallationsCancel")}
              </Button>
              <Button onClick={handleApproveInspection} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                {t("officerInstallationsApprove")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="officer-dialog">
            <DialogHeader>
              <DialogTitle>{t("officerInstallationsDetailsTitle")}</DialogTitle>
              <DialogDescription>{selectedInstallation?.id}</DialogDescription>
            </DialogHeader>
            {selectedInstallation && (
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsCustomer")}</p>
                    <p className="font-medium text-foreground">{selectedInstallation.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedInstallation.customerEmail || t("officerInstallationsNoEmail")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t("officerInstallationsStatus")}</p>
                    {getStatusBadge(selectedInstallation.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsApplication")}</p>
                    <p className="font-medium text-foreground">{selectedInstallation.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsInstaller")}</p>
                    <p className="font-medium text-foreground">
                      {selectedInstallation.installerName || t("officerInstallationsAwaitingAssignment")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsInstallerContact")}</p>
                    <p className="font-medium text-foreground">
                      {selectedInstallation.installerPhone || t("officerInstallationsNotProvided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsSiteVisit")}</p>
                    <p className="font-medium text-foreground">
                      {selectedInstallation.siteVisitDate
                        ? new Date(selectedInstallation.siteVisitDate).toLocaleString()
                        : t("officerInstallationsNotScheduled")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsCustomerPhone")}</p>
                    <p className="font-medium text-foreground">
                      {selectedInstallation.customerPhone || t("officerInstallationsNotProvided")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsPaymentStatus")}</p>
                    <p className="font-medium text-foreground">
                      {selectedInstallation.paymentStatus?.toUpperCase() || t("notAvailable")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("officerInstallationsAddress")}</p>
                  <p className="font-medium text-foreground">{selectedInstallation.address}</p>
                </div>
                {selectedInstallation.installerAddress && (
                  <div>
                    <p className="text-muted-foreground">{t("installerAddress")}</p>
                    <p className="font-medium text-foreground">{selectedInstallation.installerAddress}</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsRoofType")}</p>
                    <p className="font-medium text-foreground">{selectedInstallation.roofType || t("notAvailable")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsRoofArea")}</p>
                    <p className="font-medium text-foreground">{selectedInstallation.roofArea || t("notAvailable")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("officerInstallationsDesiredCapacity")}</p>
                    <p className="font-medium text-foreground">
                      {selectedInstallation.desiredCapacity || t("notAvailable")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("officerInstallationsSiteVisitNotes")}</p>
                  <p className="font-medium text-foreground">
                    {selectedInstallation.siteVisitNotes || t("officerInstallationsNotProvided")}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground">{t("officerInstallationsProgress")}</p>
                    <p className="font-medium text-foreground">{selectedInstallation.progress}%</p>
                  </div>
                  <Progress value={selectedInstallation.progress} />
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">{t("officerInstallationsAgreement")}</p>
                  {agreementLoading ? (
                    <p className="text-xs text-muted-foreground">{t("officerInstallationsLoadingAgreement")}</p>
                  ) : agreement ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex gap-3">
                        {agreement.customerPdfUrl && (
                          <a className="text-emerald-600 underline" href={agreement.customerPdfUrl} target="_blank">
                            {t("officerInstallationsCustomerPDF")}
                          </a>
                        )}
                        {agreement.installerPdfUrl && (
                          <a className="text-emerald-600 underline" href={agreement.installerPdfUrl} target="_blank">
                            {t("officerInstallationsInstallerPDF")}
                          </a>
                        )}
                        {agreement.customerSignedUrl && (
                          <a className="text-emerald-600 underline" href={agreement.customerSignedUrl} target="_blank">
                            {t("officerInstallationsCustomerSigned")}
                          </a>
                        )}
                        {agreement.installerSignedUrl && (
                          <a className="text-emerald-600 underline" href={agreement.installerSignedUrl} target="_blank">
                            {t("officerInstallationsInstallerSigned")}
                          </a>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {t("officerInstallationsCustomerSigned")}: {agreement.customerSignedUrl ? t("yes") : t("no")} ·{" "}
                        {t("officerInstallationsInstallerSigned")}: {agreement.installerSignedUrl ? t("yes") : t("no")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">{t("officerInstallationsNoAgreement")}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateAgreement}
                      disabled={agreementLoading}
                    >
                      {t("officerInstallationsGenerateAgreement")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSendAgreement}
                      disabled={!agreement || agreementLoading}
                    >
                      {t("officerInstallationsSendAgreement")}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={handleApproveAgreement}
                      disabled={!agreement?.customerSignedUrl || !agreement?.installerSignedUrl || agreementLoading}
                    >
                      {t("officerInstallationsApproveAgreement")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                {t("officerInstallationsClose")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
