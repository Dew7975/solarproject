"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
  Gavel,
  Clock,
  MapPin,
  Zap,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Eye,
} from "lucide-react"

import { fetchCurrentUser, type BidSession, type Bid, type User } from "@/lib/auth"

/* -------------------- UI helpers (dashboard-like) -------------------- */

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
  tone = "yellow",
}: {
  label: string
  value: string | number
  icon: any
  tone?: "yellow" | "amber" | "orange" | "emerald"
}) {
  const tones: Record<string, string> = {
    yellow:
      "border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-yellow-500/10",
    amber:
      "border-amber-500/25 bg-gradient-to-br from-amber-500/18 via-background/70 to-yellow-500/10",
    orange:
      "border-orange-500/25 bg-gradient-to-br from-orange-500/18 via-background/70 to-amber-500/10",
    emerald:
      "border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 via-background/70 to-emerald-500/8",
  }

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className={`h-full overflow-hidden border ${tones[tone]} shadow-sm`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-yellow-500/20 bg-yellow-400/15 grid place-items-center">
              <Icon className="h-5 w-5 text-yellow-800 dark:text-yellow-300" />
            </div>
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

/* -------------------- Page -------------------- */

export default function InstallerBids() {
  const [activeTab, setActiveTab] = useState("open")
  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<BidSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  const [previewBid, setPreviewBid] = useState<
    | (Bid & {
        sessionId: string
        capacity?: string
        address?: string
        customerPhone?: string
        customerEmail?: string
        selectedPackageName?: string
        selectedPackagePrice?: number
      })
    | null
  >(null)

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

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/bids", { cache: "no-store" })
        if (!res.ok) throw new Error("Unable to load bids")
        const data = await res.json()
        setSessions(data.bidSessions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error")
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  const installerId = user?.organization?.id ?? user?.id ?? ""

  const openBids = useMemo(() => sessions.filter((s) => s.status === "open"), [sessions])

  const myBidsBySession = useMemo(() => {
    const map = new Map<string, Bid>()
    sessions.forEach((session) => {
      session.bids.forEach((bid) => {
        if (bid.installerId === installerId) map.set(session.id, bid)
      })
    })
    return map
  }, [installerId, sessions])

  const myBids: (Bid & {
    sessionId: string
    applicationId?: string
    capacity?: string
    address?: string
    customerPhone?: string
    customerEmail?: string
    selectedPackageName?: string
    selectedPackagePrice?: number
  })[] = useMemo(() => {
    const submissions: any[] = []
    sessions.forEach((session) => {
      session.bids.forEach((bid) => {
        if (bid.installerId === installerId) {
          submissions.push({
            ...bid,
            sessionId: session.id,
            applicationId: session.applicationId,
            capacity: session.applicationDetails?.capacity,
            address: session.applicationDetails?.address,
            customerPhone: session.applicationDetails?.customerPhone,
            customerEmail: session.applicationDetails?.customerEmail,
            selectedPackageName: session.applicationDetails?.selectedPackageName,
            selectedPackagePrice:
              session.applicationDetails?.selectedPackagePrice != null
                ? Number(session.applicationDetails.selectedPackagePrice)
                : undefined,
          })
        }
      })
    })
    return submissions
  }, [installerId, sessions])

  const stats = useMemo(() => {
    const accepted = myBids.filter((b) => b.status === "accepted").length
    const pending = myBids.filter((b) => b.status === "pending").length
    const expiringSoon = openBids.filter((s) => {
      const diff = new Date(s.expiresAt).getTime() - now.getTime()
      return diff > 0 && diff <= 1000 * 60 * 60 * 24 // 24h
    }).length
    return {
      open: openBids.length,
      my: myBids.length,
      accepted,
      pending,
      expiringSoon,
    }
  }, [myBids, openBids, now])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20" variant="secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20" variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20" variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Not Selected
          </Badge>
        )
      default:
        return null
    }
  }

  const countdown = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - now.getTime()
    if (diff <= 0) return "Expired"
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return days > 0 ? `${days}d ${remainingHours}h` : `${hours}h ${minutes}m`
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
          {/* Hero header */}
          <Card className="overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/18 via-background/70 to-orange-500/12 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                      <Sparkles className="h-5 w-5 text-yellow-950/80" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                        Bid Requests
                      </h1>
                      <p className="text-xs text-muted-foreground truncate">
                        View open bids and submit your proposals
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    

                   

                    {stats.expiringSoon > 0 && (
                      <Badge className="bg-orange-500/15 text-orange-900 dark:text-orange-200 border border-orange-500/25">
                        <Clock className="w-3 h-3 mr-1" />
                        {stats.expiringSoon} expiring &lt; 24h
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    className="bg-background/50 border-yellow-500/25 hover:bg-yellow-500/10"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI mini cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <MiniStat label="Open bids" value={stats.open} icon={Gavel} tone="yellow" />
            <MiniStat label="My bids" value={stats.my} icon={Eye} tone="amber" />
            <MiniStat label="Accepted" value={stats.accepted} icon={CheckCircle} tone="emerald" />
            <MiniStat label="Pending" value={stats.pending} icon={Clock} tone="orange" />
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
          </AnimatePresence>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-background/60 border border-yellow-500/20">
              <TabsTrigger value="open">Open Bids ({openBids.length})</TabsTrigger>
              <TabsTrigger value="my-bids">My Bids ({myBids.length})</TabsTrigger>
            </TabsList>

            {/* ---------------- OPEN BIDS ---------------- */}
            <TabsContent value="open" className="mt-4 space-y-4">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading bids...
                </div>
              ) : openBids.length === 0 ? (
                <Card className="border-dashed border-yellow-500/30 bg-yellow-500/5">
                  <CardContent className="py-12 text-center">
                    <Gavel className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No open bids</h3>
                    <p className="text-muted-foreground">Check back later for new bid opportunities</p>
                  </CardContent>
                </Card>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                  }}
                  className="space-y-4"
                >
                  {openBids.map((session) => {
                    const existingBid = myBidsBySession.get(session.id)
                    return (
                      <motion.div
                        key={session.id}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: { opacity: 1, y: 0 },
                        }}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="overflow-hidden border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                          <CardContent className="p-5 sm:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex-1 space-y-3 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-lg text-foreground truncate">
                                      {session.applicationId}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <MapPin className="w-4 h-4 shrink-0" />
                                      <span className="truncate">
                                        {session.applicationDetails?.address ?? "Address not provided"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-amber-600 shrink-0">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-semibold">{countdown(session.expiresAt)}</span>
                                  </div>
                                </div>

                                <p className="text-muted-foreground">
                                  {session.requirements ?? "No additional requirements"}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm border border-blue-500/15">
                                    <Zap className="w-3 h-3" />
                                    {session.applicationDetails?.capacity ?? "Capacity TBD"}
                                  </div>
                                  <div className="px-3 py-1 rounded-full bg-muted/60 text-muted-foreground text-sm capitalize">
                                    {session.bidType} bid
                                  </div>
                                  <div className="px-3 py-1 rounded-full bg-muted/60 text-muted-foreground text-sm">
                                    {new Date(session.startedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              <div className="flex lg:flex-col gap-2 lg:items-end">
                                {existingBid ? (
                                  <>
                                    <div className="self-end">{getStatusBadge(existingBid.status)}</div>

                                    <Link href={`/installer/bids/${session.id}`} className="flex-1 lg:flex-none">
                                      <Button
                                        variant="outline"
                                        className="w-full bg-background/50 border-yellow-500/25 hover:bg-yellow-500/10"
                                      >
                                        View Submitted Bid
                                      </Button>
                                    </Link>
                                  </>
                                ) : (
                                  <>
                                    <Link href={`/installer/bids/${session.id}`} className="flex-1 lg:flex-none">
                                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                                        Submit Bid
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                      </Button>
                                    </Link>
                                    <Link href={`/installer/bids/${session.id}`} className="flex-1 lg:flex-none">
                                      <Button
                                        variant="outline"
                                        className="w-full bg-background/50 border-yellow-500/25 hover:bg-yellow-500/10"
                                      >
                                        View Details
                                      </Button>
                                    </Link>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* tiny animated bar */}
                            <div className="mt-4 h-1.5 w-full rounded-full bg-yellow-950/10 dark:bg-yellow-50/10 overflow-hidden">
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
                  })}
                </motion.div>
              )}
            </TabsContent>

            {/* ---------------- MY BIDS ---------------- */}
            <TabsContent value="my-bids" className="mt-4">
              <Card className="overflow-hidden border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Submitted Bids</CardTitle>
                  <CardDescription>Track the status of your bid submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading bids...
                    </div>
                  ) : myBids.length === 0 ? (
                    <div className="text-center py-10">
                      <Gavel className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">You haven&apos;t submitted any bids yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBids.map((bid) => (
                        <motion.div
                          key={bid.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className="rounded-2xl border border-yellow-500/15 bg-background/50 p-4 hover:bg-yellow-500/5 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-foreground truncate">{bid.sessionId}</p>
                                {getStatusBadge(bid.status)}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {bid.address ?? "Location TBD"} • {bid.capacity ?? "Capacity TBD"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Your Bid</p>
                                <p className="font-extrabold text-foreground">
                                  Rs. {bid.price.toLocaleString()}
                                </p>
                              </div>

                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-background/50 border-yellow-500/25 hover:bg-yellow-500/10"
                                onClick={() => setPreviewBid(bid)}
                              >
                                View Bid
                              </Button>

                              {bid.status === "accepted" && (
                                <Link href={`/installer/orders/${bid.applicationId ?? bid.sessionId}`}>
                                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    View Order
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Dialog */}
        <Dialog open={!!previewBid} onOpenChange={(open) => !open && setPreviewBid(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Submitted Bid</DialogTitle>
              <DialogDescription>{previewBid?.sessionId}</DialogDescription>
            </DialogHeader>

            {previewBid && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(previewBid.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Bid Amount</p>
                    <p className="text-lg font-bold text-foreground">
                      Rs. {previewBid.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-3 text-sm space-y-2">
                  <Row label="Location" value={previewBid.address ?? "Location TBD"} />
                  <Row label="Capacity" value={previewBid.capacity ?? "Capacity TBD"} />
                  <Row label="Customer Package" value={previewBid.selectedPackageName ?? "Not selected"} />
                  {previewBid.selectedPackagePrice !== undefined && (
                    <Row label="Package Price" value={`Rs. ${previewBid.selectedPackagePrice.toLocaleString()}`} />
                  )}
                  <Row label="Warranty" value={previewBid.warranty ?? "N/A"} />
                  <Row
                    label="Estimated Days"
                    value={previewBid.estimatedDays != null ? `${previewBid.estimatedDays}` : "N/A"}
                  />
                  <Row label="Customer Phone" value={previewBid.customerPhone ?? "Not provided"} />
                  {previewBid.customerEmail && <Row label="Customer Email" value={previewBid.customerEmail} />}
                  <Row label="Submitted" value={new Date(previewBid.createdAt).toLocaleDateString()} />
                </div>

                {previewBid.proposal && (
                  <div className="rounded-2xl border border-yellow-500/15 bg-background/50 p-3 text-sm">
                    <p className="text-muted-foreground mb-2">Proposal</p>
                    <p className="text-foreground whitespace-pre-wrap">{previewBid.proposal}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right truncate max-w-[60%]">{value}</span>
    </div>
  )
}