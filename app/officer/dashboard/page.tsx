"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  FileText,
  Building,
  Calendar,
  Receipt,
  Clock,
} from "lucide-react"

import {
  fetchApplications,
  fetchCurrentUser,
  fetchInstallers,
  fetchPayments,
  fetchUsers,
  type Application,
  type Installer,
  type Invoice,
  type User,
} from "@/lib/auth"

export default function OfficerDashboard() {
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [installers, setInstallers] = useState<Installer[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
        if (!currentUser) {
          return
        }

        const [apps, installerList, payments, userList] = await Promise.all([
          fetchApplications(),
          fetchInstallers(false),
          fetchPayments(),
          fetchUsers(),
        ])

        setApplications(apps)
        setInstallers(installerList)
        setInvoices(payments.invoices)
        setUsers(userList)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(() => {
    return {
      pendingApplications: applications.filter(
        (a) => a.status === "pending",
      ).length,

      pendingInstallerVerifications: installers.filter(
        (i) => !i.verified,
      ).length,

      scheduledSiteVisits: applications.filter(
        (a) => Boolean(a.siteVisitDate),
      ).length,

      pendingPayments: invoices.filter(
        (i) => i.status === "pending",
      ).length,

      totalCustomers: users.filter(
        (u) => u.role === "customer",
      ).length,

      totalVerifiedInstallers: installers.filter(
        (i) => i.verified,
      ).length,
    }
  }, [applications, installers, invoices, users])

  const recentApplications = applications.slice(0, 3)
  const pendingInstallers = installers
    .filter((i) => !i.verified)
    .slice(0, 3)
  const upcomingVisits = applications
    .filter((a) => a.status === "site_visit_scheduled" && a.siteVisitDate)
    .filter((a) => new Date(a.siteVisitDate as string) > new Date())
    .slice(0, 3)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          {t("officerDashboardLoading")}
        </div>
      </DashboardLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      pending: {
        label: t("statusPending"),
        className: "bg-amber-500/10 text-amber-600",
      },
      under_review: {
        label: t("statusUnderReview"),
        className: "bg-blue-500/10 text-blue-600",
      },
      pre_visit_approved: {
        label: t("statusApprovedPaymentPending"),
        className: "bg-emerald-500/10 text-emerald-600",
      },
      site_visit_scheduled: {
        label: t("officerDashboardVerificationBadgeSiteVisit"),
        className: "bg-cyan-500/10 text-cyan-600",
      },
      site_visit_payment_completed: {
        label: t("statusPaymentCompleted"),
        className: "bg-emerald-500/10 text-emerald-600",
      },
      approved: {
        label: t("statusApproved"),
        className: "bg-emerald-500/10 text-emerald-600",
      },
      rejected: {
        label: t("statusRejected"),
        className: "bg-red-500/10 text-red-600",
      },
      payment_pending: {
        label: t("statusPaymentPending"),
        className: "bg-amber-500/10 text-amber-600",
      },
      payment_confirmed: {
        label: t("statusPaymentConfirmed"),
        className: "bg-emerald-500/10 text-emerald-600",
      },
      installation_in_progress: {
        label: t("statusInstallationProgress"),
        className: "bg-cyan-500/10 text-cyan-600",
      },
      installation_complete: {
        label: t("statusInstallationComplete"),
        className: "bg-emerald-500/10 text-emerald-600",
      },
    }

    const cfg = map[status] ?? map.pending

    return (
      <Badge variant="secondary" className={cfg.className}>
        <Clock className="w-3 h-3 mr-1" />
        {cfg.label}
      </Badge>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("officerDashboardTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("officerDashboardWelcome")}, {user?.name}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t("officerDashboardPendingApplications")}
            value={stats.pendingApplications}
            icon={FileText}
            tone="amber"
          />
          <StatCard
            label={t("officerDashboardInstallerVerifications")}
            value={stats.pendingInstallerVerifications}
            icon={Building}
            tone="blue"
          />
          <StatCard
            label={t("siteVisits")}
            value={stats.scheduledSiteVisits}
            icon={Calendar}
            tone="cyan"
          />
          <StatCard
            label={t("officerDashboardPendingPayments")}
            value={stats.pendingPayments}
            icon={Receipt}
            tone="emerald"
          />
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActivityCard
            title={t("officerDashboardRecentApplications")}
            items={recentApplications.map((a) => ({
              id: a.id,
              title: a.customerName,
              badge: getStatusBadge(a.status),
            }))}
          />

          <ActivityCard
            title={t("officerDashboardInstallerVerifications")}
            items={pendingInstallers.map((i) => ({
              id: i.id,
              title: i.companyName,
              badge: (
                <Badge
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-600"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {t("officerDashboardVerificationBadgePending")}
                </Badge>
              ),
            }))}
          />

          <ActivityCard
            title={t("officerDashboardUpcomingSiteVisits")}
            items={upcomingVisits.map((v) => ({
              id: v.id,
              title: v.customerName,
              subtitle: v.siteVisitDate,
            }))}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("officerDashboardQuickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/officer/applications">
                <Button variant="outline" className="w-full">
                  {t("officerDashboardReviewApplications")}
                </Button>
              </Link>
              <Link href="/officer/installers">
                <Button variant="outline" className="w-full">
                  {t("officerDashboardVerifyInstallers")}
                </Button>
              </Link>
              <Link href="/officer/payments">
                <Button variant="outline" className="w-full">
                  {t("officerDashboardVerifyPayments")}
                </Button>
              </Link>
              <Link href="/officer/billing">
                <Button variant="outline" className="w-full">
                  {t("officerDashboardGenerateBills")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ElementType
  tone: "amber" | "blue" | "cyan" | "emerald"
}) {
  const tones: Record<string, string> = {
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-600",
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-600",
    cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-600",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600",
  }

  return (
    <Card className={tones[tone]}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityCard({
  title,
  items,
}: {
  title: string
  items: {
    id: string
    title: string
    subtitle?: string
    badge?: React.ReactNode
  }[]
}) {
  const { t } = useLanguage()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("officerDashboardNoItems")}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
              </div>
              {item.badge}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
