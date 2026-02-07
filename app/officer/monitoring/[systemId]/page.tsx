"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"

type OfficerStats = {
  systems: number
  totalGeneration: number
  co2Saved: number
  offline: number
}

export default function OfficerMonitoringPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<OfficerStats | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // later you will aggregate from DB
        setStats({
          systems: 1,
          totalGeneration: 1.2,
          co2Saved: 0.9,
          offline: 0,
        })
      } catch (e) {
        console.error(e)
      }
    }

    load()
  }, [])

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t("officerMonitoringTitle")}</h1>

      {!stats && <p>{t("loadingGeneric")}</p>}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat title={t("officerMonitoringConnectedSystems")} value={stats.systems} />
          <Stat title={t("officerMonitoringTotalGeneration")} value={stats.totalGeneration} />
          <Stat title={t("officerMonitoringCo2Reduced")} value={stats.co2Saved} />
          <Stat title={t("officerMonitoringOfflineSystems")} value={stats.offline} />
        </div>
      )}
    </DashboardLayout>
  )
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}</CardContent>
    </Card>
  )
}
