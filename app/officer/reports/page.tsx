"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Users, Zap, Building2 } from "lucide-react"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function OfficerReports() {
  const { t } = useLanguage()

  const monthlyData = [
    { month: t("officerReportsMonthJul"), applications: 45, installations: 38, energy: 520 },
    { month: t("officerReportsMonthAug"), applications: 52, installations: 42, energy: 580 },
    { month: t("officerReportsMonthSep"), applications: 48, installations: 45, energy: 620 },
    { month: t("officerReportsMonthOct"), applications: 61, installations: 52, energy: 680 },
    { month: t("officerReportsMonthNov"), applications: 55, installations: 48, energy: 720 },
    { month: t("officerReportsMonthDec"), applications: 68, installations: 55, energy: 780 },
    { month: t("officerReportsMonthJan"), applications: 72, installations: 58, energy: 850 },
  ]

  const regionData = [
    { name: t("officerReportsWesternProvince"), value: 45, color: "#10b981" },
    { name: t("officerReportsCentralProvince"), value: 20, color: "#06b6d4" },
    { name: t("officerReportsSouthernProvince"), value: 18, color: "#f59e0b" },
    { name: t("officerReportsOther"), value: 17, color: "#6366f1" },
  ]

  const installerPerformance = [
    { name: t("officerReportsInstallerSunPower"), installations: 28, rating: 4.8 },
    { name: t("officerReportsInstallerGreenTech"), installations: 24, rating: 4.6 },
    { name: t("officerReportsInstallerEcoSolar"), installations: 21, rating: 4.7 },
    { name: t("officerReportsInstallerBrightEnergy"), installations: 18, rating: 4.5 },
    { name: t("officerReportsInstallerSolarMax"), installations: 15, rating: 4.4 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("officerReportsTitle")}</h1>
            <p className="text-muted-foreground">{t("officerReportsSubtitle")}</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" />
            {t("officerReportsExport")}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerReportsTotalApplications")}</p>
                  <p className="text-2xl font-bold text-foreground">401</p>
                  <p className="text-xs text-emerald-500">+12% {t("officerReportsFromLastMonth")}</p>
                </div>
                <FileText className="w-8 h-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerReportsActiveCustomers")}</p>
                  <p className="text-2xl font-bold text-foreground">338</p>
                  <p className="text-xs text-emerald-500">+8% {t("officerReportsFromLastMonth")}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerReportsTotalEnergy")}</p>
                  <p className="text-2xl font-bold text-foreground">4,750</p>
                  <p className="text-xs text-emerald-500">+15% {t("officerReportsFromLastMonth")}</p>
                </div>
                <Zap className="w-8 h-8 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerReportsVerifiedInstallers")}</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-xs text-emerald-500">+2 {t("officerReportsThisMonth")}</p>
                </div>
                <Building2 className="w-8 h-8 text-indigo-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("officerReportsApplicationsInstallations")}</CardTitle>
              <CardDescription>{t("officerReportsMonthlyTrend")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
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
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stackId="1"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                      name={t("officerReportsApplications")}
                    />
                    <Area
                      type="monotone"
                      dataKey="installations"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name={t("officerReportsInstallations")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("officerReportsRegionalDistribution")}</CardTitle>
              <CardDescription>{t("officerReportsByProvince")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {regionData.map((region) => (
                  <div key={region.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                    <span className="text-sm text-muted-foreground">
                      {region.name} ({region.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t("officerReportsTopInstallerPerformance")}</CardTitle>
            <CardDescription>{t("officerReportsInstallationCount")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={installerPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="installations" fill="#10b981" radius={[0, 4, 4, 0]} name={t("officerReportsInstallationCountLabel")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t("officerReportsEnergyGenerationTrend")}</CardTitle>
            <CardDescription>{t("officerReportsEnergyToGrid")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
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
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                    name={t("officerReportsEnergyMWh")}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
