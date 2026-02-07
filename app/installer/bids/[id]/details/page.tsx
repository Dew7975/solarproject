"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  ArrowLeft,
  MapPin,
  Zap,
  Clock,
  Package,
  Mail,
  Phone,
  Receipt,
  CalendarDays,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Gavel,
} from "lucide-react"

import { fetchCurrentUser, type User } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

type BidItem = {
  installerId?: string
  installerName?: string
  contact?: { email?: string; phone?: string }
  price?: number
  proposal?: string
  packageName?: string
  estimatedDays?: number
  message?: string
  createdAt?: string
  warranty?: string
}

type BidSessionResponse = {
  id: string
  status?: string
  bidType?: string
  requirements?: string | null
  maxBudget?: number | null
  expiresAt?: string | Date | null
  bids?: BidItem[]
  applicationDetails?: {
    address?: string | null
    capacity?: string | null
    selectedPackageName?: string | null
    selectedPackagePrice?: number | null
    customerPhone?: string | null
    customerEmail?: string | null
  }
}

function formatMoneyLKR(n: number) {
  return `LKR ${n.toLocaleString()}`
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

function ErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2"
    >
      <AlertTriangle className="h-4 w-4 mt-0.5" />
      <span className="min-w-0 break-words">{message}</span>
    </div>
  )
}

export default function BidDetailsPage() {
  const { t } = useLanguage()
  const params = useParams<{ id?: string | string[] }>()
  const bidId = useMemo(() => (Array.isArray(params.id) ? params.id[0] : params.id), [params])

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<BidSessionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchCurrentUser()
      .then((u) => active && setUser(u))
      .catch(() => active && setUser(null))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function load() {
      if (!bidId) {
        setError("Bid id is required")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/bids/${bidId}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || "Unable to load bid details")

        if (!active) return
        setSession(data)
      } catch (e) {
        if (!active) return
        setError(e instanceof Error ? e.message : "Unable to load bid details")
        setSession(null)
      } finally {
        if (!active) return
        setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [bidId])

  const bids = session?.bids ?? []

  const myBid = useMemo(() => {
    if (!user) return null

    const orgId = user.organization?.id
    const userId = user.id
    const email = user.email?.toLowerCase()
    const name = user.name?.toLowerCase()

    return (
      bids.find((b) => b.installerId && (b.installerId === orgId || b.installerId === userId)) ||
      bids.find((b) => (b.contact?.email ?? "").toLowerCase() === email) ||
      bids.find((b) => (b.installerName ?? "").toLowerCase() === name) ||
      null
    )
  }, [bids, user])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-muted-foreground">{t("loadingGeneric") ?? "Loading..."}</div>
      </DashboardLayout>
    )
  }

  if (error || !session) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-3">
          <Link href="/installer/bids">
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("backToBids") ?? "Back to bids"}
            </Button>
          </Link>
          <ErrorNotice message={error ?? "Unable to load"} />
        </div>
      </DashboardLayout>
    )
  }

  const expiresLabel = session.expiresAt
    ? new Date(session.expiresAt).toLocaleDateString()
    : (t("notAvailable") ?? "N/A")

  const statusLabel = session.status ?? "open"

  const statusBadgeClass =
    statusLabel === "open"
      ? "bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25"
      : "bg-muted text-foreground"

  const offerTitle = myBid?.packageName ?? myBid?.proposal ?? (t("notAvailable") ?? "N/A")

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
          {/* Hero header */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />

            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
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
                          {t("bidDetails") ?? "Bid Details"}
                        </h1>
                        <p className="text-xs text-muted-foreground truncate">
                          {t("bidRequest") ?? "Bid Request"}: {session.id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={`border ${statusBadgeClass}`}>
                        <Gavel className="w-3 h-3 mr-1" />
                        {statusLabel.toString().toUpperCase()}
                      </Badge>

                      <Badge
                        variant="secondary"
                        className="border border-yellow-500/25 bg-amber-500/15 text-amber-900 dark:text-amber-200"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {t("expires") ?? "Expires"} {expiresLabel}
                      </Badge>

                      {user ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          {t("signedIn") ?? "Signed in"}: {user.name}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* LEFT: Project */}
            <Card className="lg:col-span-3 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
              <CardHeader className="py-4">
                <CardTitle>{t("projectDetails") ?? "Project Details"}</CardTitle>
                <CardDescription>
                  {t("projectDetailsDescription") ?? "Customer requirements for this installation"}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
                        <MapPin className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t("location") ?? "Location"}</p>
                        <p className="font-semibold text-foreground break-words">
                          {session.applicationDetails?.address ??
                            (t("addressNotAvailable") ?? "Not available")}
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
                        <p className="text-xs text-muted-foreground">
                          {t("desiredCapacity") ?? "Desired Capacity (kW)"}
                        </p>
                        <p className="font-semibold text-foreground">
                          {session.applicationDetails?.capacity ?? (t("notAvailable") ?? "N/A")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl grid place-items-center bg-orange-500/15 border border-orange-500/20">
                        <Package className="w-5 h-5 text-orange-800 dark:text-orange-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t("customerPackage") ?? "Customer Package"}
                        </p>
                        <p className="font-semibold text-foreground break-words">
                          {session.applicationDetails?.selectedPackageName ??
                            (t("notSelected") ?? "Not selected")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span className="break-words">
                        {session.applicationDetails?.customerPhone ??
                          (t("phoneNotAvailable") ?? "Phone not available")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="break-words">
                        {session.applicationDetails?.customerEmail ?? (t("notAvailable") ?? "N/A")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3 flex justify-between gap-3">
                    <span className="text-muted-foreground">{t("requirements") ?? "Requirements"}</span>
                    <span className="font-semibold text-foreground text-right break-words">
                      {session.requirements ?? (t("noExtraRequirements") ?? "No extra requirements")}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3 flex justify-between gap-3">
                    <span className="text-muted-foreground">{t("maximumBudget") ?? "Maximum Budget"}</span>
                    <span className="font-semibold text-foreground text-right">
                      {session.maxBudget != null
                        ? formatMoneyLKR(session.maxBudget)
                        : (t("noLimitSet") ?? "No limit set")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RIGHT: My bid */}
            <Card className="lg:col-span-2 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
                  {t("submittedProposal") ?? "Submitted Proposal"}
                </CardTitle>
                <CardDescription>
                  {(t("yourBidSummary") ?? "Your bid summary")} • {(t("totalBids") ?? "Total bids")}:{" "}
                  {bids.length}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {!myBid ? (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3">
                      {t("noBidSubmittedYet") ?? "No submitted bid was found for your account."}
                    </div>

                    <Link href={`/installer/bids/${session.id}`}>
                      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                        <Button className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold shadow-sm">
                          {t("submitBid") ?? "Submit Bid"}
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">{t("package") ?? "Package / Offer"}</p>
                        <p className="mt-1 font-extrabold text-foreground break-words">{offerTitle}</p>
                        {myBid.warranty && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t("warranty") ?? "Warranty"}: {myBid.warranty}
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">{t("quotedPrice") ?? "Quoted Price"}</p>
                        <p className="mt-1 text-2xl font-extrabold text-foreground">
                          {formatMoneyLKR(myBid.price ?? 0)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">
                          {t("installationTimeline") ?? "Installation Timeline"}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-foreground">
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {myBid.estimatedDays != null
                              ? `${myBid.estimatedDays} ${t("days") ?? "days"}`
                              : (t("notAvailable") ?? "N/A")}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">{t("submittedBy") ?? "Submitted By"}</p>
                        <p className="mt-1 font-semibold text-foreground break-words">
                          {myBid.installerName ?? (user?.name ?? "-")}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground break-words">
                          {myBid.contact?.email ?? user?.email ?? ""}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-yellow-500/20 bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">{t("messageToCustomer") ?? "Message / Notes"}</p>
                        <p className="mt-2 text-sm text-foreground whitespace-pre-wrap break-words">
                          {myBid.message?.trim() ? myBid.message : "-"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/installer/bids">
              <Button
                variant="outline"
                className="w-full rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
              >
                {t("backToBids") ?? "Back to Bids"}
              </Button>
            </Link>

            <Link href={`/installer/bids/${session.id}/details`}>
              <Button className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold shadow-sm">
                View details
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}