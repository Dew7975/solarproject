"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  ArrowLeft,
  MapPin,
  Zap,
  Calendar,
  Clock,
  Send,
  Package,
  Loader2,
  AlertCircle,
  XCircle,
  Sparkles,
  Wallet,
  ShieldCheck,
} from "lucide-react"

import {
  fetchCurrentUser,
  fetchInstallers,
  type BidSession,
  type SolarPackage,
  type User,
} from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

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

function ErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300 shadow-sm"
    >
      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-500 to-rose-600" />
      <div className="flex gap-3 p-4">
        <div className="mt-0.5 rounded-2xl bg-background/60 p-2 ring-1 ring-red-500/20">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-red-800 dark:text-red-200">Action required</p>
          <p className="mt-1 text-sm whitespace-pre-line break-words">{message}</p>
        </div>
      </div>
    </div>
  )
}

// helper to extract kW number from strings like: "3", "3 kW", "5kW", "20+"
function parseKw(value: unknown): number | null {
  if (value == null) return null
  const str = String(value)
  const match = str.match(/(\d+(\.\d+)?)/)
  if (!match) return null
  const n = Number(match[1])
  return Number.isFinite(n) ? n : null
}

export default function SubmitBidPage() {
  const { t } = useLanguage()
  const params = useParams<{ id?: string | string[] }>()
  const router = useRouter()

  const bidId = useMemo(() => {
    const raw = params?.id
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<(BidSession & any) | null>(null)

  const [selectedPackage, setSelectedPackage] = useState("")
  const [customPrice, setCustomPrice] = useState("")
  const [timeline, setTimeline] = useState("14")
  const [notes, setNotes] = useState("")

  const [loading, setLoading] = useState(true)
  const [installerPackages, setInstallerPackages] = useState<SolarPackage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Load current user
  useEffect(() => {
    let active = true
    fetchCurrentUser()
      .then((current) => {
        if (active) setUser(current)
      })
      .catch(() => {
        if (active) setUser(null)
      })
    return () => {
      active = false
    }
  }, [])

  // Load bid session
  useEffect(() => {
    let active = true

    async function fetchSession() {
      setError(null)

      if (!bidId) {
        setError(t("unableToLoadBidRequest"))
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/bids/${bidId}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || t("unableToLoadBidRequest"))

        // handle shapes: direct OR {bidSession} OR {session}
        const payload = data?.bidSession ?? data?.session ?? data

        if (!active) return
        setSession(payload)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : t("unexpectedError"))
        setSession(null)
      } finally {
        if (!active) return
        setLoading(false)
      }
    }

    fetchSession()
    return () => {
      active = false
    }
  }, [bidId, t])

  // Load installer packages
  useEffect(() => {
    let active = true

    async function loadPackages() {
      if (!user?.organization?.id) return
      try {
        const installers = await fetchInstallers(false)
        const installer = installers.find((inst) => inst.id === user.organization?.id)
        if (!active) return
        setInstallerPackages(installer?.packages ?? [])
      } catch {
        if (!active) return
        setInstallerPackages([])
      }
    }

    loadPackages()
    return () => {
      active = false
    }
  }, [user])

  // Desired kW from the bid session
  const desiredKW = useMemo(() => {
    return parseKw(session?.applicationDetails?.capacity)
  }, [session])

  // Only show packages matching desiredKW (if available)
  const packagesToShow = useMemo(() => {
    if (!desiredKW) return installerPackages
    return installerPackages.filter((pkg) => parseKw(pkg.capacity) === desiredKW)
  }, [installerPackages, desiredKW])

  // If user had selected a package but it no longer matches desiredKW, clear it
  useEffect(() => {
    if (!selectedPackage) return
    const stillExists = packagesToShow.some((p) => p.id === selectedPackage)
    if (!stillExists) {
      setSelectedPackage("")
      setCustomPrice("")
      setNotes("")
    }
  }, [packagesToShow, selectedPackage])

  const selectedPkg = useMemo(
    () => installerPackages.find((p) => p.id === selectedPackage),
    [installerPackages, selectedPackage],
  )

  const handleSubmitBid = async () => {
    if (user && user.verified === false) {
      setError(t("accountPendingVerification"))
      return
    }

    if (!session || !selectedPkg) {
      setError(t("pleaseSelectPackageOrPrice"))
      return
    }

    if (!customPrice || !timeline || !notes.trim()) {
      setError(t("pleaseCompleteBidDetails"))
      return
    }

    const proposedPrice = Number(customPrice || selectedPkg?.price || 0)
    if (Number.isNaN(proposedPrice) || proposedPrice <= 0) {
      setError(t("pleaseSelectPackageOrPrice"))
      return
    }

    if (session?.maxBudget && proposedPrice > session.maxBudget) {
      setError(t("bidExceedsBudget").replace("{amount}", session.maxBudget.toLocaleString()))
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/bids/${session.id}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installerId: user?.organization?.id ?? user?.id ?? "INS-001",
          installerName: user?.name ?? "Installer",
          price: proposedPrice,
          proposal: selectedPkg?.name ?? t("customBid"),
          warranty: selectedPkg?.warranty ?? t("standardWarranty"),
          estimatedDays: Number(timeline),
          packageId: selectedPkg?.id,
          packageName: selectedPkg?.name,
          contact: { email: user?.email, phone: (user as any)?.phone ?? t("notAvailable") },
          message: notes,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("unableToSubmitBid"))

      router.push("/installer/bids")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unexpectedError"))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("loadingBidRequest")}
        </div>
      </DashboardLayout>
    )
  }

  // Only block page if session is missing
  if (!session) {
    return (
      <DashboardLayout>
        <div className="space-y-3 p-6">
          <Link href="/installer/bids">
            <Button variant="ghost" size="sm" className="bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("backToBids")}
            </Button>
          </Link>

          <ErrorNotice message={error || t("bidRequestNotFound")} />
        </div>
      </DashboardLayout>
    )
  }

  const expiresLabel = session?.expiresAt
    ? new Date(session.expiresAt).toLocaleDateString()
    : t("notAvailable")

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
          {/* Compact hero */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <Link href="/installer/bids">
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
                          {t("submitBid")}
                        </h1>
                        <p className="text-xs text-muted-foreground truncate">
                          {t("bidRequest")} {session.id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          session.status === "open"
                            ? "bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25"
                            : "bg-muted text-foreground"
                        }
                        variant="secondary"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {t("expires")} {expiresLabel}
                      </Badge>

                      {desiredKW ? (
                        <Badge className="bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/25">
                          <Zap className="w-3 h-3 mr-1" />
                          {desiredKW} kW
                        </Badge>
                      ) : null}

                      {session.maxBudget ? (
                        <Badge className="bg-orange-500/10 text-orange-900 dark:text-orange-200 border border-orange-500/20">
                          <Wallet className="w-3 h-3 mr-1" />
                          LKR {session.maxBudget.toLocaleString()}
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500/10 text-orange-900 dark:text-orange-200 border border-orange-500/20">
                          <Wallet className="w-3 h-3 mr-1" />
                          {t("noLimitSet")}
                        </Badge>
                      )}

                      {user?.verified === false ? (
                        <Badge className="bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {t("accountPendingVerification")}
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
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
                    className="mt-3"
                  >
                    <ErrorNotice message={error} />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Two-column dense layout on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* LEFT: Project + Packages */}
            <div className="lg:col-span-3 space-y-3">
              {/* Project Details */}
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="text-foreground">{t("projectDetails")}</CardTitle>
                  <CardDescription>{t("projectDetailsDescription")}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
                          <MapPin className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{t("location")}</p>
                          <p className="font-semibold text-foreground break-words">
                            {session.applicationDetails?.address ?? t("addressNotAvailable")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl grid place-items-center bg-amber-500/20 border border-amber-500/20">
                          <Zap className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{t("desiredCapacity")}</p>
                          <p className="font-semibold text-foreground">
                            {session.applicationDetails?.capacity ?? t("notAvailable")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3 sm:col-span-2">
                      <p className="text-xs text-muted-foreground">{t("requirements")}</p>
                      <p className="font-semibold text-foreground">
                        {session.requirements ?? t("noExtraRequirements")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Select Package */}
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="text-foreground">{t("selectPackage")}</CardTitle>
                  <CardDescription>
                    {t("selectPackageDescription")}
                    {desiredKW ? ` (${desiredKW} kW)` : ""}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {installerPackages.length === 0 ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      {t("noPackagesAvailable")}
                    </div>
                  ) : desiredKW && packagesToShow.length === 0 ? (
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
                      No packages match the desired capacity ({desiredKW} kW). Please create a {desiredKW} kW package.
                    </div>
                  ) : null}

                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {packagesToShow.map((pkg) => {
                      const selected = selectedPackage === pkg.id
                      return (
                        <motion.button
                          key={pkg.id}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            show: { opacity: 1, y: 0 },
                          }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          type="button"
                          onClick={() => {
                            setSelectedPackage(pkg.id)
                            setCustomPrice(String(pkg.price ?? ""))
                            setNotes(
                              pkg.features?.length
                                ? `${t("packageFeatures")}: ${pkg.features.join(", ")}`
                                : "",
                            )
                          }}
                          className={[
                            "text-left rounded-3xl border p-3 transition",
                            "bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30",
                            selected
                              ? "border-yellow-500/40 ring-2 ring-yellow-400/30"
                              : "border-yellow-500/20 hover:border-yellow-500/35",
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className={[
                                  "h-10 w-10 rounded-2xl grid place-items-center border shrink-0",
                                  selected
                                    ? "bg-gradient-to-br from-yellow-400/30 to-amber-500/20 border-yellow-500/25"
                                    : "bg-yellow-400/15 border-yellow-500/20",
                                ].join(" ")}
                              >
                                <Package className="w-5 h-5 text-yellow-800 dark:text-yellow-300" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{pkg.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {pkg.capacity} • {pkg.panelType} {t("panels")}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-1 truncate">
                                  {pkg.warranty}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="font-extrabold text-yellow-900 dark:text-yellow-200">
                                LKR {(pkg.price ?? 0).toLocaleString()}
                              </p>
                              {selected ? (
                                <Badge className="mt-1 bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                                  Selected
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="mt-1 border-yellow-500/25 bg-yellow-500/5"
                                >
                                  Choose
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Bid details + Actions */}
            <div className="lg:col-span-2 space-y-3">
              {/* Bid Details */}
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                <CardHeader className="py-4">
                  <CardTitle className="text-foreground">{t("bidDetails")}</CardTitle>
                  <CardDescription>{t("bidDetailsDescription")}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">{t("price")} (LKR)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      required={Boolean(selectedPackage)}
                      className="rounded-2xl border-yellow-500/25 bg-background/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t("installationTimeline")} ({t("days")})
                    </Label>
                    <select
                      id="timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-yellow-500/25 bg-background/60 text-foreground"
                      required={Boolean(selectedPackage)}
                    >
                      <option value="7">{t("days7")}</option>
                      <option value="10">{t("days10")}</option>
                      <option value="14">{t("days14")}</option>
                      <option value="21">{t("days21")}</option>
                      <option value="30">{t("days30")}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("additionalNotes")}</Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-28 p-3 rounded-2xl border border-yellow-500/25 bg-background/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                      placeholder={t("additionalNotesPlaceholder")}
                      required={Boolean(selectedPackage)}
                    />
                  </div>

                  {session?.maxBudget ? (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{t("maximumBudget")}:</span>{" "}
                      LKR {session.maxBudget.toLocaleString()}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/installer/bids" className="block">
                      <Button
                        variant="outline"
                        className="w-full rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                      >
                        {t("cancel")}
                      </Button>
                    </Link>

                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        onClick={handleSubmitBid}
                        disabled={
                          !selectedPackage ||
                          submitting ||
                          session.status !== "open" ||
                          user?.verified === false
                        }
                        className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold shadow-sm disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t("submitting")}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t("submitBidButton")}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Tip: select a package first, then confirm price, timeline and notes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}