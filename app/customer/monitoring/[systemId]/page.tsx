"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Leaf, Thermometer, Activity } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

type PvData = {
  date: string
  energyGeneratedWh: number
  energyExportedWh: number
  peakPowerW: number
  currentPowerW: number
  energyUsedWh: number
  peakTime: string
  weather: string
  temperatureMin: number
  temperatureMax: number
}

export default function CustomerMonitoringPage() {
  const { systemId } = useParams()
  const [data, setData] = useState<PvData | null>(null)
  const [status, setStatus] = useState<"online" | "offline">("offline")
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  async function loadData() {
    try {
      const res = await fetch(`/api/pvoutput/${systemId}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        setStatus("offline")
        return
      }

      const json = await res.json()
      setData(json)
      setStatus("online")
    } catch {
      setStatus("offline")
    } finally {
      setLoading(false)
    }
  }

 useEffect(() => {
  let active = true;

  async function poll() {
    try {
      const res = await fetch(`/api/pvoutput/${systemId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setStatus("offline");
        return;
      }

      const json = await res.json();
      if (!active) return;

      setData(json);
      setStatus(json.live ? "online" : "offline");
      setLoading(false);
    } catch {
      setStatus("offline");
    }
  }

  poll(); // initial load
  const interval = setInterval(poll, 2000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}, [systemId]);
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20 text-muted-foreground">
          {t("loadingLiveSolarData")}
        </div>
      </DashboardLayout>
    )
  }

  const energyKwh = (data?.energyGeneratedWh || 0) / 1000
  const co2SavedKg = energyKwh * 0.82 // Sri Lanka grid factor

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {t("solarSystem")} #{systemId}
          </h1>
          <Badge
            variant="secondary"
            className={
              status === "online"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }
          >
            {status === "online" ? t("liveData") : t("lastKnownData")}
          </Badge>
        </div>

        {status === "offline" && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-700">
            {t("liveDataUnavailable")}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InfoCard
            title={t("currentPower")}
            value={`${data?.currentPowerW ?? 0} ${t("wattsShort")}`}
            icon={<Zap />}
          />

          <InfoCard
            title={t("energyToday")}
            value={`${energyKwh.toFixed(2)} ${t("kwh")}`}
            icon={<Activity />}
          />

          <InfoCard
            title={t("co2Prevented")}
            value={`${co2SavedKg.toFixed(2)} ${t("kg")}`}
            icon={<Leaf />}
          />

          <InfoCard
            title={t("temperature")}
            value={`${data?.temperatureMin ?? "-"}°C – ${
              data?.temperatureMax ?? "-"
            }°C`}
            icon={<Thermometer />}
          />
        </div>

        {/* DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>{t("systemDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Detail label={t("peakPower")}>
              {data?.peakPowerW ?? t("notAvailable")} {t("wattsShort")}
            </Detail>
            <Detail label={t("peakTime")}>
              {data?.peakTime ?? t("notAvailable")}
            </Detail>
            <Detail label={t("weather")}>
              {data?.weather ?? t("notAvailable")}
            </Detail>
            <Detail label={t("energyUsed")}>
              {data?.energyUsedWh ?? 0} {t("wattHoursShort")}
            </Detail>
            <Detail label={t("energyExported")}>
              {data?.energyExportedWh ?? 0} {t("wattHoursShort")}
            </Detail>
            <Detail label={t("date")}>
              {data?.date ?? t("notAvailable")}
            </Detail>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

/* ---------------- components ---------------- */

function InfoCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="text-emerald-500">{icon}</div>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {value}
      </CardContent>
    </Card>
  )
}

function Detail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{children}</p>
    </div>
  )
}
