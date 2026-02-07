"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  Package as PackageIcon,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

import { VerificationPendingCard } from "@/components/verification-pending-card"
import {
  fetchApplications,
  fetchCurrentUser,
  fetchInstallers,
  type Application,
  type SolarPackage,
} from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

/* ---------- helpers ---------- */

function formatCapacity(value: unknown) {
  const s = String(value ?? "").trim()
  if (!s) return "—"
  if (/\bkw\b/i.test(s)) return s.replace(/\s*kw\b/i, " kW").trim()
  if (/^\d+(\.\d+)?$/.test(s)) return `${s} kW`
  return s
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

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: React.ElementType
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full overflow-hidden border-yellow-500/20 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-yellow-500/20 bg-yellow-400/15 grid place-items-center">
              <Icon className="h-5 w-5 text-yellow-800 dark:text-yellow-300" />
            </div>
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

/* ---------- page ---------- */

export default function InstallerPackages() {
  const { t } = useLanguage()

  const [packages, setPackages] = useState<(SolarPackage & { active?: boolean })[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<"delete" | "toggle" | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  const [orgId, setOrgId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadPackages() {
      try {
        const user = await fetchCurrentUser()
        const installers = await fetchInstallers(false)
        const installer = installers.find((inst) => inst.id === user?.organization?.id)

        if (!active) return

        setOrgId(user?.organization?.id ?? null)
        setIsVerified(Boolean(installer?.verified))

        if (installer) {
          setPackages(
            (installer.packages ?? []).map((pkg) => ({
              ...pkg,
              active: pkg.active ?? true,
            })),
          )
        } else {
          setPackages([])
        }
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : t("unableToLoadPackages"))
      } finally {
        if (!active) return
        setLoading(false)
      }
    }

    loadPackages()
    return () => {
      active = false
    }
  }, [t])

  useEffect(() => {
    let active = true
    async function loadApps() {
      try {
        const apps = await fetchApplications()
        if (!active) return
        setApplications(apps ?? [])
      } catch {
        if (!active) return
        setApplications([])
      }
    }
    loadApps()
    return () => {
      active = false
    }
  }, [])

  const salesByPackageId = useMemo(() => {
    const map = new Map<string, number>()
    const soldStatuses = new Set([
      "installation_in_progress",
      "installation_complete",
      "final_inspection",
      "completed",
    ])

    for (const app of applications) {
      if (!soldStatuses.has(app.status)) continue

      const sel: any = (app as any).selectedInstaller
      if (!sel) continue

      const selOrg = sel.installerOrganizationId ?? sel.organizationId ?? sel.installerId ?? null
      if (orgId && selOrg && selOrg !== orgId) continue

      const pkgId: string | undefined = sel.packageId
      if (!pkgId) continue

      map.set(pkgId, (map.get(pkgId) ?? 0) + 1)
    }

    return map
  }, [applications, orgId])

  const totals = useMemo(() => {
    const total = packages.length
    const active = packages.filter((p) => (p.active ?? true) === true).length
    const inactive = total - active
    const totalSales = Array.from(salesByPackageId.values()).reduce((s, n) => s + n, 0)
    return { total, active, inactive, totalSales }
  }, [packages, salesByPackageId])

  const togglePackageStatus = async (id: string) => {
    const current = packages.find((pkg) => pkg.id === id)
    if (!current) return
    const nextActive = !(current.active ?? true)

    setActionError(null)
    setActionLoadingId(id)
    setActionType("toggle")

    try {
      const res = await fetch(`/api/installers/packages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("unableToUpdatePackage"))

      setPackages((prev) => prev.map((pkg) => (pkg.id === id ? { ...pkg, active: nextActive } : pkg)))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("unableToUpdatePackage"))
    } finally {
      setActionLoadingId(null)
      setActionType(null)
    }
  }

  const deletePackage = async (id: string) => {
    const current = packages.find((pkg) => pkg.id === id)
    if (!current) return

    if (!confirm(`${t("confirmDeletePackage")} "${current.name}"? ${t("confirmDeletePackageWarning")}`)) return

    setActionError(null)
    setActionLoadingId(id)
    setActionType("delete")

    try {
      const res = await fetch(`/api/installers/packages/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("unableToDeletePackage"))

      setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("unableToDeletePackage"))
    } finally {
      setActionLoadingId(null)
      setActionType(null)
    }
  }

  if (!loading && isVerified === false) {
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
          className="space-y-4"
        >
          {/* Hero header (like dashboard) */}
          <Card className="overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-orange-500/12 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                      <PackageIcon className="h-5 w-5 text-yellow-950/80" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                        {t("myPackages")}
                      </h1>
                      <p className="text-xs text-muted-foreground truncate">
                        {t("packagesSubtitle")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className="bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t("verifiedInstaller")}
                    </Badge>

                  

                    
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <Link href="/installer/packages/new">
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                      <Button className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-400 hover:via-amber-500 hover:to-orange-500 text-yellow-950 font-semibold shadow-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("createPackage")}
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* mini stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <MiniStat label="Total packages" value={totals.total} icon={PackageIcon} />
            <MiniStat label="Active" value={totals.active} icon={Eye} />
            <MiniStat label="Inactive" value={totals.inactive} icon={EyeOff} />
            <MiniStat label="Total sales" value={totals.totalSales} icon={TrendingUp} />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
            {actionError && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {actionError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Loading skeletons */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`sk-${i}`}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <Card className="overflow-hidden border-yellow-500/15 bg-gradient-to-br from-yellow-500/8 via-background/70 to-orange-500/8">
                    <CardContent className="p-5 space-y-3">
                      <div className="h-5 w-40 rounded bg-yellow-500/15 animate-pulse" />
                      <div className="h-4 w-28 rounded bg-yellow-500/10 animate-pulse" />
                      <div className="h-10 w-52 rounded bg-yellow-500/10 animate-pulse" />
                      <div className="h-24 w-full rounded-xl bg-yellow-500/10 animate-pulse" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

            {/* Empty state */}
            {!loading && packages.length === 0 && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="md:col-span-2 lg:col-span-3"
              >
                <Card className="border-dashed border-yellow-500/30 bg-yellow-500/5">
                  <CardContent className="py-14 text-center">
                    <p className="text-sm text-muted-foreground">{t("noPackagesYet")}</p>
                    <div className="mt-4">
                      <Link href="/installer/packages/new">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          {t("createPackage")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Package cards */}
            {!loading &&
              packages.map((pkg) => {
                const isActive = pkg.active ?? true
                const isBusy = actionLoadingId === pkg.id
                const sales = salesByPackageId.get(pkg.id) ?? 0

                return (
                  <motion.div
                    key={pkg.id}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <Card
                      className={[
                        "h-full overflow-hidden border shadow-sm",
                        "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/65 to-orange-500/10",
                        !isActive ? "opacity-70" : "",
                      ].join(" ")}
                    >
                      <CardHeader className="flex flex-row items-start justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg text-foreground truncate">
                              {pkg.name}
                            </CardTitle>
                            {!isActive && (
                              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                {t("inactive")}
                              </Badge>
                            )}
                          </div>

                          <CardDescription className="mt-1">
                            {formatCapacity(pkg.capacity)} {t("system")}
                          </CardDescription>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-yellow-500/10"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="min-w-[180px]">
                            <DropdownMenuItem asChild>
                              <Link href={`/installer/packages/${pkg.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                {t("editPackage")}
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => togglePackageStatus(pkg.id)}
                              disabled={isBusy}
                            >
                              {isActive ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  {actionType === "toggle" && isBusy ? "Updating..." : t("deactivate")}
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {actionType === "toggle" && isBusy ? "Updating..." : t("activate")}
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deletePackage(pkg.id)}
                              disabled={isBusy}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {actionType === "delete" && isBusy ? t("deleting") : t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-amber-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-2xl font-extrabold text-foreground tracking-tight">
                              {t("lkr")} {(pkg.price ?? 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {sales} {t("sales")}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">{t("panels")}</span>
                            <span className="text-foreground truncate">
                              {(pkg.panelCount ?? 0)}x {pkg.panelType}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">{t("inverter")}</span>
                            <span className="text-foreground truncate">{pkg.inverterBrand ?? "-"}</span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">{t("warranty")}</span>
                            <span className="text-foreground truncate">{pkg.warranty ?? "-"}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border">
                          <p className="text-sm font-medium text-foreground mb-2">{t("included")}:</p>
                          <div className="flex flex-wrap gap-1">
                            {(pkg.features ?? []).map((feature, index) => (
                              <Badge
                                key={`${pkg.id}-${index}`}
                                variant="secondary"
                                className="text-xs bg-muted/70"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {(pkg.features ?? []).length === 0 && (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </div>
                        </div>

                        {/* tiny decorative bar (dashboard vibe) */}
                        <div className="mt-1 h-1.5 w-full rounded-full bg-yellow-950/10 dark:bg-yellow-50/10 overflow-hidden">
                          <motion.div
                            className="h-1.5 w-1/3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                            initial={{ x: "-70%" }}
                            animate={{ x: ["-70%", "140%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}

            {/* Add Package card */}
            {!loading && (
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Card className="border-dashed border-yellow-500/30 bg-yellow-500/5 flex items-center justify-center min-h-[320px]">
                  <Link href="/installer/packages/new" className="text-center p-6 w-full">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-yellow-700 dark:text-yellow-300" />
                    </div>
                    <p className="font-semibold text-foreground">{t("createPackage")}</p>
                    <p className="text-sm text-muted-foreground">{t("addNewPackage")}</p>
                  </Link>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}