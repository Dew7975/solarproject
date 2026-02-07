"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"

type Calibration = {
  id: string
  scheduledAt: string
  completedAt?: string
  status: "SCHEDULED" | "COMPLETED"
  checklist?: Record<string, boolean>
  readings?: any
  recommendations?: string
  reportUrl?: string
}

export default function CustomerCalibrationDetailsPage() {
  const { t } = useLanguage()
  const { id } = useParams()

  const [calibration, setCalibration] = useState<Calibration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/customer/calibrations/${id}`)
      const data = await res.json()
      setCalibration(data.calibration)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <p>{t("loading")}</p>
      </DashboardLayout>
    )
  }

  if (!calibration) {
    return (
      <DashboardLayout>
        <p>{t("noCalibrationFound")}</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">

        <h1 className="text-2xl font-bold">
          {t("calibrationReport")}
        </h1>

        {/* STATUS */}
        <Badge className="w-fit bg-emerald-500/10 text-emerald-600">
          {calibration.status === "SCHEDULED"
            ? t("scheduled")
            : t("completed")}
        </Badge>

        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>{t("details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>{t("scheduled")}:</strong>{" "}
              {new Date(calibration.scheduledAt).toDateString()}
            </p>
            {calibration.completedAt && (
              <p>
                <strong>{t("completed")}:</strong>{" "}
                {new Date(calibration.completedAt).toDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* CHECKLIST */}
        {calibration.checklist && (
          <Card>
            <CardHeader>
              <CardTitle>{t("cebChecklist")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {Object.entries(calibration.checklist).map(([key, value]) => (
                <div key={key}>
                  {value ? "✔️" : "❌"} {t(key as any)}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* READINGS */}
        {calibration.readings && (
          <Card>
            <CardHeader>
              <CardTitle>{t("systemReadings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-3 rounded">
                {JSON.stringify(calibration.readings, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* RECOMMENDATIONS */}
        {calibration.recommendations && (
          <Card>
            <CardHeader>
              <CardTitle>{t("recommendations")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {calibration.recommendations}
            </CardContent>
          </Card>
        )}

        {/* PDF */}
        {calibration.reportUrl && (
          <Button asChild>
            <a href={calibration.reportUrl} target="_blank">
              {t("downloadCalibrationPdf")}
            </a>
          </Button>
        )}

      </div>
    </DashboardLayout>
  )
}
