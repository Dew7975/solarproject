"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VerificationPendingCard } from "@/components/verification-pending-card"

import { BarChart3, Download, TrendingUp, Package, Star, Users, Sparkles, AlertTriangle } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

import { fetchApplications, fetchCurrentUser, fetchInstallers, type Application } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

type Invoice = {
  id: string
  amount: number
  type: "authority_fee" | "installation" | "monthly_bill"
  status: "pending" | "paid" | "overdue"
  createdAt: string
}

type BidSession = {
  id: string
  bids: { installerId?: string; status: string }[]
  startedAt: string
}

function AnimatedYellowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_0%,rgba(250,204,21,0.35),transparent_58%),radial-gradient(55%_55%_at_100%_20%,rgba(245,158,11,0.22),transparent_55%),radial-gradient(60%_60%_at_40%_100%,rgba(251,146,60,0.18),transparent_60%)]" />
      <motion.div
        className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-amber-500/16 blur-3xl"
        animate={{ x: [0, -36, 0], y: [0, -18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.35)_1px,transparent_1px)] dark:opacity-[0.12] [background-size:46px_46px]" />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  tone: "yellow" | "amber" | "emerald" | "cyan" | "purple"
}) {
  const tones: Record<string, { wrap: string; iconWrap: string; iconColor: string }> = {
    yellow: {
      wrap: "border-yellow-500/25 bg-gradient-to-br from-yellow-500/16 via-background/70 to-orange-500/10",
      iconWrap: "bg-yellow-400/20 border-yellow-500/20",
      iconColor: "text-yellow-800 dark:text-yellow-300",
    },
    amber: {
      wrap: "border-amber-500/25 bg-gradient-to-br from-amber-500/16 via-background/70 to-yellow-500/10",
      iconWrap: "bg-amber-500/20 border-amber-500/20",
      iconColor: "text-amber-800 dark:text-amber-300",
    },
    emerald: {
      wrap: "border-emerald-500/20 bg-gradient-to-br from-emerald-500/12 via-background/70 to-yellow-500/10",
      iconWrap: "bg-emerald-500/15 border-emerald-500/20",
      iconColor: "text-emerald-700 dark:text-emerald-300",
    },
    cyan: {
      wrap: "border-cyan-500/20 bg-gradient-to-br from-cyan-500/12 via-background/70 to-yellow-500/10",
      iconWrap: "bg-cyan-500/15 border-cyan-500/20",
      iconColor: "text-cyan-700 dark:text-cyan-300",
    },
    purple: {
      wrap: "border-purple-500/20 bg-gradient-to-br from-purple-500/12 via-background/70 to-yellow-500/10",
      iconWrap: "bg-purple-500/15 border-purple-500/20",
      iconColor: "text-purple-700 dark:text-purple-300",
    },
  }

  const t = tones[tone]

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden rounded-3xl border ${t.wrap} shadow-sm`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border grid place-items-center ${t.iconWrap}`}
              animate={{ rotate: [0, 1.5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className={`h-5 w-5 ${t.iconColor}`} />
            </motion.div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{label}</p>
              <p className="text-lg sm:text-2xl font-extrabold text-foreground tracking-tight">{value}</p>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-yellow-950/10 dark:bg-yellow-50/10 overflow-hidden">
            <motion.div
              className="h-1.5 w-1/3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
              initial={{ x: "-70%" }}
              animate={{ x: ["-70%", "140%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function InstallerReports() {
  const { t } = useLanguage()

  const [period, setPeriod] = useState("6months")
  const [applications, setApplications] = useState<Application[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [sessions, setSessions] = useState<BidSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    async function loadStatus() {
      try {
        const current = await fetchCurrentUser()
        const installers = await fetchInstallers(false)
        const installer = installers.find((inst) => inst.id === current?.organization?.id)
        if (!active) return
        setIsVerified(Boolean(installer?.verified))
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : t("installer_reports_error_status"))
        setIsVerified(false)
      } finally {
        if (!active) return
        setCheckingStatus(false)
      }
    }

    loadStatus()
    return () => {
      active = false
    }
  }, [t])

  useEffect(() => {
    async function load() {
      if (checkingStatus || isVerified === false) {
        setLoading(false)
        return
      }
      try {
        const [apps, invoicesRes, bidsRes] = await Promise.all([
          fetchApplications(),
          fetch("/api/payments?includeMonthly=true", { cache: "no-store" }),
          fetch("/api/bids", { cache: "no-store" }),
        ])
        if (!invoicesRes.ok) throw new Error(t("installer_reports_error_invoices"))
        const invoicesData = await invoicesRes.json()
        const bidsData = bidsRes.ok ? await bidsRes.json() : { bidSessions: [] }
        setApplications(apps)
        setInvoices(invoicesData.invoices ?? [])
        setSessions(bidsData.bidSessions ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t("installer_reports_error_load"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [checkingStatus, isVerified, t])

  const monthWindow = period === "1month" ? 1 : period === "3months" ? 3 : period === "1year" ? 12 : 6
  const now = new Date()

  const months = useMemo(() => {
    const result: { key: string; label: string; month: number; year: number }[] = []
    for (let i = monthWindow - 1; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      result.push({
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: date.toLocaleString("default", { month: "short" }),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      })
    }
    return result
  }, [monthWindow, now])

  const installationInvoices = invoices.filter((inv) => inv.type === "installation")

  const monthlyData = useMemo(() => {
    return months.map((m) => {
      const revenue = installationInvoices
        .filter((inv) => {
          const created = new Date(inv.createdAt)
          return created.getMonth() + 1 === m.month && created.getFullYear() === m.year
        })
        .reduce((sum, inv) => sum + inv.amount, 0)

      const installations = applications.filter((app) => {
        const created = new Date(app.createdAt)
        return created.getMonth() + 1 === m.month && created.getFullYear() === m.year
      }).length

      const bidsWon = sessions
        .filter((session) => {
          const started = new Date(session.startedAt)
          return started.getMonth() + 1 === m.month && started.getFullYear() === m.year
        })
        .filter((session) => session.bids.some((bid) => bid.status === "accepted")).length

      return { month: m.label, revenue, installations, bidsWon }
    })
  }, [months, installationInvoices, applications, sessions])

  const stats = useMemo(() => {
    const totalRevenue = installationInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    const totalInstallations = applications.filter((app) =>
      ["installation_in_progress", "installation_complete", "final_inspection", "completed"].includes(app.status),
    ).length
    const bidWins = sessions.filter((session) => session.bids.some((bid) => bid.status === "accepted")).length
    const bidsTotal = sessions.length
    const bidSuccessRate = bidsTotal ? Math.round((bidWins / bidsTotal) * 100) : 0
    return {
      totalRevenue,
      totalInstallations,
      avgRating: 4.8,
      bidSuccessRate,
      repeatCustomers: new Set(applications.map((app) => app.customerId)).size,
    }
  }, [applications, installationInvoices, sessions])

  const packagePerformance = useMemo(() => {
    const map = new Map<string, { sales: number; revenue: number }>()
    applications.forEach((app) => {
      const name = app.selectedInstaller?.packageName ?? t("installer_reports_unspecified")
      const price = app.selectedInstaller?.price ?? 0
      const current = map.get(name) ?? { sales: 0, revenue: 0 }
      map.set(name, { sales: current.sales + 1, revenue: current.revenue + price })
    })
    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      sales: values.sales,
      revenue: values.revenue,
    }))
  }, [applications, t])

  const maxPkgRevenue = useMemo(() => {
    return packagePerformance.reduce((m, p) => Math.max(m, p.revenue), 0) || 1
  }, [packagePerformance])

  const chartColors = {
    revenueStroke: "#f59e0b", // amber-500
    revenueFill: "#f59e0b",
    installations: "#fbbf24", // yellow-400
    bidsWon: "#10b981", // emerald-500
  }

  if (checkingStatus) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          {t("installer_reports_loading")}
        </div>
      </DashboardLayout>
    )
  }

  if (isVerified === false) {
    return (
      <DashboardLayout>
        <VerificationPendingCard />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_55%)]" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Hero Header */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                      <Sparkles className="h-5 w-5 text-yellow-950/80" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                        {t("installer_reports_title")}
                      </h1>
                      <p className="text-xs text-muted-foreground truncate">{t("installer_reports_subtitle")}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <span className="min-w-0">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full sm:w-44 rounded-2xl border-yellow-500/25 bg-background/50">
                      <SelectValue placeholder={t("installer_reports_select_period")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">{t("installer_reports_period_1m")}</SelectItem>
                      <SelectItem value="3months">{t("installer_reports_period_3m")}</SelectItem>
                      <SelectItem value="6months">{t("installer_reports_period_6m")}</SelectItem>
                      <SelectItem value="1year">{t("installer_reports_period_1y")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold shadow-sm"
                      asChild
                    >
                      <a href="/api/reports/installer/pdf" download>
                        <Download className="w-4 h-4 mr-2" />
                        {t("installer_reports_export_pdf")}
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3"
          >
            <StatCard
              label={t("installer_reports_total_revenue")}
              value={`${t("installer_reports_rs")} ${(stats.totalRevenue / 1_000_000).toFixed(1)}${t(
                "installer_reports_million_suffix",
              )}`}
              icon={TrendingUp}
              tone="amber"
            />
            <StatCard
              label={t("installer_reports_installations")}
              value={stats.totalInstallations}
              icon={Package}
              tone="yellow"
            />
            <StatCard label={t("installer_reports_avg_rating")} value={stats.avgRating} icon={Star} tone="amber" />
            <StatCard
              label={t("installer_reports_bid_success")}
              value={`${stats.bidSuccessRate}%`}
              icon={BarChart3}
              tone="cyan"
            />
            <StatCard
              label={t("installer_reports_repeat_customers")}
              value={stats.repeatCustomers}
              icon={Users}
              tone="purple"
            />
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm overflow-hidden">
                <CardHeader className="py-4">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    {t("installer_reports_revenue_trend_title")}
                  </CardTitle>
                  <CardDescription>{t("installer_reports_revenue_trend_desc")}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {loading ? (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      {t("installer_reports_loading_chart")}
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" tickFormatter={(v) => `${v / 1_000_000}M`} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "12px",
                            }}
                            formatter={(value: number) => [
                              `${t("installer_reports_rs")} ${value.toLocaleString()}`,
                              t("installer_reports_revenue_label"),
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={chartColors.revenueStroke}
                            fill={chartColors.revenueFill}
                            fillOpacity={0.18}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm overflow-hidden">
                <CardHeader className="py-4">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                    {t("installer_reports_installations_bids_title")}
                  </CardTitle>
                  <CardDescription>{t("installer_reports_installations_bids_desc")}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {loading ? (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      {t("installer_reports_loading_chart")}
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "12px",
                            }}
                          />
                          <Bar
                            dataKey="installations"
                            fill={chartColors.installations}
                            name={t("installer_reports_installations")}
                            radius={[10, 10, 0, 0]}
                          />
                          <Bar
                            dataKey="bidsWon"
                            fill={chartColors.bidsWon}
                            name={t("installer_reports_bids_won")}
                            radius={[10, 10, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Package performance */}
          <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm overflow-hidden">
            <CardHeader className="py-4">
              <CardTitle className="text-foreground">{t("installer_reports_package_performance_title")}</CardTitle>
              <CardDescription>{t("installer_reports_package_performance_desc")}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {packagePerformance.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t("installer_reports_no_package_performance")}
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
                  }}
                  className="space-y-2"
                >
                  {packagePerformance.map((pkg) => {
                    const widthPct = Math.max(6, Math.round((pkg.revenue / maxPkgRevenue) * 100))
                    return (
                      <motion.div
                        key={pkg.name}
                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                        whileHover={{ y: -2 }}
                        className="rounded-3xl border border-yellow-500/20 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-extrabold text-foreground truncate">
                              {pkg.name} {t("installer_reports_package_suffix")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {pkg.sales} {t("installer_reports_sales")}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-extrabold text-foreground">
                              {t("installer_reports_rs")} {(pkg.revenue / 1_000_000).toFixed(1)}
                              {t("installer_reports_million_suffix")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("installer_reports_avg_prefix")} {t("installer_reports_rs")}{" "}
                              {pkg.sales ? Math.round(pkg.revenue / pkg.sales).toLocaleString() : 0}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 h-2 w-full rounded-full bg-yellow-950/10 dark:bg-yellow-50/10 overflow-hidden">
                          <motion.div
                            className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 18 }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}