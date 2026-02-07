"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VerificationPendingCard } from "@/components/verification-pending-card"
import { useLanguage } from "@/context/LanguageContext"

import {
  Package,
  Gavel,
  ClipboardList,
  TrendingUp,
  Star,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Quote,
  Sparkles,
} from "lucide-react"

import {
  fetchApplications,
  fetchBidSessions,
  fetchCurrentUser,
  fetchInstallers,
  fetchPayments,
  type Application,
  type Installer,
  type BidSession,
  type User,
} from "@/lib/auth"

type InstallerReview = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  customer?: { id: string; name: string; profileImageUrl: string | null }
  application?: { id: string; reference: string; status: string }
}

/* ---------- Small UI helpers ---------- */

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={
            n <= value
              ? "w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.25)]"
              : "w-4 h-4 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  )
}

function AnimatedYellowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_0%,rgba(250,204,21,0.35),transparent_55%),radial-gradient(55%_55%_at_100%_20%,rgba(245,158,11,0.28),transparent_58%),radial-gradient(60%_60%_at_30%_100%,rgba(251,146,60,0.20),transparent_58%)]" />

      <motion.div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-400/25 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 -right-28 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl"
        animate={{ x: [0, -45, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl"
        animate={{ x: [0, 55, 0], y: [0, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.35)_1px,transparent_1px)] dark:opacity-[0.12] [background-size:48px_48px]" />
    </div>
  )
}

/* ---------- Feedback (UI enhanced, logic unchanged) ---------- */

function FeedbackOneByOne() {
  const [reviews, setReviews] = useState<InstallerReview[]>([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError("")
        const res = await fetch("/api/installers/reviews?take=50", { cache: "no-store" })
        const data = await res.json().catch(() => null)

        if (!res.ok) {
          setError(data?.error ?? `Failed to load feedback (${res.status})`)
          return
        }

        const list: InstallerReview[] = data?.reviews ?? []
        setReviews(list)
        setIdx(0)
      } catch (e: any) {
        setError(e?.message ?? "Failed to load feedback")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (reviews.length <= 1) return
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % reviews.length)
    }, 4500)
    return () => clearInterval(t)
  }, [reviews.length])

  const current = reviews[idx] ?? null
  const progress = reviews.length ? ((idx + 1) / reviews.length) * 100 : 0

  return (
    <Card className="overflow-hidden border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/60 to-orange-500/10 shadow-sm">
      <CardHeader className="py-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
              <MessageSquare className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span>Customer Feedback</span>
                <Badge className="bg-yellow-400/20 text-yellow-800 dark:text-yellow-200 border border-yellow-500/20">
                  Live
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                Rotating reviews with smooth transitions
              </p>
            </div>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
              onClick={() => setIdx((p) => (p - 1 + reviews.length) % reviews.length)}
              disabled={reviews.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
              onClick={() => setIdx((p) => (p + 1) % reviews.length)}
              disabled={reviews.length <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="h-1.5 w-full bg-yellow-950/10 dark:bg-yellow-50/10">
        <motion.div
          className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>

      <CardContent className="p-4 space-y-3">
        {loading && (
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-yellow-500/15 animate-pulse" />
            <div className="h-3 w-72 rounded bg-yellow-500/10 animate-pulse" />
            <div className="h-20 w-full rounded-xl bg-yellow-500/10 animate-pulse" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-xl border border-dashed border-yellow-500/30 p-4 text-sm text-muted-foreground bg-yellow-500/5">
            No feedback received yet.
          </div>
        )}

        {!loading && !error && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-yellow-500/25 bg-yellow-500/10">
                    {current.customer?.profileImageUrl ? (
                      // keeping simple img to avoid remote config changes
                      <img
                        src={current.customer.profileImageUrl}
                        alt={current.customer?.name ?? "Customer"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-xs text-yellow-900/70 dark:text-yellow-100/70">
                        {(current.customer?.name?.slice(0, 2) ?? "CU").toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-foreground leading-tight truncate">
                      {current.customer?.name ?? "Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {current.application?.reference ?? "Application"} •{" "}
                      {new Date(current.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <Stars value={current.rating} />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {idx + 1} / {reviews.length}
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ y: -1 }}
                className="relative rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 p-4"
              >
                <Quote className="absolute right-4 top-4 h-5 w-5 text-yellow-600/40 dark:text-yellow-300/30" />
                <p className="text-sm leading-relaxed text-foreground">
                  {current.comment?.trim() ? current.comment : "No comment"}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}

/* ---------- Page ---------- */

export default function InstallerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [installerProfile, setInstallerProfile] = useState<Installer | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [bidSessions, setBidSessions] = useState<BidSession[]>([])
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)

        const [installerList, apps, bids, payments] = await Promise.all([
          fetchInstallers(false),
          fetchApplications(),
          fetchBidSessions(),
          fetchPayments(),
        ])

        const orgId = currentUser?.organization?.id
        if (orgId) {
          const profile = installerList.find((inst) => inst.id === orgId)
          setInstallerProfile(profile ?? null)
        }

        setApplications(apps)
        setBidSessions(bids)

        setRevenue(
          payments.invoices
            .filter((inv) => inv.status === "paid")
            .reduce((sum, inv) => sum + inv.amount, 0),
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const isVerified = user?.verified !== false

  const stats = useMemo(() => {
    const activePackages =
      installerProfile?.packages.filter((pkg) => pkg.active ?? true).length ?? 0

    const pendingOrders = applications.filter((app) =>
      ["finding_installer", "installation_in_progress", "installation_complete"].includes(app.status),
    ).length

    return {
      activePackages,
      openBids: bidSessions.length ? bidSessions.filter((bs) => bs.status === "open").length : 0,
      pendingOrders,
      completedInstallations: installerProfile?.completedInstallations ?? 0,
      rating: installerProfile?.rating ?? 0,
      totalRevenue: revenue,
    }
  }, [applications, bidSessions, installerProfile, revenue])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          {t("loadingDashboard")}
        </div>
      </DashboardLayout>
    )
  }

  if (!isVerified) {
    return (
      <DashboardLayout>
        <VerificationPendingCard />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <AnimatedYellowBackdrop />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          {/* Compact yellow hero header (no navigation section) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-orange-500/12 shadow-sm"
          >
            <div className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                    <Sparkles className="h-5 w-5 text-yellow-950/80" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                      {t("welcomeBack")}
                      {user ? `, ${user.name}` : ""}
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">
                      Installer dashboard • metrics, bids, orders and feedback
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className="bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t("verifiedInstaller")}
                  </Badge>

                  <div className="flex items-center gap-1 text-sm">
                    <Stars value={stats.rating} />
                    <span className="text-sm font-semibold text-foreground">{stats.rating}</span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <Link href="/installer/packages/new">
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                    <Button className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-400 hover:via-amber-500 hover:to-orange-500 text-yellow-950 font-semibold shadow-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      {t("addPackage")}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* KPI Cards (dense + colorful + more motion) */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.07 } },
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3"
          >
            




            <StatCard label={t("activePackages")} value={stats.activePackages} icon={Package} tone="yellow" />
            <StatCard label={t("openBids")} value={stats.openBids} icon={Gavel} tone="amber" />
            <StatCard label={t("Completed Orders")} value={stats.pendingOrders} icon={ClipboardList} tone="orange" />
            <StatCard
              label={t("totalRevenue")}
              value={`${t("lkr")} ${(stats.totalRevenue / 1_000_000).toFixed(1)}${t("million")}`}
              icon={TrendingUp}
              tone="gold"
            />
          </motion.div>

          <FeedbackOneByOne />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

/* ---------- KPI Card ---------- */

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "yellow",
}: {
  label: string
  value: string | number
  icon: React.ElementType
  tone?: "yellow" | "amber" | "orange" | "gold"
}) {
  const tones: Record<string, { wrap: string; iconWrap: string; iconColor: string; glow: string }> = {
    yellow: {
      wrap:
        "border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-yellow-500/10",
      iconWrap: "bg-yellow-400/20 border-yellow-500/20",
      iconColor: "text-yellow-800 dark:text-yellow-300",
      glow: "shadow-[0_10px_30px_rgba(250,204,21,0.12)]",
    },
    amber: {
      wrap:
        "border-amber-500/25 bg-gradient-to-br from-amber-500/18 via-background/70 to-yellow-500/10",
      iconWrap: "bg-amber-500/20 border-amber-500/20",
      iconColor: "text-amber-800 dark:text-amber-300",
      glow: "shadow-[0_10px_30px_rgba(245,158,11,0.12)]",
    },
    orange: {
      wrap:
        "border-orange-500/25 bg-gradient-to-br from-orange-500/18 via-background/70 to-amber-500/10",
      iconWrap: "bg-orange-500/20 border-orange-500/20",
      iconColor: "text-orange-800 dark:text-orange-300",
      glow: "shadow-[0_10px_30px_rgba(249,115,22,0.12)]",
    },
    gold: {
      wrap:
        "border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-orange-500/12",
      iconWrap: "bg-gradient-to-br from-yellow-400/25 to-amber-500/20 border-yellow-500/20",
      iconColor: "text-yellow-900 dark:text-yellow-200",
      glow: "shadow-[0_10px_30px_rgba(234,179,8,0.14)]",
    },
  }

  const t = tones[tone]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card className={`group h-full overflow-hidden border ${t.wrap} ${t.glow}`}>
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
              <p className="text-lg sm:text-2xl font-extrabold text-foreground tracking-tight">
                {value}
              </p>
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