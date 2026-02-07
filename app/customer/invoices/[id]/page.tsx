"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  ArrowLeft,
  Download,
  CreditCard,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

import type {
  Invoice,
  MonthlyBill,
  PaymentTransaction,
} from "@/lib/prisma-types"

type InvoiceWithStatus = Invoice & { application?: { status?: string } }

function getStatusBadge(status: string, t: (key: string) => string) {
  if (status === "paid") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-3 py-1" variant="secondary">
        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
        {t("paid")}
      </Badge>
    )
  }

  if (status === "overdue") {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 px-3 py-1" variant="secondary">
        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
        {t("overdue")}
      </Badge>
    )
  }

  return (
    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-3 py-1" variant="secondary">
      <Clock className="w-3.5 h-3.5 mr-1.5" />
      {t("pending")}
    </Badge>
  )
}

export default function InvoiceDetailPage() {
  const { t } = useLanguage()
  const params = useParams<{ id: string }>()

  const [invoice, setInvoice] = useState<InvoiceWithStatus | null>(null)
  const [payments, setPayments] = useState<PaymentTransaction[]>([])
  const [monthlyBill, setMonthlyBill] = useState<MonthlyBill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [autoMarking, setAutoMarking] = useState(false)
  const searchParams = useSearchParams()
  const hasAutoMarkedRef = useRef(false)

  async function loadInvoice() {
    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(t("invoiceNotFound"))
      }

      const data = await res.json()
      setInvoice(data.invoice)
      setPayments(data.payments ?? [])
      setMonthlyBill(data.monthlyBill ?? null)
    } catch {
      setError(t("unableToLoadInvoice"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoice()
  }, [params.id])

  useEffect(() => {
    const success = searchParams.get("success")
    if (!invoice || invoice.status === "paid" || success !== "1" || hasAutoMarkedRef.current) {
      return
    }

    async function markPaidAfterSuccess() {
      // FIX: Explicitly check invoice again inside async function to satisfy TypeScript
      if (!invoice) return

      setAutoMarking(true)
      setError(null)
      hasAutoMarkedRef.current = true
      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceId: invoice.id,
            amount: invoice.amount,
            type: invoice.type,
            description: invoice.description,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || t("unableToConfirmPayment"))
        }

        await loadInvoice()
        hasAutoMarkedRef.current = true
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToConfirmPayment"))
      } finally {
        setAutoMarking(false)
      }
    }

    markPaidAfterSuccess()
  }, [invoice, searchParams])

  const paidTotal = useMemo(() => {
    return payments
      .filter((p) => p.status === "succeeded" || p.status === "verified")
      .reduce((sum, p) => sum + p.amount, 0)
  }, [payments])

  const balanceDue = useMemo(() => {
    if (!invoice) return 0
    return invoice.amount - paidTotal
  }, [invoice, paidTotal])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-12 flex items-center justify-center text-muted-foreground animate-pulse">
          {t("loadingInvoice")}
        </div>
      </DashboardLayout>
    )
  }

  if (error || !invoice) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-12 space-y-4 flex flex-col items-center">
          <p className="text-destructive font-medium">{error ?? t("invoiceNotFound")}</p>
          <Link href="/customer/invoices">
            <Button variant="outline" className="shadow-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToInvoices")}
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  async function handlePayNow() {
    if (!invoice) return
    setPaying(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("paymentFailed"))
      }

      const data = await res.json().catch(() => ({}))
      if (!data.url) {
        throw new Error(t("paymentLinkMissing"))
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : t("paymentFailed"))
    } finally {
      setPaying(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 py-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-4 flex-wrap mb-2">
                <Link href="/customer/invoices">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-slate-200">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                    </Button>
                </Link>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {invoice.id}
              </h1>
              {getStatusBadge(invoice.status, t)}
            </div>
            <p className="text-slate-500 font-medium ml-14 capitalize">
              {invoice.type.replace("_", " ")}
            </p>
          </div>

          <div className="flex gap-3 ml-14 sm:ml-0">
            <Button variant="outline" asChild className="border-slate-200 text-slate-600 hover:bg-slate-50">
              <a href={`/api/invoices/${invoice.id}/pdf`} download>
                <Download className="w-4 h-4 mr-2" />
                {t("downloadPDF")}
              </a>
            </Button>
          </div>
        </div>

        {/* Invoice Summary */}
        <Card className="border-none shadow-lg ring-1 ring-slate-900/5 bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-900">{t("invoiceSummary")}</CardTitle>
            <CardDescription className="text-slate-500">{t("invoiceSummaryDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("amount")}</p>
                <p className="text-2xl font-bold text-slate-900">
                  Rs. {invoice.amount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("dueDate")}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold text-slate-700">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("paid")}</p>
                <p className="text-xl font-semibold text-emerald-600">
                  Rs. {paidTotal.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="font-semibold text-slate-700">{t("balanceDue")}</p>
              <p className={`text-2xl font-bold ${balanceDue > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                Rs. {balanceDue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        {payments.length > 0 && (
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-slate-400" />
                {t("paymentHistory")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {payments.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                      i !== payments.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">
                        {p.paymentMethod ?? t("onlinePayment")}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {t("ref")}: {p.reference ?? p.id}
                        </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      Rs. {p.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Monthly Bill Details */}
        {monthlyBill && (
          <Card className="shadow-md border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle>{t("monthlyBillDetails")}</CardTitle>
              <CardDescription className="text-emerald-600 font-medium">
                {monthlyBill.month}/{monthlyBill.year}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <Zap className="w-4 h-4" />
                    <p className="text-xs font-semibold uppercase">{t("generatedKwh")}</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {monthlyBill.kwhGenerated} <span className="text-sm font-normal text-slate-500">kWh</span>
                </p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <p className="text-xs font-semibold uppercase">{t("exportedKwh")}</p>
                </div>
                <p className="text-2xl font-bold text-emerald-700">
                  {monthlyBill.kwhExported} <span className="text-sm font-normal text-emerald-600/70">kWh</span>
                </p>
              </div>
              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-2 text-amber-600">
                     <ArrowDownLeft className="w-4 h-4" />
                    <p className="text-xs font-semibold uppercase">{t("importedKwh")}</p>
                </div>
                <p className="text-2xl font-bold text-amber-700">
                  {monthlyBill.kwhImported} <span className="text-sm font-normal text-amber-600/70">kWh</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {invoice.status === "pending" &&
          balanceDue > 0 &&
          (invoice.type !== "authority_fee" ||
            ["pre_visit_approved", "site_visit_payment_completed"].includes(
              invoice.application?.status ?? "",
            )) && (
          <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-emerald-800">{t("actions")}</CardTitle>
              <CardDescription>{t("completePayment")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-md shadow-emerald-500/20 text-lg py-6 h-auto"
                onClick={handlePayNow}
                disabled={paying || autoMarking}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {paying || autoMarking ? t("processing") : t("payNow")}
              </Button>
            </CardContent>
          </Card>
        )}
        
        {invoice.status === "pending" &&
          balanceDue > 0 &&
          invoice.type === "authority_fee" &&
          !["pre_visit_approved", "site_visit_payment_completed"].includes(
            invoice.application?.status ?? "",
          ) && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {t("paymentLocked")}
                </CardTitle>
                <CardDescription className="text-amber-700/80">
                  {t("siteVisitFeeLocked")}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
      </div>
    </DashboardLayout>
  )
}