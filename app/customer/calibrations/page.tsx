"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"

type Calibration = {
  id: string
  scheduledAt: string
  completedAt?: string | null
  status: "SCHEDULED" | "COMPLETED"
  checklist?: Record<string, boolean>
  recommendations?: string | null
}

export default function CustomerCalibrationsPage() {
  const { t } = useLanguage()
  const [calibrations, setCalibrations] = useState<Calibration[]>([])
  const [view, setView] = useState<Calibration | null>(null)

  useEffect(() => {
    fetch("/api/calibrations")
      .then(res => res.json())
      .then(data => setCalibrations(data.calibrations || []))
  }, [])

  const upcoming = useMemo(
    () => calibrations.filter(c => c.status === "SCHEDULED"),
    [calibrations]
  )

  const completed = useMemo(
    () => calibrations.filter(c => c.status === "COMPLETED"),
    [calibrations]
  )

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("myCalibrations")}</h1>

        <h2 className="font-semibold">{t("upcoming")}</h2>
        {upcoming.map(c => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <p>{t("scheduledAt")}: {new Date(c.scheduledAt).toLocaleString()}</p>
              <Badge>{t("calibrationStatusScheduled")}</Badge>
            </CardContent>
          </Card>
        ))}

        <h2 className="font-semibold mt-6">{t("completed")}</h2>
        {completed.map(c => (
          <Card key={c.id}>
            <CardContent className="p-4 space-y-2">
              <p>
                {t("completedAt")}:{" "}
                {new Date(c.completedAt!).toLocaleString()}
              </p>
              <Badge className="bg-emerald-500/10 text-emerald-600">
                {t("calibrationStatusCompleted")}
              </Badge>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setView(c)}
              >
                {t("viewReport")}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* VIEW REPORT */}
        {view && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
              <CardContent className="p-4 space-y-3 text-sm">
                <h3 className="font-semibold text-lg">
                  {t("calibrationReport")}
                </h3>

                <b>{t("checklist")}</b>
                <ul className="list-disc pl-5">
                  {view.checklist &&
                    Object.entries(view.checklist)
                      .filter(([, v]) => v)
                      .map(([k]) => <li key={k}>{k}</li>)}
                </ul>

                <b>{t("recommendations")}</b>
                <p>{view.recommendations || t("none")}</p>

                <Button onClick={() => setView(null)}>{t("close")}</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
