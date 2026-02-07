"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  Award,
  XCircle,
  Loader2,
  Sparkles,
  TrendingDown,
  Crown,
  Zap,
} from "lucide-react"

import type { Bid, BidSession } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

type BidUI = Bid & {
  status?: "pending" | "accepted" | "rejected" | string
  installerName?: string
  installerRating?: number
  completedProjects?: number
  packageName?: string | null
  proposal?: string | null
  warranty?: string | null
  estimatedDays?: number | null
  contact?: { phone?: string | null; email?: string | null }
}

type BidSessionUI = BidSession & {
  status: "open" | "closed" | "expired" | string
  bidType?: "open" | "direct" | "specific" | string
  expiresAt: string | Date
  selectedBidId?: string | null
  requirements?: string | null
  maxBudget?: number | null
  bids: BidUI[]
  applicationDetails?: {
    address?: string | null
    capacity?: string | null
    customerPhone?: string | null
    customerEmail?: string | null
  }
}

export default function BidSessionDetail() {
  const { t } = useLanguage()
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [session, setSession] = useState<BidSessionUI | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [actionError, setActionError] = useState<string | null>(null)
  const [selectedBid, setSelectedBid] = useState<BidUI | null>(null)
  const [decision, setDecision] = useState<"accept" | "reject" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60)
    return () => clearInterval(timer)
  }, [])

  const loadSession = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const res = await fetch(`/api/bids/${params.id}`, { cache: "no-store" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("unableToLoadBidSession"))

      const payload = (data.session ?? data) as any

      // ✅ normalize bids always
      const normalized: BidSessionUI = {
        ...payload,
        bids: Array.isArray(payload?.bids) ? payload.bids : [],
      }

      setSession(normalized)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : t("unexpectedError"))
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [params.id, t])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!active) return
      await loadSession()
    })()
    return () => {
      active = false
    }
  }, [loadSession])

  // ✅ Always use this safe array
  const bids = session?.bids ?? []

  const countdown = useMemo(() => {
    if (!session?.expiresAt) return "—"
    const diff = new Date(session.expiresAt).getTime() - now.getTime()
    if (diff <= 0) return t("expired")

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return days > 0 ? `${days}d ${remainingHours}h ${t("remaining")}` : `${hours}h ${minutes}m ${t("remaining")}`
  }, [now, session?.expiresAt, t])

  const sortedBids = useMemo(() => {
    return [...bids].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
  }, [bids])

  const lowestPrice = sortedBids[0]?.price

  const highestRated = useMemo(() => {
    if (!bids.length) return null
    return [...bids].sort((a, b) => (b.installerRating ?? 0) - (a.installerRating ?? 0))[0] ?? null
  }, [bids])

  const activeSelectedBid = useMemo(() => {
    if (!session?.selectedBidId) return null
    return bids.find((bid) => bid.id === session.selectedBidId) ?? null
  }, [bids, session?.selectedBidId])

  const sessionStatusBadge = (status: BidSessionUI["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge
            className="bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-600 border-emerald-300/50 border shadow-sm font-medium px-3 py-1.5 backdrop-blur-sm"
            variant="secondary"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t("open")}
          </Badge>
        )
      case "closed":
        return (
          <Badge
            className="bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-blue-300/50 border shadow-sm font-medium px-3 py-1.5 backdrop-blur-sm"
            variant="secondary"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            {t("closed")}
          </Badge>
        )
      case "expired":
        return (
          <Badge
            className="bg-gradient-to-r from-red-500/15 to-rose-500/15 text-red-600 border-red-300/50 border shadow-sm font-medium px-3 py-1.5 backdrop-blur-sm"
            variant="secondary"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            {t("expired")}
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-foreground">
            {String(status)}
          </Badge>
        )
    }
  }

  // Accept / Reject
  const handleDecision = async () => {
    if (!session || !selectedBid || !decision) return
    setActionLoading(true)
    setActionError(null)

    try {
      const res = await fetch(`/api/bids/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: decision, bidId: selectedBid.id }),
      })

      const text = await res.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { error: text || "Non-JSON response from server" }
      }

      if (!res.ok) throw new Error(data.error || t("unableToUpdateBid"))

      // Some APIs return { ok: true } only -> refresh
      if (data.session) {
        const payload = data.session
        setSession({
          ...(payload as any),
          bids: Array.isArray(payload?.bids) ? payload.bids : [],
        })
      } else {
        await loadSession()
      }

      if (decision === "accept" && data.invoiceId) {
        router.push(`/customer/invoices/${data.invoiceId}`)
      }

      setSelectedBid(null)
      setDecision(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("unexpectedError"))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-green-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <p className="text-muted-foreground font-medium">{t("loadingBidSession")}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (loadError || !session) {
    return (
      <DashboardLayout>
        <div className="space-y-4 max-w-2xl mx-auto pt-8">
          <Link href="/customer/bids">
            <Button variant="ghost" size="sm" className="bg-transparent hover:bg-emerald-50 group">
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              {t("backToBids")}
            </Button>
          </Link>
          <div className="p-6 rounded-2xl border border-destructive/30 bg-gradient-to-r from-red-50 to-rose-50 text-destructive shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Error Loading Session</p>
                <p className="text-sm opacity-80">{loadError || t("bidSessionNotFound")}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-green-50/40 relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-green-400/25 to-emerald-500/15 rounded-full blur-3xl floaty" />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/20 to-teal-400/15 rounded-full blur-3xl floaty-delayed" />
          <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-gradient-to-tl from-green-300/20 to-lime-300/15 rounded-full blur-3xl floaty-slow" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative space-y-6 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <Link href="/customer/bids">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-sm hover:shadow-md hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-600 group-hover:-translate-x-0.5 transition-transform" />
              </Button>
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {session.id}
                </h1>
                {sessionStatusBadge(session.status)}
                <Badge variant="outline" className="text-xs bg-white/80 backdrop-blur-sm border-emerald-200/60 shadow-sm">
                  <Zap className="w-3 h-3 mr-1 text-amber-500" />
                  {session.bidType === "open" ? t("openBid") : t("specificInstaller")}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                {session.applicationDetails?.address ?? t("notAvailable")} | {session.applicationDetails?.capacity ?? t("notAvailable")}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-cyan-200/60 bg-white/70 backdrop-blur-md shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("totalBids")}</p>
                    <p className="text-2xl font-bold text-foreground">{bids.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200/60 bg-white/70 backdrop-blur-md shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("lowestBid")}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {lowestPrice ? `LKR ${lowestPrice.toLocaleString()}` : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200/60 bg-white/70 backdrop-blur-md shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("expires")}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Date(session.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    {session.status === "open" && (
                      <p className="text-xs font-medium text-amber-600 mt-0.5">{countdown}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected bid */}
          {activeSelectedBid && (
            <Card className="border-emerald-300/60 bg-gradient-to-r from-emerald-50/80 via-white/80 to-green-50/80 backdrop-blur-md shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  {t("selectedBid")}
                </CardTitle>
                <CardDescription>{t("selectedBidDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-lg text-foreground">{activeSelectedBid.installerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeSelectedBid.packageName ?? t("customPackage")} • {activeSelectedBid.estimatedDays} {t("days")} •{" "}
                    {activeSelectedBid.warranty} {t("warranty")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-bold text-2xl text-emerald-700">
                    LKR {(activeSelectedBid.price ?? 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {actionError && (
            <div className="p-4 rounded-2xl border border-destructive/30 bg-gradient-to-r from-red-50 to-rose-50 text-destructive text-sm flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-red-100 rounded-xl">
                <XCircle className="w-4 h-4" />
              </div>
              {actionError}
            </div>
          )}

          {/* Bids list */}
          <Card className="border-emerald-200/60 bg-white/70 backdrop-blur-md shadow-xl">
            <CardHeader className="border-b border-emerald-100/60 bg-gradient-to-r from-emerald-50/60 via-white/40 to-green-50/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl border border-emerald-200/50 shadow-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">{t("receivedBids")}</CardTitle>
                  <CardDescription>{t("receivedBidsDesc")}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {sortedBids.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Building2 className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">No bids received yet</p>
                </div>
              ) : (
                sortedBids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className="p-5 rounded-2xl border-2 border-emerald-100/80 bg-white/80 hover:border-emerald-300/60 hover:shadow-lg transition-all"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200/50 flex items-center justify-center shadow-md">
                          <Building2 className="w-7 h-7 text-gray-600" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-lg text-foreground">{bid.installerName}</p>

                            {bid.price === lowestPrice && (
                              <Badge className="bg-emerald-500/10 text-emerald-700" variant="secondary">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                {t("lowestPrice")}
                              </Badge>
                            )}

                            {highestRated?.id === bid.id && (
                              <Badge className="bg-amber-500/10 text-amber-700" variant="secondary">
                                <Crown className="w-3 h-3 mr-1" />
                                {t("topRated")}
                              </Badge>
                            )}

                            <Badge variant="outline" className="text-xs capitalize bg-white/80">
                              {bid.status ?? "pending"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="font-medium text-amber-700">{bid.installerRating ?? t("notAvailable")}</span>
                            </span>
                            <span>
                              {bid.completedProjects ?? 0} {t("projects")}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-foreground mt-2">{bid.packageName ?? t("customProposal")}</p>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{bid.proposal ?? ""}</p>

                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{bid.contact?.phone ?? t("notAvailable")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{bid.contact?.email ?? t("notAvailable")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
                            <p className="text-xs text-muted-foreground mb-1">{t("price")}</p>
                            <p className="font-bold text-emerald-600">LKR {(bid.price ?? 0).toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100/50">
                            <p className="text-xs text-muted-foreground mb-1">{t("warranty")}</p>
                            <p className="font-semibold text-foreground">{bid.warranty ?? "-"}</p>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100/50">
                            <p className="text-xs text-muted-foreground mb-1">{t("timeline")}</p>
                            <p className="font-semibold text-foreground">
                              {bid.estimatedDays ?? "-"} {bid.estimatedDays ? t("days") : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="bg-white/80 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                            disabled={session.status !== "open" || (bid.status ?? "pending") !== "pending" || actionLoading}
                            onClick={() => {
                              setSelectedBid(bid)
                              setDecision("reject")
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {t("reject")}
                          </Button>

                          <Button
                            onClick={() => {
                              setSelectedBid(bid)
                              setDecision("accept")
                            }}
                            disabled={session.status !== "open" || (bid.status ?? "pending") !== "pending" || actionLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t("accept")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Decision Modal */}
          {decision && selectedBid && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md border-emerald-200/60 bg-white/95 backdrop-blur-md shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {decision === "accept" ? t("confirmBidAcceptance") : t("rejectBid")}
                  </CardTitle>
                  <CardDescription>
                    {decision === "accept" ? t("acceptBidDescription") : t("rejectBidDescription")}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="p-4 rounded-2xl border border-emerald-100/50 bg-emerald-50/40 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{selectedBid.installerName}</p>
                        <p className="text-sm text-muted-foreground">{selectedBid.packageName ?? t("customProposal")}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-white/80 rounded-xl border border-gray-100">
                        <p className="text-muted-foreground text-xs mb-1">{t("price")}</p>
                        <p className="font-bold text-emerald-700">LKR {(selectedBid.price ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-white/80 rounded-xl border border-gray-100">
                        <p className="text-muted-foreground text-xs mb-1">{t("timeline")}</p>
                        <p className="font-semibold text-foreground">
                          {selectedBid.estimatedDays ?? "-"} {selectedBid.estimatedDays ? t("days") : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200/50">
                    <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      {t("installerContact")}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="p-1.5 bg-white rounded-lg border border-cyan-100 inline-flex">
                          <Phone className="w-3.5 h-3.5 text-cyan-600" />
                        </span>
                        <span>{selectedBid.contact?.phone ?? t("notAvailable")}</span>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="p-1.5 bg-white rounded-lg border border-cyan-100 inline-flex">
                          <Mail className="w-3.5 h-3.5 text-cyan-600" />
                        </span>
                        <span>{selectedBid.contact?.email ?? t("notAvailable")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDecision(null)
                        setSelectedBid(null)
                      }}
                      className="flex-1 bg-white/80 border-gray-200 hover:bg-gray-50"
                      disabled={actionLoading}
                    >
                      {t("cancel")}
                    </Button>

                    <Button
                      onClick={handleDecision}
                      className={`flex-1 text-white ${
                        decision === "accept"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("processing")}
                        </>
                      ) : decision === "accept" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t("confirm")}
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          {t("rejectBid")}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <style jsx>{`
          .floaty {
            animation: floaty 8s ease-in-out infinite;
          }
          .floaty-delayed {
            animation: floaty 10s ease-in-out infinite;
            animation-delay: 1s;
          }
          .floaty-slow {
            animation: floaty 12s ease-in-out infinite;
            animation-delay: 2s;
          }
          @keyframes floaty {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -20px, 0) scale(1.05);
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}