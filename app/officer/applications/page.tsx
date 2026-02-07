"use client"

import type React from "react"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Download,
  Zap,
  MapPin,
} from "lucide-react"

import type { Application, DocumentMeta } from "@/lib/auth"

function OfficerApplicationsContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const defaultStatus = searchParams.get("status") || "all"

  const [applications, setApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(defaultStatus)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [siteVisitDate, setSiteVisitDate] = useState("")
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: t("officerApplicationsPending"), color: "bg-amber-500/10 text-amber-600", icon: Clock },
    under_review: { label: t("officerApplicationsUnderReview"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
    pre_visit_approved: {
      label: t("officerApplicationsApprovedPayment"),
      color: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle,
    },
    site_visit_scheduled: { label: t("officerApplicationsSiteVisitScheduled"), color: "bg-cyan-500/10 text-cyan-600", icon: Calendar },
    approved: { label: t("officerApplicationsApproved"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
    site_visit_payment_completed: {
      label: t("officerApplicationsSiteVisitPaymentCompleted"),
      color: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle,
    },
    rejected: { label: t("officerApplicationsRejected"), color: "bg-red-500/10 text-red-600", icon: AlertCircle },
    payment_pending: { label: t("statusPaymentPending"), color: "bg-amber-500/10 text-amber-600", icon: Clock },
    payment_confirmed: { label: t("statusPaymentConfirmed"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
    finding_installer: { label: t("statusFindingInstaller"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
    installation_in_progress: { label: t("statusInstallationProgress"), color: "bg-cyan-500/10 text-cyan-600", icon: Zap },
    installation_complete: { label: t("statusInstallationComplete"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
    final_inspection: { label: t("statusFinalInspection"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
    agreement_pending: { label: t("statusAgreementPending"), color: "bg-amber-500/10 text-amber-600", icon: Clock },
    inspection_approved: { label: t("statusInspectionApproved"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
    agreement_sent: { label: t("statusAgreementSent"), color: "bg-cyan-500/10 text-cyan-600", icon: FileText },
    customer_signed: { label: t("statusCustomerSigned"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
    installer_signed: { label: t("statusInstallerSigned"), color: "bg-blue-500/10 text-blue-600", icon: FileText },
    officer_final_approved: { label: t("statusFinalApproval"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
    completed: { label: t("statusCompleted"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  }

  const getSubmissionCutoff = (app?: Application | null) => {
    if (!app?.createdAt) return ""
    const cutoff = new Date(app.createdAt)
    cutoff.setMinutes(cutoff.getMinutes() + 1)
    return cutoff.toISOString().slice(0, 16)
  }

  useEffect(() => {
    const fetchApps = async () => {
      const res = await fetch("/api/officer/applications")
      const data = await res.json()
      setApplications(data.applications)
    }
    fetchApps()
  }, [])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [applications, searchQuery, statusFilter])

  const refreshApp = (updated: Application) => {
    setApplications((prev) => prev.map((app) => (app.id === updated.id ? updated : app)))
    setSelectedApp(updated)
  }

  const updateStatus = async (
    status: Application["status"],
    extras?: { rejectionReason?: string; siteVisitDate?: string },
  ) => {
    if (!selectedApp) return
    const res = await fetch("/api/officer/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: selectedApp.id, status, ...extras }),
    })
    const raw = await res.text()
    let data: any = {}
    if (raw) {
      try {
        data = JSON.parse(raw)
      } catch {
        data = {}
      }
    }
    if (res.ok) {
      refreshApp(data.application)
      return { ok: true }
    } else {
      return {
        ok: false,
        error: data.error || res.statusText || t("officerApplicationsUpdateError"),
      }
    }
  }

  const handlePreVisitApprove = async () => {
    const result = await updateStatus("pre_visit_approved")
    if (!result?.ok) {
      alert(result?.error || t("officerApplicationsUpdateError"))
    }
  }

  const handleFinalApprove = async () => {
    const result = await updateStatus("approved")
    if (!result?.ok) {
      alert(result?.error || t("officerApplicationsUpdateError"))
    }
  }

  const handleReject = async () => {
    const result = await updateStatus("rejected", { rejectionReason: rejectReason })
    if (!result?.ok) {
      alert(result?.error || t("officerApplicationsUpdateError"))
      return
    }
    setShowRejectDialog(false)
    setRejectReason("")
  }

  const handleScheduleSiteVisit = async () => {
    setScheduleError(null)
    if (selectedApp?.createdAt && siteVisitDate) {
      const submittedAt = new Date(selectedApp.createdAt)
      const proposed = new Date(siteVisitDate)
      if (Number.isNaN(proposed.getTime())) {
        setScheduleError(t("officerApplicationsInvalidDate"))
        return
      }
      if (proposed <= submittedAt) {
        setScheduleError(t("officerApplicationsVisitAfterSubmit"))
        return
      }
    }
    const result = await updateStatus("site_visit_scheduled", { siteVisitDate })
    if (!result?.ok) {
      setScheduleError(result?.error || t("officerApplicationsScheduleError"))
      return
    }
    setShowScheduleDialog(false)
    setSiteVisitDate("")
  }

  const openScheduleDialog = () => {
    if (selectedApp?.siteVisitDate) {
      const localValue = new Date(selectedApp.siteVisitDate).toISOString().slice(0, 16)
      setSiteVisitDate(localValue)
    }
    setScheduleError(null)
    setShowScheduleDialog(true)
  }

  const renderDocument = (name: string, doc?: DocumentMeta) => (
    <div key={name} className="flex items-center justify-between p-2 rounded border border-border">
      <span className="text-sm capitalize text-foreground">{name.replace(/([A-Z])/g, " $1").trim()}</span>
      {doc ? (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
            <a href={doc.url} target="_blank" rel="noreferrer">
              <Download className="w-3 h-3" />
            </a>
          </Button>
        </div>
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("officerApplicationsTitle")}</h1>
          <p className="text-muted-foreground">{t("officerApplicationsSubtitle")}</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("officerApplicationsSearch")}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={t("officerApplicationsFilter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("officerApplicationsAllStatus")}</SelectItem>
                  <SelectItem value="pending">{t("officerApplicationsPending")}</SelectItem>
                  <SelectItem value="under_review">{t("officerApplicationsUnderReview")}</SelectItem>
                  <SelectItem value="pre_visit_approved">{t("officerApplicationsApprovedPayment")}</SelectItem>
                  <SelectItem value="site_visit_scheduled">{t("officerApplicationsSiteVisitScheduled")}</SelectItem>
                  <SelectItem value="approved">{t("officerApplicationsApproved")}</SelectItem>
                  <SelectItem value="site_visit_payment_completed">{t("officerApplicationsSiteVisitPaymentCompleted")}</SelectItem>
                  <SelectItem value="rejected">{t("officerApplicationsRejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">
              {t("officerApplicationsListTitle")} ({filteredApplications.length})
            </CardTitle>
            <CardDescription>{t("officerApplicationsListDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const status = statusConfig[app.status] || statusConfig.pending
                const StatusIcon = status.icon
                return (
                  <div
                    key={app.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border border-border hover:border-blue-500/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex items-start gap-4 mb-4 lg:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{app.customerName}</p>
                          <Badge className={status.color} variant="secondary">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{app.id}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {app.address} • {app.technicalDetails?.roofType || app.connectionPhase || t("notAvailable")}
                        </p>
                        {["pre_visit_approved", "approved", "site_visit_payment_completed"].includes(app.status) && (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge
                              className={
                                app.siteVisitFeePaid
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-amber-500/10 text-amber-600"
                              }
                              variant="secondary"
                            >
                              {app.siteVisitFeePaid
                                ? t("officerApplicationsSiteVisitFeePaid")
                                : t("officerApplicationsSiteVisitFeePending")}
                            </Badge>
                          </div>
                        )}
                        {app.siteVisitDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("officerApplicationsSiteVisitDate")}: {new Date(app.siteVisitDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{new Date(app.createdAt).toLocaleDateString()}</p>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="w-4 h-4 mr-1" />
                        {t("officerApplicationsReviewButton")}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Application Detail Dialog */}
        <Dialog
          open={!!selectedApp && !showRejectDialog && !showScheduleDialog}
          onOpenChange={() => setSelectedApp(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">{t("officerApplicationsDialogTitle")}</DialogTitle>
              <DialogDescription>{selectedApp?.id}</DialogDescription>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3">{t("officerApplicationsCustomerInfo")}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsName")}</p>
                      <p className="text-foreground">{selectedApp.customerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsEmail")}</p>
                      <p className="text-foreground">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsPhone")}</p>
                      <p className="text-foreground">{selectedApp.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsAddress")}</p>
                      <p className="text-foreground">{selectedApp.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsSubmitted")}</p>
                      <p className="text-foreground">{new Date(selectedApp.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsSiteVisitDate")}</p>
                      <p className="text-foreground">
                        {selectedApp.siteVisitDate
                          ? new Date(selectedApp.siteVisitDate).toLocaleString()
                          : t("officerApplicationsNotScheduled")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    {t("officerApplicationsTechnicalDetails")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsRoofType")}</p>
                      <p className="text-foreground">{selectedApp.technicalDetails.roofType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsRoofArea")}</p>
                      <p className="text-foreground">{selectedApp.technicalDetails.roofArea}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsMonthlyConsumption")}</p>
                      <p className="text-foreground">{selectedApp.technicalDetails.monthlyConsumption}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("officerApplicationsConnectionPhase")}</p>
                      <p className="text-foreground">{selectedApp.technicalDetails.connectionPhase}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3">{t("officerApplicationsUploadedDocuments")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {renderDocument("nic", selectedApp.documents.nic)}
                    {renderDocument("bankDetails", selectedApp.documents.bankDetails)}
                    {renderDocument("electricityBill", selectedApp.documents.electricityBill)}
                    {renderDocument("propertyDocument", selectedApp.documents.propertyDocument)}
                  </div>
                </div>

                {/* Review metadata */}
                {selectedApp.reviewedAt && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {t("officerApplicationsVerificationTimeline")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("officerApplicationsLastReviewed")} {new Date(selectedApp.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex-col sm:flex-row gap-2">
              {selectedApp?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500/50 hover:bg-red-500/10 bg-transparent"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {t("officerApplicationsRejectButton")}
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handlePreVisitApprove}>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {t("officerApplicationsApproveButton")}
                  </Button>
                </>
              )}
              {selectedApp?.status === "pre_visit_approved" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500/50 hover:bg-red-500/10 bg-transparent"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {t("officerApplicationsRejectButton")}
                  </Button>
                </>
              )}
              {selectedApp?.status === "site_visit_payment_completed" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500/50 hover:bg-red-500/10 bg-transparent"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {t("officerApplicationsRejectButton")}
                  </Button>
                  <Button variant="outline" className="bg-transparent" onClick={openScheduleDialog}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {t("officerApplicationsScheduleSiteVisit")}
                  </Button>
                </>
              )}
              {selectedApp?.status === "site_visit_scheduled" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500/50 hover:bg-red-500/10 bg-transparent"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {t("officerApplicationsRejectButton")}
                  </Button>
                  <Button variant="outline" className="bg-transparent" onClick={openScheduleDialog}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {t("officerApplicationsRescheduleSiteVisit")}
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleFinalApprove}>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {t("officerApplicationsApproveAfterVisit")}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">{t("officerApplicationsRejectTitle")}</DialogTitle>
              <DialogDescription>
                {t("officerApplicationsRejectDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("officerApplicationsRejectionReason")}</Label>
                <Textarea
                  placeholder={t("officerApplicationsRejectionReasonPlaceholder")}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="bg-transparent">
                {t("cancel")}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                {t("officerApplicationsConfirmRejection")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Site Visit Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">{t("officerApplicationsScheduleTitle")}</DialogTitle>
              <DialogDescription>{t("officerApplicationsScheduleDescription")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {scheduleError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {scheduleError}
                </div>
              )}
              {selectedApp?.status !== "site_visit_payment_completed" &&
                selectedApp?.status !== "site_visit_scheduled" && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
                  {t("officerApplicationsPaymentRequired")}
                </div>
              )}
              <div className="space-y-2">
                <Label>{t("officerApplicationsSiteVisitDateTime")}</Label>
                <Input
                  type="datetime-local"
                  value={siteVisitDate}
                  onChange={(e) => setSiteVisitDate(e.target.value)}
                  min={getSubmissionCutoff(selectedApp)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("officerApplicationsScheduleNote")}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="bg-transparent">
                {t("cancel")}
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleScheduleSiteVisit}
                disabled={
                  !siteVisitDate ||
                  (selectedApp?.status !== "site_visit_payment_completed" &&
                    selectedApp?.status !== "site_visit_scheduled")
                }
              >
                {t("officerApplicationsScheduleVisit")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function ApplicationsLoading() {
  const { t } = useLanguage()
  return <div>{t("loadingGeneric")}</div>
}

export default function OfficerApplications() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <OfficerApplicationsContent />
    </Suspense>
  )
}
