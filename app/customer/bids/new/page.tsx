"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Info, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { fetchCurrentUser, fetchApplications, type Application, type User } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

export default function NewBidSession() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const preSelectedApp = searchParams.get("application") || ""
  const preSelectedPackage = searchParams.get("package") || ""

  const [user, setUser] = useState<User | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState(preSelectedApp)

  // ✅ store HOURS, not days
  // 2d=48h, 3d=72h, 5d=120h, 7d=168h
  const [durationHours, setDurationHours] = useState("48")

  const [maxBudget, setMaxBudget] = useState("")
  const [requirements, setRequirements] = useState(
    preSelectedPackage ? `${t("interestedInPackage")} ${preSelectedPackage}` : "",
  )

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await fetchCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        setUser(currentUser)

        const apps = await fetchApplications()

        // ✅ ONLY APPROVED applications
        const approvedOnly = apps.filter(
          (a) => a.customerId === currentUser.id && a.status === "approved",
        )

        setApplications(approvedOnly)

        if (preSelectedApp && !approvedOnly.some((a) => a.id === preSelectedApp)) {
          setSelectedApplication("")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadApplications"))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router, preSelectedApp, t])

  async function handleCreateBidSession() {
    if (!selectedApplication || !user) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApplication,
          durationHours: Number(durationHours), // ✅ already hours
          maxBudget: maxBudget ? Number(maxBudget) : undefined,
          requirements: requirements?.trim() || undefined,
          bidType: "open",
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("unableToCreateBidSession"))
      }

      router.push("/customer/bids")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unexpectedError"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/customer/bids">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("pageTitle")}</h1>
            <p className="text-muted-foreground">{t("pageDescription")}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t("selectApplicationTitle")}</CardTitle>
            <CardDescription>{t("selectApplicationDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("loadingApplicationsBid")}
              </div>
            ) : applications.length === 0 ? (
              <p className="text-muted-foreground">
                No approved applications found. Please get an application approved first.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApplication(app.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      selectedApplication === app.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-border hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{app.id}</p>
                        <p className="text-sm text-muted-foreground">{app.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-600 capitalize">
                          {app.status.replaceAll("_", " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("updated")} {new Date(app.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("bidSettingsTitle")}</CardTitle>
            <CardDescription>{t("bidSettingsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t("bidDuration")}
              </Label>
              <Select value={durationHours} onValueChange={setDurationHours}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="48">{t("days2")}</SelectItem>
                  <SelectItem value="72">{t("days3")}</SelectItem>
                  <SelectItem value="120">{t("days5")}</SelectItem>
                  <SelectItem value="168">{t("days7")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t("maxBudget")}</Label>
              <Input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder={t("maxBudgetPlaceholder")}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                {t("specialRequirements")}
              </Label>
              <Textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder={t("requirementsPlaceholder")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">{t("howBiddingWorksTitle")}</p>
                <p className="text-muted-foreground">{t("howBiddingWorksDescription")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/customer/bids" className="flex-1">
            <Button variant="outline" className="w-full">
              {t("cancel")}
            </Button>
          </Link>
          <Button
            onClick={handleCreateBidSession}
            disabled={!selectedApplication || submitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {submitting ? t("creatingBidSession") : t("createBidSession")}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}