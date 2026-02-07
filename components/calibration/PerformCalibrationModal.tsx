"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/LanguageContext"

type Props = {
  open: boolean
  onClose: () => void
  calibrationId: string
  onCompleted: () => void
}

export default function PerformCalibrationModal({
  open,
  onClose,
  calibrationId,
  onCompleted,
}: Props) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState("")
  const [readings, setReadings] = useState({
    currentPower: "",
    dailyEnergy: "",
    monthlyEnergy: "",
  })

  const CEB_CHECKLIST = [
    t("inverterFunctioning"),
    t("solarPanelsClean"),
    t("noShadingIssues"),
    t("cablesSecure"),
    t("earthingSystemOk"),
    t("monitoringSystemWorking"),
  ]

  const toggleCheck = (item: string) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    )
  }

  async function submit() {
    setLoading(true)
    try {
      await fetch(`/api/calibrations/${calibrationId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist: checked,
          readings,
          recommendations,
        }),
      })
      onCompleted()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("performCalibration")}</DialogTitle>
        </DialogHeader>

        {/* Checklist */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("cebChecklist")}</p>
          {CEB_CHECKLIST.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={checked.includes(item)}
                onCheckedChange={() => toggleCheck(item)}
              />
              {item}
            </label>
          ))}
        </div>

        {/* Readings */}
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder={t("currentPowerKw")}
            value={readings.currentPower}
            onChange={(e) =>
              setReadings({ ...readings, currentPower: e.target.value })
            }
          />
          <Input
            placeholder={t("dailyEnergyKwh")}
            value={readings.dailyEnergy}
            onChange={(e) =>
              setReadings({ ...readings, dailyEnergy: e.target.value })
            }
          />
          <Input
            placeholder={t("monthlyEnergyKwh")}
            value={readings.monthlyEnergy}
            onChange={(e) =>
              setReadings({ ...readings, monthlyEnergy: e.target.value })
            }
          />
        </div>

        {/* Recommendations */}
        <Textarea
          placeholder={t("recommendationsNotes")}
          value={recommendations}
          onChange={(e) => setRecommendations(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? t("saving") : t("completeCalibration")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
