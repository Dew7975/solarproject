"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  ClipboardList,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  AlertTriangle,
  Wallet,
} from "lucide-react"

import { VerificationPendingCard } from "@/components/verification-pending-card"
import { fetchApplications, fetchCurrentUser, fetchInstallers, type Application } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

type OrderStatus = "installation_pending" | "in_progress" | "completed"

type Order = {
  id: string
  applicationId: string
  customerName: string
  email?: string
  phone?: string
  location: string
  packageName: string
  capacity: string
  amount: number
  status: OrderStatus
  paymentStatus: "pending" | "paid" | "overdue"
  updatedAt: string
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

function StatusBadge({
  status,
  t,
}: {
  status: OrderStatus
  t: (k: string) => string
}) {
  switch (status) {
    case "installation_pending":
      return (
        <Badge className="bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
          <Clock className="w-3 h-3 mr-1" />
          {t("installer_orders_status_pending_start")}
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/25">
          <Clock className="w-3 h-3 mr-1" />
          {t("installer_orders_status_in_progress")}
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("installer_orders_status_completed")}
        </Badge>
      )
  }
}

export default function InstallerOrders() {
  const { t } = useLanguage()

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
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
        setError(err instanceof Error ? err.message : t("installer_orders_error_load_status"))
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
    let active = true
    async function loadOrders() {
      if (checkingStatus || isVerified === false) {
        if (active) setLoading(false)
        return
      }
      try {
        const apps = await fetchApplications()
        const mapped = apps
          .filter((app) => app.selectedInstaller)
          .map<Order>((app) => {
            const statusMap: Record<string, OrderStatus> = {
              pending: "installation_pending",
              under_review: "installation_pending",
              pre_visit_approved: "installation_pending",
              site_visit_scheduled: "installation_pending",
              approved: "installation_pending",
              site_visit_payment_completed: "installation_pending",
              rejected: "installation_pending",
              payment_pending: "installation_pending",
              payment_confirmed: "installation_pending",
              finding_installer: "installation_pending",
              agreement_pending: "installation_pending",
              installation_in_progress: "in_progress",
              installation_complete: "completed",
              final_inspection: "completed",
              completed: "completed",
            }

            const installationInvoice = app.invoices?.find((inv) => inv.type === "installation")
            const amount = app.selectedInstaller?.price ?? installationInvoice?.amount ?? 0

            return {
              id: `ORD-${app.id}`,
              applicationId: app.id,
              customerName: app.customerName,
              email: app.email,
              phone: app.phone,
              location:
                (app.technicalDetails as any)?.siteAddress ||
                (app.technicalDetails as any)?.address ||
                app.address ||
                t("installer_orders_address_not_provided"),
              packageName: app.selectedInstaller?.packageName || t("installer_orders_selected_package"),
              capacity: app.technicalDetails?.desiredCapacity
                ? `${app.technicalDetails.desiredCapacity} kW`
                : t("installer_orders_capacity_tbd"),
              amount,
              status: statusMap[app.status] || "installation_pending",
              paymentStatus: (installationInvoice?.status as any) ?? "pending",
              updatedAt: app.updatedAt,
            }
          })

        if (active) setOrders(mapped)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : t("installer_orders_error_load_orders"))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOrders()
    return () => {
      active = false
    }
  }, [checkingStatus, isVerified, t])

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "pending") return order.status === "installation_pending"
          if (activeTab === "in_progress") return order.status === "in_progress"
          if (activeTab === "completed") return order.status === "completed"
          return true
        })

  const stats = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === "installation_pending").length,
      inProgress: orders.filter((o) => o.status === "in_progress").length,
      completed: orders.filter((o) => o.status === "completed").length,
      totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
    }
  }, [orders])

  const updateOrderStatus = async (order: Order, status: Application["status"]) => {
    try {
      const res = await fetch(`/api/applications/${order.applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("installer_orders_error_update_order"))

      const updatedStatus: Record<string, OrderStatus> = {
        pending: "installation_pending",
        under_review: "installation_pending",
        pre_visit_approved: "installation_pending",
        site_visit_scheduled: "installation_pending",
        approved: "installation_pending",
        site_visit_payment_completed: "installation_pending",
        rejected: "installation_pending",
        payment_pending: "installation_pending",
        payment_confirmed: "installation_pending",
        finding_installer: "installation_pending",
        agreement_pending: "installation_pending",
        installation_in_progress: "in_progress",
        installation_complete: "completed",
        final_inspection: "completed",
        completed: "completed",
      }

      setOrders((prev) =>
        prev.map((item) =>
          item.applicationId === order.applicationId
            ? {
                ...item,
                status: updatedStatus[data.application?.status ?? status] || item.status,
                updatedAt: data.application?.updatedAt ?? item.updatedAt,
              }
            : item,
        ),
      )

      setSelectedOrder((prev) =>
        prev && prev.applicationId === order.applicationId
          ? {
              ...prev,
              status: updatedStatus[data.application?.status ?? status] || prev.status,
              updatedAt: data.application?.updatedAt ?? prev.updatedAt,
            }
          : prev,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("installer_orders_error_update_order"))
    }
  }

  if (checkingStatus) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          {t("installer_orders_loading")}
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
          {/* Hero header */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                      <Sparkles className="h-5 w-5 text-yellow-950/80" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground truncate">
                        {t("installer_orders_title")}
                      </h1>
                      <p className="text-xs text-muted-foreground truncate">
                        {t("installer_orders_subtitle")}
                      </p>
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
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <span className="min-w-0">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                
              </div>
            </CardContent>
          </Card>

          {/* Stats (dense + animated) */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
          >
            <StatCard
              label={t("installer_orders_stat_pending")}
              value={stats.pending}
              icon={Clock}
              tone="yellow"
            />
            <StatCard
              label={t("installer_orders_stat_in_progress")}
              value={stats.inProgress}
              icon={ClipboardList}
              tone="amber"
            />
            <StatCard
              label={t("installer_orders_stat_completed")}
              value={stats.completed}
              icon={CheckCircle}
              tone="emerald"
            />
            <StatCard
              label={t("installer_orders_stat_total_value")}
              value={`${t("installer_orders_rs")} ${stats.totalValue.toLocaleString()}`}
              icon={Wallet}
              tone="gold"
            />
          </motion.div>

          {/* Orders List */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-2xl border border-yellow-500/20 bg-background/50">
              <TabsTrigger value="all" className="rounded-xl">
                {t("installer_orders_tab_all")}
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl">
                {t("installer_orders_tab_pending")}
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="rounded-xl">
                {t("installer_orders_tab_in_progress")}
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl">
                {t("installer_orders_tab_completed")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-3">
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="text-foreground">
                    {t("installer_orders_list_title")} ({filteredOrders.length})
                  </CardTitle>
                  <CardDescription>{t("installer_orders_list_desc")}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-4 w-72 rounded bg-yellow-500/10 animate-pulse" />
                      <div className="h-20 w-full rounded-2xl bg-yellow-500/10 animate-pulse" />
                      <div className="h-20 w-full rounded-2xl bg-yellow-500/10 animate-pulse" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-destructive">{error}</div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-10">
                      <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">{t("installer_orders_no_orders_category")}</p>
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
                      {filteredOrders.map((order) => (
                        <Dialog key={order.id}>
                          <DialogTrigger asChild>
                            <motion.div
                              variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0 },
                              }}
                              whileHover={{ y: -2 }}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl border border-yellow-500/20 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30 hover:border-yellow-500/35 cursor-pointer transition"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <div className="mb-3 sm:mb-0 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-foreground truncate">
                                    {order.customerName}
                                  </p>
                                  <StatusBadge status={order.status} t={t} />
                                </div>

                                <p className="text-sm text-muted-foreground truncate">
                                  {order.packageName} • {order.capacity}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 min-w-0">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{order.location}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4">
                                <div className="text-right">
                                  <p className="font-extrabold text-foreground">
                                    {t("installer_orders_rs")} {order.amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {t("installer_orders_updated_prefix")}{" "}
                                    {new Date(order.updatedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </DialogTrigger>

                          <DialogContent className="max-w-md rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background to-orange-500/10">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">
                                {t("installer_orders_dialog_title")}
                              </DialogTitle>
                              <DialogDescription>{order.id}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                              <div className="p-4 rounded-3xl bg-background/40 border border-yellow-500/20 space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{order.customerName}</span>
                                  <StatusBadge status={order.status} t={t} />
                                </div>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {order.email ?? t("installer_orders_email_not_available")}
                                  </div>

                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {order.phone ?? t("installer_orders_phone_not_available")}
                                  </div>

                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    {order.location}
                                  </div>

                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {t("installer_orders_updated_prefix")}{" "}
                                    {new Date(order.updatedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between p-3 rounded-2xl border border-yellow-500/20 bg-background/40 text-sm">
                                <span className="text-muted-foreground">{t("installer_orders_package_label")}</span>
                                <span className="font-semibold text-foreground">
                                  {order.packageName} ({order.capacity})
                                </span>
                              </div>

                              <div className="flex justify-between p-3 rounded-2xl border border-yellow-500/20 bg-background/40 text-sm">
                                <span className="text-muted-foreground">{t("installer_orders_amount_label")}</span>
                                <span className="font-extrabold text-foreground">
                                  {t("installer_orders_rs")} {order.amount.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <DialogFooter className="gap-2">
                              {order.status === "installation_pending" && (
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} className="w-full">
                                  <Button
                                    className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold"
                                    onClick={() => updateOrderStatus(order, "installation_in_progress")}
                                  >
                                    {t("installer_orders_start_installation")}
                                  </Button>
                                </motion.div>
                              )}

                              {order.status === "in_progress" && (
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} className="w-full">
                                  <Button
                                    className="w-full rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
                                    onClick={() => updateOrderStatus(order, "installation_complete")}
                                  >
                                    {t("installer_orders_mark_complete")}
                                  </Button>
                                </motion.div>
                              )}

                              {order.status === "completed" && (
                                <Button
                                  variant="outline"
                                  className="w-full rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                                  asChild
                                >
                                  <a href={`/api/orders/${order.applicationId}/report`} download>
                                    {t("installer_orders_download_report")}
                                  </a>
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
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
  tone: "yellow" | "amber" | "emerald" | "gold"
}) {
  const tones: Record<string, { wrap: string; iconWrap: string; iconColor: string }> = {
    yellow: {
      wrap:
        "border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-yellow-500/10",
      iconWrap: "bg-yellow-400/20 border-yellow-500/20",
      iconColor: "text-yellow-800 dark:text-yellow-300",
    },
    amber: {
      wrap: "border-amber-500/25 bg-gradient-to-br from-amber-500/18 via-background/70 to-yellow-500/10",
      iconWrap: "bg-amber-500/20 border-amber-500/20",
      iconColor: "text-amber-800 dark:text-amber-300",
    },
    emerald: {
      wrap:
        "border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 via-background/70 to-emerald-500/10",
      iconWrap: "bg-emerald-500/15 border-emerald-500/20",
      iconColor: "text-emerald-700 dark:text-emerald-300",
    },
    gold: {
      wrap:
        "border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-orange-500/12",
      iconWrap: "bg-gradient-to-br from-yellow-400/25 to-amber-500/20 border-yellow-500/20",
      iconColor: "text-yellow-900 dark:text-yellow-200",
    },
  }

  const t = tones[tone]

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card className={`group h-full overflow-hidden rounded-3xl border ${t.wrap} shadow-sm`}>
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