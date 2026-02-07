"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, Sun, Leaf, TrendingUp, Zap, FileText } from "lucide-react"
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
  Legend,
} from "recharts"

type MeterReading = {
  month: number
  year: number
  kwhGenerated: number
  kwhExported: number
  kwhImported: number
}

type MonthlyBill = {
  month: number
  year: number
  amount?: number
  netAmount?: number
}

export default function CustomerReports() {
  const [period, setPeriod] = useState("6months")
  const [readings, setReadings] = useState<MeterReading[]>([])
  const [monthlyBills, setMonthlyBills] = useState<MonthlyBill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    async function load() {
      try {
        const [readingsRes, billsRes] = await Promise.all([
          fetch("/api/meter-readings", { cache: "no-store" }),
          fetch("/api/payments?includeMonthly=true", { cache: "no-store" }),
        ])
        if (!readingsRes.ok) throw new Error(t("unableToLoadMeterReadings"))
        const readingsData = await readingsRes.json()
        const billsData = billsRes.ok ? await billsRes.json() : { monthlyBills: [] }
        setReadings(readingsData.readings ?? [])
        setMonthlyBills(billsData.monthlyBills ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadReports"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const monthWindow = period === "1month" ? 1 : period === "3months" ? 3 : period === "1year" ? 12 : 6
  const now = new Date()
  const months = useMemo(() => {
    const result: { key: string; label: string; month: number; year: number }[] = []
    for (let i = monthWindow - 1; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      result.push({
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: date.toLocaleString("default", { month: "short" }),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      })
    }
    return result
  }, [monthWindow, now])

  const monthlyData = useMemo(() => {
    return months.map((m) => {
      const reading = readings.find((r) => r.month === m.month && r.year === m.year)
      const bill = monthlyBills.find((b) => b.month === m.month && b.year === m.year)
      const amount = bill?.amount ?? bill?.netAmount ?? 0
      const saved = amount < 0 ? Math.abs(amount) : 0
      return {
        month: m.label,
        generated: reading?.kwhGenerated ?? 0,
        exported: reading?.kwhExported ?? 0,
        imported: reading?.kwhImported ?? 0,
        saved,
      }
    })
  }, [months, readings, monthlyBills])

  const stats = useMemo(() => {
    const totalGenerated = readings.reduce((sum, r) => sum + r.kwhGenerated, 0)
    const totalExported = readings.reduce((sum, r) => sum + r.kwhExported, 0)
    const totalImported = readings.reduce((sum, r) => sum + r.kwhImported, 0)
    const totalSavings = monthlyBills
      .map((b) => b.amount ?? b.netAmount ?? 0)
      .filter((amount) => amount < 0)
      .reduce((sum, amount) => sum + Math.abs(amount), 0)
    const co2Prevented = Number(((totalGenerated * 0.85) / 1000).toFixed(2))
    const treesEquivalent = Math.round(co2Prevented * 17)
    return {
      totalGenerated,
      totalExported,
      totalImported,
      totalSavings,
      co2Prevented,
      treesEquivalent,
    }
  }, [readings, monthlyBills])

  // Custom Colors for Charts
  const colors = {
    generated: "#10b981", // Emerald 500
    exported: "#f59e0b",  // Amber 500
    imported: "#94a3b8",  // Slate 400
    savings: "#059669",   // Emerald 600
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("reportsAnalytics")}</h1>
            <p className="text-slate-500 font-medium">{t("reportsSubtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 border-slate-200 shadow-sm focus:ring-emerald-500">
                <SelectValue placeholder={t("selectPeriod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">{t("lastMonth")}</SelectItem>
                <SelectItem value="3months">{t("last3Months")}</SelectItem>
                <SelectItem value="6months">{t("last6Months")}</SelectItem>
                <SelectItem value="1year">{t("lastYear")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm" asChild>
              <a href="/api/reports/customer/pdf" download>
                <Download className="w-4 h-4 mr-2" />
                {t("exportPdf")}
              </a>
            </Button>
          </div>
        </div>

        {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
            </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-md ring-1 ring-slate-900/5 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center border border-amber-100 shadow-sm shrink-0">
                  <Sun className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t("totalGenerated")}</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalGenerated.toLocaleString()} <span className="text-sm font-medium text-slate-400">{t("kwh")}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md ring-1 ring-slate-900/5 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center border border-emerald-100 shadow-sm shrink-0">
                  <Zap className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t("netExported")}</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {(stats.totalExported - stats.totalImported).toLocaleString()} <span className="text-sm font-medium text-emerald-600/60">{t("kwh")}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md ring-1 ring-slate-900/5 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t("totalSavings")}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    <span className="text-sm font-medium text-slate-400 mr-1">{t("rs")}</span>
                    {stats.totalSavings.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md ring-1 ring-slate-900/5 hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center border border-green-100 shadow-sm shrink-0">
                  <Leaf className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t("co2Prevented")}</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.co2Prevented} <span className="text-sm font-medium text-slate-400">{t("tons")}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Energy Generation Chart */}
          <Card className="shadow-lg border-0 ring-1 ring-slate-100">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
              <CardTitle className="text-slate-800 flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                {t("energyProduction")}
              </CardTitle>
              <CardDescription className="text-slate-500">{t("energyProductionDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="h-80 flex items-center justify-center text-slate-400 animate-pulse">{t("loadingChart")}</div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          padding: "12px"
                        }}
                        itemStyle={{ fontSize: "12px", fontWeight: "600", paddingBottom: "2px" }}
                        labelStyle={{ color: "#64748b", marginBottom: "8px", fontSize: "12px" }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Legend 
                        iconType="circle" 
                        iconSize={8}
                        wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} 
                      />
                      <Bar dataKey="generated" fill={colors.generated} name={t("generatedKwh")} radius={[4, 4, 0, 0]} animationDuration={1000} />
                      <Bar dataKey="exported" fill={colors.exported} name={t("exportedKwh")} radius={[4, 4, 0, 0]} animationDuration={1000} animationBegin={200} />
                      <Bar dataKey="imported" fill={colors.imported} name={t("importedKwh")} radius={[4, 4, 0, 0]} animationDuration={1000} animationBegin={400} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Chart */}
          <Card className="shadow-lg border-0 ring-1 ring-slate-100">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
              <CardTitle className="text-slate-800 flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                {t("monthlySavings")}
              </CardTitle>
              <CardDescription className="text-slate-500">{t("monthlySavingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="h-80 flex items-center justify-center text-slate-400 animate-pulse">{t("loadingChart")}</div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.savings} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={colors.savings} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          padding: "12px"
                        }}
                        itemStyle={{ color: colors.savings, fontSize: "13px", fontWeight: "bold" }}
                        labelStyle={{ color: "#64748b", marginBottom: "8px", fontSize: "12px" }}
                        formatter={(value: number) => [`${t("rs")} ${value.toLocaleString()}`, t("savings")]}
                      />
                      <Area
                        type="monotone"
                        dataKey="saved"
                        stroke={colors.savings}
                        strokeWidth={3}
                        fill="url(#colorSaved)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact */}
        <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-100">
            <CardHeader className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white pb-8">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Leaf className="w-6 h-6 text-green-400" />
                {t("environmentalImpact")}
              </CardTitle>
              <CardDescription className="text-green-100/80">{t("environmentalImpactDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="relative -mt-4 bg-white rounded-t-3xl pt-8 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="group text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{stats.co2Prevented}</p>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">{t("tons")}</p>
                  <p className="text-sm text-slate-500 font-medium">{t("co2EmissionsPrevented")}</p>
                  <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-50 pt-3">{t("co2CalculationFormula")}</p>
                </div>

                <div className="group text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🌳</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{stats.treesEquivalent}</p>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">{t("treesEquivalent")}</p>
                  <p className="text-sm text-slate-500 font-medium">{t("treesSavedDescription") ?? "Equivalent trees planted"}</p>
                  <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-50 pt-3">{t("treeAbsorptionRate")}</p>
                </div>

                <div className="group text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{stats.totalGenerated.toLocaleString()}</p>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">{t("kwh")}</p>
                  <p className="text-sm text-slate-500 font-medium">{t("cleanKwhGenerated")}</p>
                  <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-50 pt-3">{t("renewableEnergyImpact")}</p>
                </div>

              </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}