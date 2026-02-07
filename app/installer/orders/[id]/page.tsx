"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  Mail,
  AlertTriangle,
  Sparkles,
  Wallet,
  ShieldCheck,
} from "lucide-react"

import { fetchApplications, type Application } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

type OrderStatus = "installation_pending" | "in_progress" | "completed"

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

function StatusBadge({ status, t }: { status: OrderStatus; t: (k: string) => string }) {
  switch (status) {
    case "installation_pending":
      return (
        <Badge className="bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
          <Clock className="w-3 h-3 mr-1" />
          {t("installer_order_status_pending_start")}
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/25">
          <Clock className="w-3 h-3 mr-1" />
          {t("installer_order_status_in_progress")}
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("installer_order_status_completed")}
        </Badge>
      )
  }
}

export default function InstallerOrderDetail() {
  const { t } = useLanguage()
  const params = useParams<{ id: string }>()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    let active = true
    async function loadOrder() {
      try {
        const apps = await fetchApplications()
        const match = apps.find(
          (app) => app.id === params.id || app.reference === params.id || app.bidId === params.id,
        )
        if (!match) throw new Error(t("installer_order_error_not_found"))
        if (active) setApplication(match)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : t("installer_order_error_load"))
      } finally {
        if (active) setLoading(false)
      }
    }
    loadOrder()
    return () => {
      active = false
    }
  }, [params.id, t])

  const orderStatus: OrderStatus | null = useMemo(() => {
    if (!application) return null
    if (application.status === "installation_in_progress") return "in_progress"
    if (["installation_complete", "final_inspection", "completed"].includes(application.status)) {
      return "completed"
    }
    return "installation_pending"
  }, [application])

  const installationInvoice = useMemo(() => {
    return application?.invoices?.find((inv) => inv.type === "installation")
  }, [application])

  const updateStatus = async (status: Application["status"]) => {
    if (!application) return
    setActionLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("installer_order_error_update"))
      setApplication(data.application)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("installer_order_error_update"))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-muted-foreground">{t("installer_order_loading")}</div>
      </DashboardLayout>
    )
  }

  if (error || !application || !orderStatus) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-3">
          <Link href="/installer/orders">
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("installer_order_back_to_orders")}
            </Button>
          </Link>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span className="min-w-0 break-words">{error || t("installer_order_error_not_found")}</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const amount = application.selectedInstaller?.price ?? installationInvoice?.amount ?? 0
  const location =
    (application.technicalDetails as any)?.siteAddress ||
    (application.technicalDetails as any)?.address ||
    application.address ||
    t("installer_order_address_not_provided")

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_55%)]" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl p-4 sm:p-6 space-y-3"
        >
          {/* Hero */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Link href="/installer/orders">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </Link>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                        <Sparkles className="h-5 w-5 text-yellow-950/80" />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                          {t("installer_order_title")} {application.id}
                        </h1>
                        <p className="text-xs text-muted-foreground truncate">
                          {application.customerName} •{" "}
                          {application.selectedInstaller?.packageName ??
                            t("installer_order_selected_package_fallback")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={orderStatus} t={t} />
                      <Badge className="bg-orange-500/10 text-orange-900 dark:text-orange-200 border border-orange-500/20">
                        <Wallet className="w-3 h-3 mr-1" />
                        {t("installer_order_rs")} {amount.toLocaleString()}
                      </Badge>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="h-4 h-4 mt-0.5" />
                    <span className="min-w-0">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Overview */}
            <Card className="lg:col-span-3 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="text-foreground">{t("installer_order_overview_title")}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <InfoBox
                    icon={MapPin}
                    label={t("location")}
                    value={location}
                    tone="yellow"
                  />
                  <InfoBox
                    icon={Package}
                    label={t("installer_order_package_selected_fallback")}
                    value={
                      application.selectedInstaller?.packageName ??
                      t("installer_order_package_selected_fallback")
                    }
                    extra={
                      application.technicalDetails?.desiredCapacity
                        ? `${application.technicalDetails.desiredCapacity} kW`
                        : undefined
                    }
                    tone="amber"
                  />
                  <InfoBox
                    icon={Phone}
                    label={t("installer_order_phone_not_available")}
                    value={application.phone ?? t("installer_order_phone_not_available")}
                    tone="orange"
                  />
                  <InfoBox
                    icon={Mail}
                    label={t("installer_order_email_not_available")}
                    value={application.email ?? t("installer_order_email_not_available")}
                    tone="orange"
                  />
                  <div className="sm:col-span-2 rounded-3xl border border-yellow-500/20 bg-background/40 p-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
                        <Calendar className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t("installer_order_updated")}</p>
                        <p className="font-semibold text-foreground">
                          {new Date(application.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm">
                  <p className="text-muted-foreground">{t("installer_order_status_label")}</p>
                  <div className="mt-1">{StatusBadge({ status: orderStatus, t })}</div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="lg:col-span-2 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="text-foreground">{t("installer_order_payment_title")}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0 space-y-2 text-sm">
                <Row label={t("installer_order_invoice_status")} value={installationInvoice?.status ?? t("installer_order_not_generated")} />
                <Row
                  label={t("installer_order_invoice_amount")}
                  value={`${t("installer_order_rs")} ${(installationInvoice?.amount ?? amount).toLocaleString()}`}
                />
                {installationInvoice?.dueDate ? (
                  <Row
                    label={t("installer_order_due_date")}
                    value={new Date(installationInvoice.dueDate).toLocaleDateString()}
                  />
                ) : null}

                <div className="pt-2">
                  <div className="flex flex-col gap-2">
                    {orderStatus === "installation_pending" && (
                      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold"
                          onClick={() => updateStatus("installation_in_progress")}
                          disabled={actionLoading}
                        >
                          {actionLoading ? t("installer_order_updating") : t("installer_order_start_installation")}
                        </Button>
                      </motion.div>
                    )}

                    {orderStatus === "in_progress" && (
                      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={() => updateStatus("installation_complete")}
                          disabled={actionLoading}
                        >
                          {actionLoading
                            ? t("installer_order_updating")
                            : t("installer_order_mark_installation_complete")}
                        </Button>
                      </motion.div>
                    )}

                    {orderStatus === "completed" && (
                      <Button
                        variant="outline"
                        className="w-full rounded-2xl border-yellow-500/25 bg-background/50"
                        disabled
                      >
                        {t("installer_order_installation_completed")}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right break-words">{value}</span>
    </div>
  )
}

function InfoBox({
  icon: Icon,
  label,
  value,
  extra,
  tone = "yellow",
}: {
  icon: React.ElementType
  label: string
  value: string
  extra?: string
  tone?: "yellow" | "amber" | "orange"
}) {
  const toneClasses =
    tone === "amber"
      ? "bg-amber-500/20 border-amber-500/20 text-amber-700 dark:text-amber-300"
      : tone === "orange"
        ? "bg-orange-500/15 border-orange-500/20 text-orange-800 dark:text-orange-300"
        : "bg-yellow-400/20 border-yellow-500/20 text-yellow-700 dark:text-yellow-300"

  return (
    <div className="rounded-3xl border border-yellow-500/20 bg-background/40 p-3">
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-2xl border grid place-items-center ${toneClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-semibold text-foreground break-words">{value}</p>
          {extra ? <p className="text-xs text-muted-foreground mt-1">{extra}</p> : null}
        </div>
      </div>
    </div>
  )
}