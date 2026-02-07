"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Star, MessageSquare, RefreshCw, Quote } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Review = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  customer: { id: string; name: string; profileImageUrl: string | null }
  application: { id: string; reference: string; status: string }
}

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
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_0%,rgba(250,204,21,0.35),transparent_55%),radial-gradient(55%_55%_at_100%_20%,rgba(245,158,11,0.26),transparent_58%),radial-gradient(60%_60%_at_30%_100%,rgba(251,146,60,0.18),transparent_58%)]" />
      <motion.div
        className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl"
        animate={{ x: [0, 38, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-amber-500/18 blur-3xl"
        animate={{ x: [0, -34, 0], y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.35)_1px,transparent_1px)] dark:opacity-[0.12] [background-size:46px_46px]" />
    </div>
  )
}

export default function FeedbackSection() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingAvg, setRatingAvg] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Review | null>(null)

  const latest = useMemo(() => (reviews.length ? reviews[0] : null), [reviews])

  async function loadReviews() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/installers/reviews", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? "Failed to load reviews")

      setReviews(data.reviews ?? [])
      setRatingAvg(data.ratingAvg ?? 0)
      setRatingCount(data.ratingCount ?? 0)
    } catch (e: any) {
      setError(e?.message ?? "Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  // initial load + optional polling
  useEffect(() => {
    loadReviews()
    const t = setInterval(loadReviews, 30000)
    return () => clearInterval(t)
  }, [])

  // popup after 2 seconds (only once per newest review)
  useEffect(() => {
    if (!latest) return

    const key = "installer_last_seen_review_id"
    const lastSeen = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (lastSeen === latest.id) return

    const timer = setTimeout(() => {
      setSelected(latest)
      setOpen(true)
      localStorage.setItem(key, latest.id)
    }, 2000)

    return () => clearTimeout(timer)
  }, [latest])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
          <AnimatedYellowBackdrop />

          <CardHeader className="py-4">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
                  <MessageSquare className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <span>Customer Feedback</span>
                    <Badge className="bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                      Live
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">
                    Latest reviews + popup for new feedback
                  </p>
                </div>
              </CardTitle>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                <Button
                  variant="outline"
                  onClick={loadReviews}
                  disabled={loading}
                  className="border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-3">
            {loading && (
              <div className="space-y-2">
                <div className="h-4 w-44 rounded bg-yellow-500/15 animate-pulse" />
                <div className="h-3 w-72 rounded bg-yellow-500/10 animate-pulse" />
                <div className="h-20 w-full rounded-2xl bg-yellow-500/10 animate-pulse" />
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3">
                <div className="flex items-center gap-2">
                  <Stars value={Math.round(ratingAvg)} />
                  <span className="text-sm text-muted-foreground">
                    Avg: <span className="font-semibold text-foreground">{ratingAvg.toFixed(2)}</span>{" "}
                    <span className="text-muted-foreground">({ratingCount})</span>
                  </span>
                </div>

                <Badge className="bg-gradient-to-r from-yellow-400/25 to-amber-500/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                  {reviews.length} reviews
                </Badge>
              </div>
            )}

            {!loading && !error && reviews.length === 0 && (
              <div className="rounded-2xl border border-dashed border-yellow-500/30 p-4 text-sm text-muted-foreground bg-yellow-500/5">
                No feedback received yet.
              </div>
            )}

            {!loading && !error && reviews.length > 0 && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
                }}
                className="space-y-2"
              >
                {reviews.map((r) => (
                  <motion.button
                    key={r.id}
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full text-left p-3 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 hover:from-yellow-500/14 hover:to-orange-500/12 transition shadow-sm"
                    onClick={() => {
                      setSelected(r)
                      setOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {r.customer?.name ?? "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {r.application?.reference} • {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Stars value={r.rating} />
                        <Badge
                          variant="outline"
                          className="border-yellow-500/25 bg-yellow-500/10"
                        >
                          {r.rating}/5
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-2">
                      {r.comment ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">{r.comment}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No comment</p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Popup dialog (UI enhanced; logic unchanged) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 via-background to-orange-500/10 overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.35),transparent_45%),radial-gradient(circle_at_90%_30%,rgba(245,158,11,0.25),transparent_50%)]" />

            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
                  <Quote className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                </div>
                Feedback
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {selected?.customer?.name ?? "Customer"} • {selected?.application?.reference}
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.22 }}
                  className="mt-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Stars value={selected.rating} />
                      <span className="text-sm text-muted-foreground">({selected.rating}/5)</span>
                    </div>

                    <Badge className="bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                      Verified
                    </Badge>
                  </div>

                  <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 p-4 text-sm text-foreground">
                    {selected.comment || "No comment"}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}