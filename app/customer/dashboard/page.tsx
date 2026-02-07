"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Sun,
  FileText,
  Leaf,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react"

import {
  fetchApplications,
  fetchCurrentUser,
  type Application,
  type User,
} from "@/lib/auth"

const statusConfig: Record<
  string,
  { labelKey: string; color: string; icon: React.ElementType }
> = {
  pending: {
    labelKey: "statusPending",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    icon: Clock,
  },
  under_review: {
    labelKey: "statusUnderReview",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    icon: FileText,
  },
  pre_visit_approved: {
    labelKey: "statusApprovedPaymentPending",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  site_visit_scheduled: {
    labelKey: "statusSiteVisitScheduled",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    icon: Calendar,
  },
  approved: {
    labelKey: "statusApproved",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  site_visit_payment_completed: {
    labelKey: "statusPaymentCompleted",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    labelKey: "statusRejected",
    color: "bg-red-500/10 text-red-600 border-red-200",
    icon: AlertCircle,
  },
  payment_pending: {
    labelKey: "statusPaymentPending",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    icon: Clock,
  },
  payment_confirmed: {
    labelKey: "statusPaymentConfirmed",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  finding_installer: {
    labelKey: "statusFindingInstaller",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    icon: FileText,
  },
  installation_in_progress: {
    labelKey: "statusInstallationProgress",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    icon: Zap,
  },
  installation_complete: {
    labelKey: "statusInstallationComplete",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  final_inspection: {
    labelKey: "statusFinalInspection",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    icon: FileText,
  },
  agreement_pending: {
    labelKey: "statusAgreementPending",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    icon: Clock,
  },
  inspection_approved: {
    labelKey: "statusInspectionApproved",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  agreement_sent: { 
    labelKey: "statusAgreementSent", 
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-200", 
    icon: FileText 
  },
  customer_signed: { 
    labelKey: "statusCustomerSigned", 
    color: "bg-blue-500/10 text-blue-600 border-blue-200", 
    icon: FileText 
  },
  installer_signed: { 
    labelKey: "statusInstallerSigned", 
    color: "bg-blue-500/10 text-blue-600 border-blue-200", 
    icon: FileText 
  },
  officer_final_approved: { 
    labelKey: "statusFinalApproval", 
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", 
    icon: CheckCircle 
  },
  completed: {
    labelKey: "statusCompleted",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
}

export default function CustomerDashboard() {
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    totalCO2Prevented: 0,
    totalEnergyGenerated: 0,
    monthlySavings: 0,
    systemCapacity: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)

        const apps = await fetchApplications()
        const customerApps = currentUser
          ? apps.filter((app) => app.customerId === currentUser.id)
          : []

        setApplications(customerApps)

        if (currentUser) {
          const statsRes = await fetch("/api/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUser.id }),
          })
          if (statsRes.ok) {
            const data = await statsRes.json()
            setStats({
              totalCO2Prevented: Number((data.totals.co2Kg / 1000).toFixed(2)),
              totalEnergyGenerated: data.totals.kwhGenerated,
              monthlySavings: Math.max(0, data.totals.kwhExported - data.totals.kwhImported) * 30,
              systemCapacity: customerApps.length,
            })
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadDashboard"))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p>{t("loadingDashboard")}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
                {t("welcomeBack")}{user ? `, ${user.name.split(" ")[0]}` : ""}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("applicationsDescription")}
              </p>
            </div>
            <Link href="/customer/applications/new">
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                {t("newApplication")}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard icon={Leaf} label={t("co2Prevented")} value={`${stats.totalCO2Prevented} ${t("tons")}`} gradient="from-emerald-500 to-green-600" />
            <StatCard icon={Sun} label={t("energyGenerated")} value={`${stats.totalEnergyGenerated} ${t("kwh")}`} gradient="from-amber-500 to-orange-600" />
            <StatCard icon={TrendingUp} label={t("monthlySavings")} value={`${t("rs")} ${stats.monthlySavings.toLocaleString()}`} gradient="from-blue-500 to-cyan-600" />
            <StatCard icon={Zap} label={t("systemCapacity")} value={`${stats.systemCapacity} ${t("kw")}`} gradient="from-purple-500 to-pink-600" />
          </div>

          {/* Applications */}
          <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
              <div>
                <CardTitle className="text-xl">{t("myApplications")}</CardTitle>
                <CardDescription>{t("applicationsDescription")}</CardDescription>
              </div>
              <Link href="/customer/applications">
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group transition-all">
                  {t("viewAll")}
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {applications.length === 0 ? (
                <div className="text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FileText className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t("noApplications")}</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {t("noApplicationsDescription")}
                  </p>
                  <Link href="/customer/applications/new">
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Plus className="w-4 h-4 mr-2" />
                      {t("createApplication")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app, index) => {
                    const status =
                      statusConfig[app.status] || statusConfig.pending
                    const StatusIcon = status.icon

                    return (
                      <div
                        key={app.id}
                        className="group flex items-center justify-between p-5 rounded-xl border border-emerald-100 bg-white hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-green-50/30 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-emerald-700 transition-colors">{app.id}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {t("createdOn")}{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${status.color} border shadow-sm font-medium px-3 py-1.5`} variant="secondary">
                            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                            {t(status.labelKey as any)}
                          </Badge>
                          <Link href={`/customer/applications/${app.id}`}>
                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 group/btn">
                              {t("view")}
                              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </Link>
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

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType
  label: string
  value: string
  gradient: string
}) {
  return (
    <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative">
      {/* Gradient accent on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}