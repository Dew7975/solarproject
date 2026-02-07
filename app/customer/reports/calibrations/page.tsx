"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext"
import { motion } from "framer-motion"
import {
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  TrendingUp,
  Shield,
  FileText,
} from "lucide-react"

type Calibration = {
  id: string
  scheduledAt: string
  completedAt?: string | null
  status: "SCHEDULED" | "COMPLETED"
  recommendations?: string | null
  nextScheduledAt?: string | null
}

const TZ = "Asia/Colombo"

function fmt(iso?: string | null) {
  if (!iso) return "-"
  return new Intl.DateTimeFormat("en-LK", {
    timeZone: TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso))
}

function countdownTo(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return "Due now"

  const minutes = Math.ceil(diff / 60000)
  const days = Math.floor(minutes / (60 * 24))
  const hours = Math.floor((minutes % (60 * 24)) / 60)
  const mins = minutes % 60

  if (days > 0) return `Due in ${days}d ${hours}h`
  if (hours > 0) return `Due in ${hours}h ${mins}m`
  return `Due in ${mins}m`
}

export default function CustomerCalibrationsPage() {
  const { t } = useLanguage()

  const tf = (key: string, fallback: string) => {
    const v = t(key as any)
    return v === key ? fallback : v
  }

  const [calibrations, setCalibrations] = useState<Calibration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const reload = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/calibrations", { cache: "no-store" })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setCalibrations([])
        setError(data?.error || "Failed to load calibrations")
        return
      }

      setCalibrations(data.calibrations || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load calibrations")
      setCalibrations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()

    // Optional: auto-refresh when user returns to tab
    const onFocus = () => reload()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const upcoming = useMemo(
    () =>
      calibrations
        .filter((c) => c.status === "SCHEDULED")
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        ),
    [calibrations]
  )

  const completed = useMemo(
    () =>
      calibrations
        .filter((c) => c.status === "COMPLETED")
        .sort(
          (a, b) =>
            new Date(b.completedAt || b.scheduledAt).getTime() -
            new Date(a.completedAt || a.scheduledAt).getTime()
        ),
    [calibrations]
  )

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-emerald-100 p-8 shadow-sm"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-green-100/50 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="flex items-start sm:items-center gap-6">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100/50 text-emerald-600">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-emerald-950 tracking-tight">
                  {tf("maintenanceAndCalibration", "Maintenance & Calibration")}
                </h1>
                <p className="text-emerald-800/80 font-medium max-w-2xl leading-relaxed">
                  {tf("calirationNote", "Track your system calibrations and maintenance schedules.")}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={reload} disabled={loading} className="bg-white/80">
              {tf("refresh", "Refresh")}
            </Button>
          </div>
        </motion.div>

        {error && (
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            icon={CheckCircle2}
            label={tf("completed", "Completed")}
            value={completed.length}
            color="emerald"
            delay={0.1}
          />
          <StatsCard
            icon={Clock}
            label={tf("scheduled", "Scheduled")}
            value={upcoming.length}
            color="amber"
            delay={0.2}
          />
          <StatsCard
            icon={TrendingUp}
            label={tf("totalRecords", "Total Records")}
            value={calibrations.length}
            color="blue"
            delay={0.3}
          />
        </div>

        {/* Main */}
        {loading ? (
          <Card className="border-none shadow-sm bg-white/50">
            <CardContent className="p-12 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                {tf("loadingCalibrations", "Loading calibrations...")}
              </p>
            </CardContent>
          </Card>
        ) : calibrations.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <Calendar className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {tf("NoCalibrationRecordsYet", "No calibration records yet")}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {tf("noCalibrationRecords", "Your calibration history will appear here once scheduled.")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* UPCOMING */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                {tf("upcoming", "Upcoming")}
              </h2>

              {upcoming.length === 0 ? (
                <Card className="border-none bg-slate-50">
                  <CardContent className="p-6 text-slate-600 text-sm">
                    {tf("noUpcoming", "No upcoming calibrations.")}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {upcoming.map((c, index) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <Card className="relative overflow-hidden border-0 shadow-sm ring-1 ring-amber-100 bg-white">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
                        <CardContent className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                          <div className="lg:w-1/3 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              {tf("upcomingCalibration", "Upcoming Calibration")}
                            </p>

                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                              <div>
                                <p className="text-lg font-bold text-slate-900">
                                  {fmt(c.scheduledAt)}
                                </p>
                                <p className="text-sm text-amber-700 font-semibold">
                                  {countdownTo(c.scheduledAt)}
                                </p>
                              </div>
                            </div>

                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200 rounded-full w-fit"
                            >
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {tf("scheduled", "Scheduled")}
                            </Badge>
                          </div>

                          <div className="lg:flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {tf("scheduleInfo", "Schedule info")}
                                </p>
                                <p className="text-sm text-slate-700">
                                  {tf("actionRequired", "No action required from you.")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* COMPLETED */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                {tf("completed", "Completed")}
              </h2>

              {completed.length === 0 ? (
                <Card className="border-none bg-slate-50">
                  <CardContent className="p-6 text-slate-600 text-sm">
                    {tf("noCompleted", "No completed calibrations yet.")}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {completed.map((c, index) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <Card className="relative overflow-hidden border-0 shadow-sm ring-1 ring-emerald-100 bg-white">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />

                        <CardContent className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                          <div className="lg:w-1/3 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              {tf("completedCalibration", "Completed Calibration")}
                            </p>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>
                                  <b>{tf("scheduled", "Scheduled")}:</b> {fmt(c.scheduledAt)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>
                                  <b>{tf("completedOn", "Completed on")}:</b> {fmt(c.completedAt)}
                                </span>
                              </div>
                            </div>

                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full w-fit"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              {tf("completed", "Completed")}
                            </Badge>
                          </div>

                          <div className="lg:flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                            {c.recommendations ? (
                              <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-bold text-amber-900 mb-1">
                                    {tf("recommendations", "Recommendations")}
                                  </p>
                                  <p className="text-sm text-amber-800/80">{c.recommendations}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500">
                                {tf("noRecommendations", "No recommendations")}
                              </p>
                            )}
                          </div>

                          <div className="lg:w-1/5 flex items-center justify-end">
                            <Button
                              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
                              onClick={() => window.open(`/api/calibrations/${c.id}/pdf`, "_blank")}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              {tf("viewReport", "View report")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">
                {tf("whyCalibrationMatters", "Why Calibration Matters")}
              </h3>
              <p className="text-sm text-blue-800/70 leading-relaxed max-w-3xl">
                {tf("caliDes", "Regular calibration ensures optimal performance and safety.")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: any
  label: string
  value: number
  color: "emerald" | "amber" | "blue"
  delay: number
}) {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="border-none shadow-md ring-1 ring-slate-900/5 hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${colors[color]} bg-opacity-50`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}