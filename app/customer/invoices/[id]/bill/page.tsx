"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, ArrowLeft, FileText } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

type InvoicePayload = {
  id: string
  type: "authority_fee" | "installation" | "monthly_bill"
  description: string
  amount: number
  status: "pending" | "paid" | "overdue"
  dueDate: string
  paidAt?: string | null
  pdfUrl?: string | null
  application?: { status?: string }
}

type MonthlyBillPayload = {
  month: number
  year: number
  kwhGenerated: number
  kwhExported: number
  kwhImported: number
}

export default function InvoiceBillPage() {
  const { t } = useLanguage()
  const params = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<InvoicePayload | null>(null)
  const [monthlyBill, setMonthlyBill] = useState<MonthlyBillPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/invoices/${params.id}`, { cache: "no-store" })
        if (!res.ok) throw new Error(t("invoiceNotFound"))
        const data = await res.json()
        setInvoice(data.invoice)
        setMonthlyBill(data.monthlyBill ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadInvoice"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const netUnits = useMemo(() => {
    if (!monthlyBill) return 0
    return monthlyBill.kwhExported - monthlyBill.kwhImported
  }, [monthlyBill])

  async function handlePayNow() {
    if (!invoice) return
    setPaying(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("paymentFailed"))
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : t("paymentFailed"))
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
          {t("loadingBill")}
        </div>
      </DashboardLayout>
    )
  }

  if (!invoice || error) {
    return (
      <DashboardLayout>
        <div className="py-12 flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-red-50 text-red-500">
            <FileText className="w-8 h-8" />
          </div>
          <p className="text-slate-800 font-medium">{error ?? t("invoiceNotFound")}</p>
          <Button asChild variant="outline" className="border-slate-200">
            <Link href="/customer/invoices">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToInvoices")}
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="hover:bg-slate-100 text-slate-600">
            <Link href={`/customer/invoices`}> {/* Changed from specific invoice ID to list to avoid loop, matches intent better */}
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="rounded-full border-slate-200 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
          >
            <a href={`/api/invoices/${invoice.id}/pdf`} download>
              <Download className="w-4 h-4 mr-2" />
              {t("downloadPDF")}
            </a>
          </Button>
        </div>

        {/* Invoice Card */}
        <div className="rounded-3xl border-0 bg-white overflow-hidden shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5">
          
          {/* Header Section */}
          <div className="bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/50 px-10 py-10 relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <FileText className="w-32 h-32" />
             </div>

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">{t("account")}</p>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">{invoice.id}</h1>
              </div>
              <Badge
                className={`
                  px-3 py-1 rounded-full text-xs font-bold border-0 shadow-sm
                  ${invoice.status === "paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : invoice.status === "overdue"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                  }
                `}
                variant="secondary"
              >
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
            
            <p className="relative z-10 mt-4 text-base text-slate-600 font-medium">{invoice.description}</p>
            
            <div className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
              {t("netAccount")}
            </div>
          </div>

          {/* Body Section */}
          <div className="px-10 py-8 space-y-10 bg-white">
            
            {/* Dates & Billing Info */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-8">
                <div className="space-y-1">
                    <p className="text-sm text-slate-400 font-medium">{t("billingMonth")}</p>
                    <p className="text-xl font-bold text-slate-900">
                        {monthlyBill
                        ? `${monthlyBill.year}-${String(monthlyBill.month).padStart(2, "0")}`
                        : new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm text-slate-400 font-medium">{t("billingDate")}</p>
                    <p className="text-base font-semibold text-slate-700">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Total Amount Card */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white px-8 py-8 text-center space-y-2 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600/80">{t("totalAmountDue")}</p>
              <p className="text-5xl font-bold text-slate-900 tracking-tighter py-2">
                {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-2xl text-slate-400 font-normal">LKR</span>
              </p>
              <p className="text-xs text-slate-400 font-medium">{t("fullOrPartial")}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 px-8 py-6 h-auto text-lg transition-transform active:scale-95"
                  onClick={handlePayNow}
                  disabled={invoice.status !== "pending" || paying}
                >
                  <CreditCard className="w-5 h-5 mr-2.5" />
                  {paying ? t("processing") : t("payNow")}
                </Button>
                <Button 
                    asChild 
                    variant="outline" 
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-6 py-6 h-auto text-base"
                >
                  <a href={`/api/invoices/${invoice.id}/pdf`} download>
                    <Download className="w-5 h-5 mr-2" />
                    {t("viewEBill")}
                  </a>
                </Button>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <Row label={t("outstanding")} value={`${invoice.amount.toFixed(2)} LKR`} />
              <Row label={t("import")} value={`${monthlyBill?.kwhImported ?? 0} kWh`} />
              <Row label={t("export")} value={`${monthlyBill?.kwhExported ?? 0} kWh`} />
              <Row label={t("netUnits")} value={`${netUnits} kWh`} />
              <Row label={t("monthlyBill")} value={`${invoice.amount.toFixed(2)} LKR`} />
              <Row label={t("totalAmountDueLabel")} value={`${invoice.amount.toFixed(2)} LKR`} highlight />
            </div>

            <p className="text-center text-sm text-slate-400 pt-2">
              {t("getEBill")}{" "}
              <button className="text-emerald-600 font-semibold hover:underline decoration-2 underline-offset-2">{t("registerHere")}</button>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`
        flex items-center justify-between px-8 py-5 transition-colors
        ${highlight 
            ? "bg-slate-50 font-bold text-slate-900 border-t border-slate-200" 
            : "bg-white text-slate-600 hover:bg-slate-50/50 even:bg-slate-50/30"}
    `}>
      <span className={highlight ? "text-slate-900" : "font-medium"}>
        {label}
      </span>
      <span className={highlight ? "text-lg tracking-tight" : "font-semibold text-slate-700"}>
        {value}
      </span>
    </div>
  )
}