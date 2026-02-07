"use client"

import type { MonthlyBillingSummary, MeterReading } from "@/lib/data/meter-readings"
import { Badge } from "@/components/ui/badge"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, TrendingUp, Sun, Leaf, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"

type DashboardResponse = {
  readings: MeterReading[]
  monthly: MonthlyBillingSummary[]
  totals: {
    kWhGenerated: number
    kWhExported: number
    kWhImported: number
    netKWh: number
    amountDue: number
    credit: number
  }
}

const DEFAULT_DASHBOARD: DashboardResponse = {
  readings: [],
  monthly: [],
  totals: {
    kWhGenerated: 0,
    kWhExported: 0,
    kWhImported: 0,
    netKWh: 0,
    amountDue: 0,
    credit: 0,
  },
}

const CUSTOMER_ID = "CUST-001"

export default function EnergyPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse>(DEFAULT_DASHBOARD)
  const [period, setPeriod] = useState("today")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`/api/iot/measurements?customerId=${CUSTOMER_ID}&limit=60`)
        if (!response.ok) {
          throw new Error(t("unableToLoadMeterReadings"))
        }
        const data: DashboardResponse = await response.json()
        setDashboard(data)
      } catch (err) {
        console.error(err)
        setError(t("unableToLoadLatestMeterReadings"))
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const productionSeries = useMemo(
    () =>
      dashboard.readings
        .slice()
        .reverse()
        .map((reading) => ({
          time: new Date(reading.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          generated: Number(reading.kWhGenerated.toFixed(2)),
          exported: Number(reading.kWhExported.toFixed(2)),
        })),
    [dashboard.readings],
  )

  const monthlySeries = useMemo(
    () =>
      dashboard.monthly.map((summary) => ({
        month: `${summary.month} ${String(summary.year).slice(-2)}`,
        generated: Number(summary.kWhGenerated.toFixed(2)),
        imported: Number(summary.kWhImported.toFixed(2)),
        exported: Number(summary.kWhExported.toFixed(2)),
        savings: Math.max(summary.credit - summary.amountDue, 0),
        net: Number(summary.netKWh.toFixed(2)),
      })),
    [dashboard.monthly],
  )

  const displayedProduction = useMemo(() => {
    const limit = period === "today" ? 8 : period === "week" ? 14 : productionSeries.length
    return productionSeries.slice(-limit)
  }, [period, productionSeries])

  const co2Prevented = (dashboard.totals.kWhGenerated * 0.85).toFixed(0)
  const netBalance = dashboard.totals.credit - dashboard.totals.amountDue
  const recentReadings = dashboard.readings.slice(0, 6)
  const billingHighlight = dashboard.monthly.slice(-3).reverse()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("energyDashboard")}</h1>
            <p className="text-muted-foreground">{t("energyDashboardDescription")}</p>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> {t("syncingReadings")}
              </span>
            )}
            <div className="flex gap-2">
              <Button
                variant={period === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("today")}
                className={period === "today" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-transparent"}
              >
                {t("today")}
              </Button>
              <Button
                variant={period === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("week")}
                className={period === "week" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-transparent"}
              >
                {t("week")}
              </Button>
              <Button
                variant={period === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod("month")}
                className={period === "month" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-transparent"}
              >
                {t("month")}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalGenerated")}</p>
                  <p className="text-2xl font-bold text-foreground">{dashboard.totals.kWhGenerated.toFixed(1)} {t("kwh")}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t("liveFromIoT")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("gridExport")}</p>
                  <p className="text-2xl font-bold text-emerald-500">{dashboard.totals.kWhExported.toFixed(1)} {t("kwh")}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t("verifiedDevice")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("netBalance")}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {netBalance >= 0
                      ? `+${t("lkr")} ${netBalance.toLocaleString()}`
                      : `-${t("lkr")} ${Math.abs(netBalance).toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {netBalance >= 0 ? t("estimatedCredit") : t("estimatedDue")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-cyan-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("co2Prevented")}</p>
                  <p className="text-2xl font-bold text-foreground">{co2Prevented} {t("kg")}</p>
                  <p className="text-xs text-muted-foreground">{t("environmentalImpact")}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="production" className="space-y-4">
          <TabsList>
            <TabsTrigger value="production">{t("production")}</TabsTrigger>
            <TabsTrigger value="consumption">{t("consumption")}</TabsTrigger>
            <TabsTrigger value="savings">{t("savings")}</TabsTrigger>
          </TabsList>

          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">{t("energyProduction")}</CardTitle>
                <CardDescription>{t("productionDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayedProduction} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" kWh" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="generated"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.25}
                        name={t("generated")}
                      />
                      <Area
                        type="monotone"
                        dataKey="exported"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.2}
                        name={t("exported")}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consumption">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">{t("generationVsConsumption")}</CardTitle>
                <CardDescription>{t("consumptionDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" kWh" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Bar dataKey="generated" fill="#f59e0b" name={t("generated")} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="imported" fill="#06b6d4" name={t("imported")} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="exported" fill="#10b981" name={t("exported")} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">{t("monthlySavings")}</CardTitle>
                <CardDescription>{t("savingsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                        formatter={(value: number) => [`${t("lkr")} ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, t("savings")]}
                      />
                      <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981", strokeWidth: 2 }}
                        name={t("savings")}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("systemStatus")}</CardTitle>
              <CardDescription>{t("systemStatusDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">{t("inverterOutput")}</span>
                <span className="font-semibold text-emerald-500">
                  {dashboard.readings[0]?.kWhGenerated.toFixed(1) ?? "-"} {t("kwh")}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">{t("gridExportToday")}</span>
                <span className="font-semibold text-foreground">{dashboard.totals.kWhExported.toFixed(1)} {t("kwh")}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">{t("gridImportToday")}</span>
                <span className="font-semibold text-foreground">{dashboard.totals.kWhImported.toFixed(1)} {t("kwh")}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">{t("status")}</span>
                <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">
                  {t("iotFeedHealthy")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("billingImpact")}</CardTitle>
              <CardDescription>{t("billingImpactDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingHighlight.length === 0 && <p className="text-sm text-muted-foreground">{t("noBillingCycles")}</p>}
              {billingHighlight.map((summary) => (
                <div key={`${summary.year}-${summary.month}`} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{`${summary.month} ${summary.year}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {summary.netKWh >= 0
                        ? t("netImported").replace("{amount}", summary.netKWh.toFixed(1))
                        : t("netExported").replace("{amount}", Math.abs(summary.netKWh).toFixed(1))}
                    </p>
                  </div>
                  <div className="text-right">
                    {summary.credit > 0 ? (
                      <p className="text-sm font-semibold text-emerald-500">
                        {t("credit")} {t("lkr")} {summary.credit.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">
                        {t("balanceDue")} {t("lkr")} {summary.amountDue.toLocaleString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t("gen")} {summary.kWhGenerated.toFixed(1)} | {t("exp")} {summary.kWhExported.toFixed(1)} | {t("imp")} {summary.kWhImported.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">{t("recentMeterReadings")}</CardTitle>
              <CardDescription>{t("recentReadingsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReadings.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("noReadingsReceived")}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t("timestamp")}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">{t("generated")}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">{t("exported")}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">{t("imported")}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">{t("voltage")}</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">{t("current")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReadings.map((reading) => (
                        <tr key={reading.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-foreground">
                            <p className="font-medium">
                              {new Date(reading.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">{t("device")} {reading.deviceId}</p>
                          </td>
                          <td className="py-3 px-4 text-right text-foreground">{reading.kWhGenerated.toFixed(1)} {t("kwh")}</td>
                          <td className="py-3 px-4 text-right text-emerald-500">{reading.kWhExported.toFixed(1)} {t("kwh")}</td>
                          <td className="py-3 px-4 text-right text-foreground">{reading.kWhImported.toFixed(1)} {t("kwh")}</td>
                          <td className="py-3 px-4 text-right text-foreground">{reading.voltage?.toFixed(1) ?? "-"} {t("v")}</td>
                          <td className="py-3 px-4 text-right text-foreground">{reading.current?.toFixed(1) ?? "-"} {t("a")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("recentActivity")}</CardTitle>
              <CardDescription>{t("recentActivityDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReadings.length === 0 && <p className="text-sm text-muted-foreground">{t("waitingForDeviceData")}</p>}
              {recentReadings.map((reading) => {
                const exported = reading.kWhExported > 0
                const time = new Date(reading.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                return (
                  <div key={`${reading.id}-activity`} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${exported ? "bg-emerald-500" : "bg-cyan-500"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {exported ? t("gridExportRecorded") : t("energyImported")}
                        </p>
                        <p className="text-xs text-muted-foreground">{time}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${exported ? "text-emerald-500" : "text-foreground"}`}>
                      {exported ? `${reading.kWhExported.toFixed(1)} ${t("kwh")}` : `${reading.kWhImported.toFixed(1)} ${t("kwh")}`}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
