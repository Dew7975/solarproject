"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { useLanguage } from "@/context/LanguageContext"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  FileText
} from "lucide-react"

import type { Invoice, MonthlyBill } from "@/lib/prisma-types"

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getStatusBadge(status: string, t: (key: string) => string) {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 px-2.5 py-0.5" variant="secondary">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          {t("paid")}
        </Badge>
      )
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 px-2.5 py-0.5" variant="secondary">
          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
          {t("overdue")}
        </Badge>
      )
    default:
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 px-2.5 py-0.5" variant="secondary">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {t("pending")}
        </Badge>
      )
  }
}

function getTypeBadge(type: Invoice["type"], t: (key: string) => string) {
  const map: Record<Invoice["type"], string> = {
    authority_fee: t("authorityFee"),
    installation: t("installation"),
    monthly_bill: t("monthlyBill"),
  }

  const styles: Record<Invoice["type"], string> = {
    authority_fee: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    installation: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    monthly_bill: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  }

  return (
    <Badge variant="outline" className={`${styles[type]} border font-medium px-2.5`}>
      {map[type]}
    </Badge>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ElementType
  tone: "amber" | "emerald" | "blue"
}) {
  const tones = {
    amber: "bg-amber-100 text-amber-600 border-amber-200",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
    blue: "bg-blue-100 text-blue-600 border-blue-200",
  }

  const textColors = {
    amber: "text-amber-900",
    emerald: "text-emerald-900",
    blue: "text-blue-900",
  }

  return (
    <Card className="border-none shadow-md ring-1 ring-slate-900/5 transition-all hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${tones[tone]}`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold ${textColors[tone]}`}>
              Rs. {Math.abs(value).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type InvoiceWithStatus = Invoice & { applicationStatus?: string | null }

export default function CustomerInvoices() {
  const { t } = useLanguage()
  const [invoices, setInvoices] = useState<InvoiceWithStatus[]>([])
  const [monthlyBills, setMonthlyBills] = useState<MonthlyBill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/payments?includeMonthly=true", {
          cache: "no-store",
        })

        if (!res.ok) throw new Error(t("unableToLoadInvoices"))

        const data = await res.json()
        setInvoices(data.invoices ?? [])
        setMonthlyBills(data.monthlyBills ?? [])
      } catch {
        setError(t("unableToLoadInvoices"))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const summary = useMemo(() => {
    return {
      pending: invoices
        .filter((i) => i.status === "pending")
        .reduce((s, i) => s + i.amount, 0),
      paid: invoices
        .filter((i) => i.status === "paid")
        .reduce((s, i) => s + i.amount, 0),
      credit: monthlyBills
        .map((b) => b.amount ?? b.netAmount)
        .filter((amount) => amount < 0)
        .reduce((s, amount) => s + amount, 0),
    }
  }, [invoices, monthlyBills])

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 py-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <Receipt className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t("invoicesAndBills")}</h1>
                <p className="text-slate-500 font-medium">
                    {t("invoicesAndBillsDesc")}
                </p>
            </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SummaryCard label={t("pending")} value={summary.pending} icon={Clock} tone="amber" />
          <SummaryCard label={t("paid")} value={summary.paid} icon={CheckCircle} tone="emerald" />
          <SummaryCard label={t("netCredit")} value={summary.credit} icon={Receipt} tone="blue" />
        </div>

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="bg-slate-100/80 p-1 rounded-lg w-full sm:w-auto grid grid-cols-2 sm:flex gap-2 mb-6">
            <TabsTrigger 
                value="invoices" 
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm rounded-md px-6"
            >
                {t("invoices")}
            </TabsTrigger>
            <TabsTrigger 
                value="monthly"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm rounded-md px-6"
            >
                {t("monthlyBills")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="mt-0 space-y-4">
            <Card className="border-none shadow-md ring-1 ring-slate-900/5">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg text-slate-900">{t("invoices")}</CardTitle>
                <CardDescription className="text-slate-500">{t("invoicesDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center py-12 text-slate-400 animate-pulse">
                    {t("loadingInvoices")}
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <FileText className="w-10 h-10 opacity-20" />
                    {t("noInvoices")}
                  </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                        <div
                        key={inv.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/80 transition-colors"
                        >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-sm transition-all border border-slate-200">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono font-bold text-slate-900">{inv.id}</span>
                                    {getStatusBadge(inv.status, t)}
                                    {getTypeBadge(inv.type, t)}
                                </div>
                                <p className="text-sm text-slate-500 font-medium">
                                    {inv.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 sm:mt-0 pl-14 sm:pl-0">
                            <span className="font-bold text-lg text-slate-900 mr-2">
                            Rs. {inv.amount.toLocaleString()}
                            </span>
                            
                            <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 shadow-sm"
                            >
                            <a href={`/api/invoices/${inv.id}/pdf`} download>
                                <Download className="w-4 h-4 mr-2" />
                                {t("pdf")}
                            </a>
                            </Button>
                            
                            {inv.status === "pending" ? (
                            inv.type === "authority_fee" &&
                            !["pre_visit_approved", "site_visit_payment_completed"].includes(inv.applicationStatus ?? "") ? (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1.5" variant="outline">
                                <Clock className="w-3 h-3 mr-1.5" />
                                {t("awaitingApproval")}
                                </Badge>
                            ) : (
                                <Button 
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                                    asChild
                                >
                                <Link href={`/customer/invoices/${inv.id}`}>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    {t("pay")}
                                </Link>
                                </Button>
                            )
                            ) : null}
                        </div>
                        </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0 space-y-4">
            <Card className="border-none shadow-md ring-1 ring-slate-900/5">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg text-slate-900">{t("monthlyBills")}</CardTitle>
                <CardDescription className="text-slate-500">{t("monthlyBillsDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12 text-slate-400 animate-pulse">
                    {t("loadingBills")}
                  </div>
                ) : monthlyBills.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <FileText className="w-10 h-10 opacity-20" />
                    {t("noMonthlyBills")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monthlyBills.map((bill) => {
                        const amount = bill.amount ?? bill.netAmount
                        return (
                        <div key={bill.id} className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-50">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t("monthlyBill")}</p>
                                    <span className="text-lg font-bold text-slate-900">
                                        {new Date(bill.year, bill.month - 1).toLocaleString("default", {
                                        month: "long",
                                        })}{" "}
                                        {bill.year}
                                    </span>
                                </div>
                                <div className={`px-3 py-1 rounded-lg ${amount < 0 ? "bg-emerald-50" : "bg-slate-50"}`}>
                                    <span
                                        className={`font-bold text-lg ${
                                        amount < 0 ? "text-emerald-600" : "text-slate-700"
                                        }`}
                                    >
                                        Rs. {Math.abs(amount).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                    <Zap className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t("generatedKwh")}</p>
                                    <p className="font-bold text-slate-700">{bill.kwhGenerated}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-center">
                                    <ArrowUpRight className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                                    <p className="text-[10px] uppercase font-bold text-emerald-600/70 mb-0.5">{t("exportedKwh")}</p>
                                    <p className="font-bold text-emerald-700">{bill.kwhExported}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100 text-center">
                                    <ArrowDownLeft className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                                    <p className="text-[10px] uppercase font-bold text-amber-600/70 mb-0.5">{t("importedKwh")}</p>
                                    <p className="font-bold text-amber-700">{bill.kwhImported}</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    asChild
                                    className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-600"
                                >
                                    <a href={`/api/invoices/${bill.id}/pdf`} download>
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    {t("pdf")}
                                    </a>
                                </Button>
                            </div>
                        </div>
                        )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}