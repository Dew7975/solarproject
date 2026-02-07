"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Gavel, Clock, CheckCircle, XCircle, Plus, ArrowRight, Timer } from "lucide-react"

import Countdown from "@/components/countdown"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { fetchBidSessions, type BidSession } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

export default function CustomerBids() {
  const { t } = useLanguage()
  const [bidSessions, setBidSessions] = useState<BidSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const sessions = await fetchBidSessions()
        setBidSessions(sessions)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadBids"))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [t])

  const getStatusBadge = (status: BidSession["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {t("open")}
          </Badge>
        )
      case "closed":
        return (
          <Badge className="bg-blue-500/10 text-blue-600" variant="secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("closed")}
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-500/10 text-red-600" variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            {t("expired")}
          </Badge>
        )
    }
  }

  const enrichedSessions = useMemo(() => {
    return bidSessions.map((session) => {
      const selectedBid = session.selectedBidId
        ? session.bids.find((bid) => bid.id === session.selectedBidId)
        : undefined

      return { ...session, selectedBid }
    })
  }, [bidSessions])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("myBids")}</h1>
            <p className="text-muted-foreground">{t("manageBidsDescription")}</p>
          </div>
          <Link href="/customer/bids/new">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {t("openNewBid")}
            </Button>
          </Link>
        </div>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">{t("howBiddingWorksTitle")}</p>
                <p className="text-muted-foreground">{t("howBiddingWorksDescription")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("bidSessionsTitle")} ({enrichedSessions.length})
            </CardTitle>
            <CardDescription>{t("bidSessionsDescription")}</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">{t("loadingBids")}</div>
            ) : enrichedSessions.length === 0 ? (
              <div className="text-center py-12">
                <Gavel className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{t("noBidSessions")}</h3>
                <p className="text-muted-foreground mb-4">{t("noBidSessionsDescription")}</p>
                <Link href="/customer/bids/new">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {t("openNewBid")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrichedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Gavel className="w-6 h-6 text-amber-500" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">{session.id}</p>
                          {getStatusBadge(session.status)}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {t("application")}: {session.applicationId} • {session.bids.length}{" "}
                          {t("bidsReceived")}
                        </p>

                        {/* ✅ LIVE COUNTDOWN WITH SECONDS (LARGE) */}
                        {session.status === "open" && (
                          <Countdown
                            expiresAt={session.expiresAt}
                            className="text-2xl sm:text-3xl font-mono mt-2"
                          />
                        )}
                      </div>
                    </div>

                    <Link href={`/customer/bids/${session.id}`}>
                      <Button variant="outline" size="sm">
                        {t("viewBids")}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}