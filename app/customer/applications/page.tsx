"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Clock, CheckCircle, AlertCircle, Calendar, ArrowRight, Zap } from "lucide-react"
import { fetchApplications, type Application } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

const statusConfig: Record<string, { labelKey: string; color: string; icon: React.ElementType }> = {
  pending: { labelKey: "statusPending", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Clock },
  under_review: { labelKey: "statusUnderReview", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: FileText },
  pre_visit_approved: {
    labelKey: "statusApprovedPaymentPending",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  site_visit_scheduled: { labelKey: "statusSiteVisitScheduled", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200", icon: Calendar },
  approved: { labelKey: "statusApproved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle },
  site_visit_payment_completed: {
    labelKey: "statusPaymentCompleted",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: { labelKey: "statusRejected", color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertCircle },
  payment_pending: { labelKey: "statusPaymentPending", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Clock },
  payment_confirmed: { labelKey: "statusPaymentConfirmed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle },
  finding_installer: { labelKey: "statusFindingInstaller", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: FileText },
  installation_in_progress: { labelKey: "statusInstallationProgress", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200", icon: Zap },
  installation_complete: {
    labelKey: "statusInstallationComplete",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  final_inspection: { labelKey: "statusFinalInspection", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: FileText },
  agreement_pending: { labelKey: "statusAgreementPending", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Clock },
  inspection_approved: { labelKey: "statusInspectionApproved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle },
  agreement_sent: { labelKey: "statusAgreementSent", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200", icon: FileText },
  customer_signed: { labelKey: "statusCustomerSigned", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: FileText },
  installer_signed: { labelKey: "statusInstallerSigned", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: FileText },
  officer_final_approved: { labelKey: "statusFinalApproval", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle },
  completed: { labelKey: "statusCompleted", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle },
}

export default function CustomerApplications() {
  const { t } = useLanguage()
  const [applications, setApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const apps = await fetchApplications()
        setApplications(apps)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadApplications"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [t])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-300 rounded-full blur-3xl" />
        </div>

        <div className="relative space-y-6 p-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                {t("myApplications")}
              </h1>
              <p className="text-muted-foreground mt-1">{t("applicationsSubtitle")}</p>
            </div>
            <Link href="/customer/applications/new">
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                {t("newApplication")}
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchByApplicationId")}
                    className="pl-11 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 bg-white">
                    <SelectValue placeholder={t("filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStatus")}</SelectItem>
                    <SelectItem value="pending">{t("statusPending")}</SelectItem>
                    <SelectItem value="pre_visit_approved">{t("statusApprovedPaymentPending")}</SelectItem>
                    <SelectItem value="approved">{t("statusApproved")}</SelectItem>
                    <SelectItem value="site_visit_payment_completed">{t("statusPaymentCompleted")}</SelectItem>
                    <SelectItem value="rejected">{t("statusRejected")}</SelectItem>
                    <SelectItem value="payment_pending">{t("statusPaymentPending")}</SelectItem>
                    <SelectItem value="installation_in_progress">{t("statusInstallationProgress")}</SelectItem>
                    <SelectItem value="agreement_sent">{t("statusAgreementSent")}</SelectItem>
                    <SelectItem value="customer_signed">{t("statusCustomerSigned")}</SelectItem>
                    <SelectItem value="installer_signed">{t("statusInstallerSigned")}</SelectItem>
                    <SelectItem value="officer_final_approved">{t("statusFinalApproval")}</SelectItem>
                    <SelectItem value="completed">{t("statusCompleted")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
              <CardTitle className="text-foreground text-xl">
                {t("applications")} ({filteredApplications.length})
              </CardTitle>
              <CardDescription>{t("applicationsListDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">{t("loadingApplications")}</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FileText className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t("noApplicationsFound")}</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchQuery || statusFilter !== "all"
                      ? t("adjustSearchFilter")
                      : t("noApplicationsDescription")}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <Link href="/customer/applications/new">
                      <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("createApplication")}
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app, index) => {
                    const status = statusConfig[app.status] || statusConfig.pending
                    const StatusIcon = status.icon
                    return (
                      <div
                        key={app.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-emerald-100 bg-white hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-green-50/30 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-emerald-700 transition-colors text-lg">
                              {app.id}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {app.technicalDetails.roofType} • {app.technicalDetails.monthlyConsumption}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("createdOn")}: {new Date(app.createdAt).toLocaleDateString()} • {t("updated")}:{" "}
                              {new Date(app.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 justify-between sm:justify-end">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${status.color} border shadow-sm font-medium px-3 py-1.5`} variant="secondary">
                              <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                              {t(status.labelKey as any)}
                            </Badge>
                            {app.status === "pre_visit_approved" && !app.siteVisitFeePaid && (
                              <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 border shadow-sm" variant="secondary">
                                {t("paySiteVisitFeeSchedule")}
                              </Badge>
                            )}
                            {app.status !== "payment_pending" &&
                              (app.status === "site_visit_payment_completed" || app.siteVisitFeePaid) && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 border shadow-sm" variant="secondary">
                                {t("paymentReceived")}
                              </Badge>
                            )}
                            {app.status === "site_visit_scheduled" && app.siteVisitDate && (
                              <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-200 border shadow-sm" variant="secondary">
                                {t("visitLabel")}: {new Date(app.siteVisitDate).toLocaleString()}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {app.status === "pre_visit_approved" && !app.siteVisitFeePaid && (
                              <Link href="/customer/invoices">
                                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all hover:scale-105">
                                  {t("paySiteVisitFee")}
                                </Button>
                              </Link>
                            )}
                            <Link href={`/customer/applications/${app.id}`}>
                              <Button variant="outline" size="sm" className="bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 group/btn">
                                {t("viewDetails")}
                                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}