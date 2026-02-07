"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, FileText } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

type Calibration = {
  id: string
  scheduledAt: string
  completedAt?: string | null
  status: "SCHEDULED" | "COMPLETED"
  checklist?: Record<string, boolean> | null
  readings?: any
  recommendations?: string | null
  application?: {
    id: string
    customer?: { name?: string | null } | null
    // referenceNo?: string | null
  } | null
}

const CHECK_KEYS = ["inverter","panels","wiring","earthing","safety","meter"] as const

export default function OfficerCalibrationsPage() {
  const { t } = useLanguage()

  const [calibrations, setCalibrations] = useState<Calibration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming")

  const [toComplete, setToComplete] = useState<Calibration | null>(null)
  const [toView, setToView] = useState<Calibration | null>(null)
  const [recommendation, setRecommendation] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    const res = await fetch("/api/officer/calibrations")
    const data = await res.json()
    setCalibrations(data.calibrations || [])
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [])

  const upcoming = useMemo(
    () => calibrations.filter(c => c.status === "SCHEDULED"),
    [calibrations]
  )
  const completed = useMemo(
    () => calibrations.filter(c => c.status === "COMPLETED"),
    [calibrations]
  )

  function isDue(c: Calibration) {
    return new Date(c.scheduledAt).getTime() <= Date.now()
  }

  function displayLabel(c: Calibration) {
    // Prefer friendly info over raw IDs:
    const customerName = c.application?.customer?.name
    if (customerName) return customerName
    // fallback: show last 6 chars
    return `CAL-${c.id.slice(-6).toUpperCase()}`
  }

  async function submitCalibration() {
    if (!toComplete) return
    setSubmitting(true)
    setError(null)

    const res = await fetch(`/api/officer/calibrations/${toComplete.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checklist: toComplete.checklist ?? {},
        recommendations: recommendation,
        // readings: {...} // include if you collect readings
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.error || "Failed to complete calibration.")
      setSubmitting(false)
      return
    }

    setCalibrations(prev =>
      prev.map(c => (c.id === data.calibration.id ? data.calibration : c))
    )

    setToComplete(null)
    setRecommendation("")
    setSubmitting(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("calibrations")}</h1>

        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="upcoming">
              {t("upcoming")} ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t("completed")} ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {loading && <p>{t("loading")}</p>}
            {!loading && upcoming.map(c => {
              const due = isDue(c)
              return (
                <Card key={c.id}>
                  <CardContent className="p-4 flex justify-between items-center gap-4">
                    <div>
                      <p className="font-medium">{displayLabel(c)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(c.scheduledAt).toLocaleString()}
                      </p>
                      <Badge>{t("scheduled")}</Badge>
                      {!due && (
                        <p className="text-xs text-amber-600 mt-1">
                          Not due yet
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() =>
                        setToComplete({
                          ...c,
                          checklist: c.checklist ?? {}, // ensure object exists
                        })
                      }
                      disabled={!due}
                    >
                      <Wrench className="w-4 h-4 mr-1" />
                      {t("perform")}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-4">
            {completed.map(c => (
              <Card key={c.id}>
                <CardContent className="p-4 flex justify-between items-center gap-4">
                  <div>
                    <p className="font-medium">{displayLabel(c)}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.completedAt ? new Date(c.completedAt).toLocaleString() : ""}
                    </p>
                    <Badge className="bg-emerald-500/10 text-emerald-600">
                      {t("completed")}
                    </Badge>
                  </div>

                  <Button variant="outline" onClick={() => setToView(c)}>
                    <FileText className="w-4 h-4 mr-1" />
                    {t("viewReport")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* COMPLETE MODAL */}
        {toComplete && (
          <Modal title={t("completeCalibration")} onClose={() => { setToComplete(null); setError(null) }}>
            {error && (
              <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              {CHECK_KEYS.map(k => (
                <label key={k} className="flex gap-2 text-sm items-center">
                  <input
                    type="checkbox"
                    checked={!!toComplete.checklist?.[k]}
                    onChange={e =>
                      setToComplete(prev =>
                        prev
                          ? {
                              ...prev,
                              checklist: {
                                ...(prev.checklist ?? {}),
                                [k]: e.target.checked,
                              },
                            }
                          : prev
                      )
                    }
                  />
                  {t(k as any)}
                </label>
              ))}
            </div>

            <textarea
              className="w-full border rounded p-2 mt-3"
              placeholder={t("recommendations")}
              value={recommendation}
              onChange={e => setRecommendation(e.target.value)}
            />

            <Button
              className="mt-3"
              onClick={submitCalibration}
              disabled={submitting || recommendation.trim().length === 0}
            >
              {t("submit")}
            </Button>
          </Modal>
        )}

        {/* VIEW REPORT MODAL */}
        {toView && (
          <Modal title={t("calibrationReport")} onClose={() => setToView(null)}>
            <p className="text-sm">
              <b>{t("scheduled")}:</b> {new Date(toView.scheduledAt).toLocaleString()}
            </p>
            {toView.completedAt && (
              <p className="text-sm">
                <b>{t("completed")}:</b> {new Date(toView.completedAt).toLocaleString()}
              </p>
            )}

            <b className="text-sm">{t("checklist")}</b>
            <ul className="list-disc pl-5 text-sm">
              {toView.checklist &&
                Object.entries(toView.checklist)
                  .filter(([, v]) => v)
                  .map(([k]) => <li key={k}>{t(k as any)}</li>)}
            </ul>

            <p className="text-sm"><b>{t("recommendations")}:</b></p>
            <p className="text-sm">{toView.recommendations || "-"}</p>

            {/* If you implement PDF endpoint, open it here */}
            {/* <Button variant="outline" onClick={() => window.open(`/api/calibrations/${toView.id}/pdf`)}>
              {t("downloadPdf")}
            </Button> */}
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {children}
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}