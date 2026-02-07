"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Download, CheckCircle, Clock, Zap, CreditCard, TrendingUp, FileText } from "lucide-react"
import type { Invoice, MonthlyBill } from "@/lib/prisma-types"

export default function OfficerBillingPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [monthlyBills, setMonthlyBills] = useState<MonthlyBill[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [invoiceSaving, setInvoiceSaving] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({
    applicationId: "",
    type: "authority_fee",
    amount: "",
    dueDate: "",
    description: "",
  })
  const [quickInvoice, setQuickInvoice] = useState<{
    applicationId: string
    amount: number
    description: string
  } | null>(null)

  const downloadInvoicePdf = (invoice: Invoice) => {
    const pdfUrl = invoice.pdfUrl ?? `/api/invoices/${invoice.id}/pdf`
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `invoice-${invoice.id}.pdf`
    link.rel = "noopener"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const loadBilling = async () => {
    try {
      const res = await fetch("/api/payments?includeMonthly=true", {
        cache: "no-store",
      })
      if (!res.ok) throw new Error(t("officerBillingUnableToLoad"))
      const data = await res.json()
      setMonthlyBills(data.monthlyBills ?? [])
      setInvoices(data.invoices ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t("officerBillingUnableToLoad"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBilling()
  }, [])

  const billingRecords = useMemo(
    () =>
      monthlyBills.map((bill) => {
        const amount = bill.amount ?? bill.netAmount
        const existingInvoice =
          bill.invoiceId || bill.pdfUrl
            ? ({
                id: bill.invoiceId ?? bill.id,
                pdfUrl: bill.pdfUrl,
              } as Invoice)
            : invoices.find((inv) => inv.id === bill.invoiceId || inv.id === bill.id)
        return {
          ...bill,
          amount,
          period: `${bill.month} ${bill.year}`,
          invoice: existingInvoice,
          isCredit: amount < 0,
          applicationId: bill.applicationId ?? t("notAvailable"),
          meterReadingId: bill.meterReadingId ?? t("notAvailable"),
        }
      }),
    [monthlyBills, invoices, t],
  )

  const filteredRecords = billingRecords.filter((r) => {
    const matchesSearch =
      r.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.applicationId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.invoice?.id || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && r.status === "pending") ||
      (activeTab === "credit" && r.isCredit) ||
      (activeTab === "paid" && r.status === "paid")
    return matchesSearch && matchesTab
  })

  const totalCredits = billingRecords.filter((r) => r.isCredit).reduce((sum, r) => sum + Math.abs(r.amount), 0)
  const totalPending = billingRecords.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0)
  const totalNetExport = billingRecords.reduce((sum, r) => sum + Math.max(0, r.kwhExported - r.kwhImported), 0)
  const isInvoiceFormReady =
    invoiceForm.applicationId.trim() !== "" &&
    invoiceForm.amount.trim() !== "" &&
    Number(invoiceForm.amount) > 0 &&
    invoiceForm.dueDate.trim() !== "" &&
    invoiceForm.description.trim() !== ""
  const isQuickInvoiceReady =
    !!quickInvoice &&
    isInvoiceFormReady &&
    String(quickInvoice.applicationId).trim() !== "" &&
    Number(quickInvoice.amount) > 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("officerBillingTitle")}</h1>
            <p className="text-muted-foreground">
              {t("officerBillingSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-transparent"
              onClick={() => {
                const dueDate = new Date()
                dueDate.setDate(dueDate.getDate() + 14)
                setInvoiceForm((prev) => ({
                  ...prev,
                  dueDate: prev.dueDate || dueDate.toISOString().split("T")[0],
                }))
                setInvoiceDialogOpen(true)
              }}
            >
              {t("officerBillingGenerateInvoice")}
            </Button>
            <Button variant="outline" className="bg-transparent" asChild>
              <a href="/api/reports/officer/billing/pdf" download>
                <Download className="w-4 h-4 mr-2" />
                {t("officerBillingExportPDF")}
              </a>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <a href="/api/reports/officer/billing/csv" download>
                <Download className="w-4 h-4 mr-2" />
                {t("officerBillingExportCSV")}
              </a>
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerBillingTotalMonthlyBills")}</p>
                  <p className="text-2xl font-bold text-foreground">{billingRecords.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerBillingCustomerCredits")}</p>
                  <p className="text-2xl font-bold text-emerald-500">LKR {totalCredits.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerBillingPendingCollection")}</p>
                  <p className="text-2xl font-bold text-amber-500">LKR {totalPending.toLocaleString()}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officerBillingNetGridExport")}</p>
                  <p className="text-2xl font-bold text-foreground">{totalNetExport} {t("officerBillingKWH")}</p>
                </div>
                <Zap className="w-8 h-8 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-foreground">{t("officerBillingRecordsTitle")}</CardTitle>
                <CardDescription>
                  {t("officerBillingRecordsDescription")}
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("officerBillingSearch")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t("officerBillingAll")} ({billingRecords.length})</TabsTrigger>
                <TabsTrigger value="credit">{t("officerBillingCredits")} ({billingRecords.filter((r) => r.isCredit).length})</TabsTrigger>
                <TabsTrigger value="pending">{t("officerBillingPending")} ({billingRecords.filter((r) => r.status === "pending").length})</TabsTrigger>
                <TabsTrigger value="paid">{t("officerBillingPaid")} ({billingRecords.filter((r) => r.status === "paid").length})</TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="py-10 text-center text-muted-foreground">{t("officerBillingLoadingRecords")}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingApplication")}</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingPeriod")}</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingMeterReading")}</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingNet")}</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingAmount")}</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingInvoice")}</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">{t("officerBillingStatus")}</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-2">
                            <p className="font-medium text-foreground">{record.applicationId}</p>
                            <p className="text-xs text-muted-foreground">{t("officerBillingCustomer")} {record.customerId}</p>
                          </td>
                          <td className="py-3 px-2 text-foreground">{record.period}</td>
                          <td className="py-3 px-2 text-foreground">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              {record.meterReadingId}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className={record.kwhExported - record.kwhImported >= 0 ? "text-emerald-500" : "text-amber-500"}>
                              {record.kwhExported - record.kwhImported >= 0 ? "+" : ""}
                              {record.kwhExported - record.kwhImported} kWh
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {record.isCredit ? (
                              <span className="text-emerald-500">+LKR {Math.abs(record.amount).toLocaleString()}</span>
                            ) : (
                              <span className="text-foreground">LKR {record.amount.toLocaleString()}</span>
                            )}
                          </td>
                        <td className="py-3 px-2">
                          {record.invoice ? (
                            <div className="flex flex-col gap-1">
                              <Link
                                href={`/customer/invoices/${record.invoice.id}`}
                                className="text-sm text-emerald-600 hover:underline"
                              >
                                {record.invoice.id}
                              </Link>
                              <a
                                href={record.invoice.pdfUrl ?? `/api/invoices/${record.invoice.id}/pdf`}
                                download
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                {t("officerBillingDownloadPDF")}
                              </a>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-muted-foreground">{t("officerBillingNotGenerated")}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-fit bg-transparent"
                                onClick={() => {
                                  const dueDate = new Date()
                                  dueDate.setDate(dueDate.getDate() + 14)
                                  const amount = Math.abs(record.amount)
                                  const description = `${record.period} ${t("officerBillingNetMeteringBill")}`
                                  setInvoiceForm((prev) => ({
                                    ...prev,
                                    applicationId: String(record.applicationId ?? ""),
                                    type: "monthly_bill",
                                    amount: amount.toString(),
                                    dueDate: dueDate.toISOString().split("T")[0],
                                    description,
                                  }))
                                  setQuickInvoice({
                                    applicationId: record.applicationId,
                                    amount,
                                    description,
                                  })
                                }}
                              >
                                {t("officerBillingGenerateInvoice")}
                              </Button>
                            </div>
                          )}
                        </td>
                          <td className="py-3 px-2 text-center">
                            <Badge
                              className={
                                record.isCredit
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : record.status === "paid"
                                    ? "bg-cyan-500/10 text-cyan-600"
                                    : "bg-amber-500/10 text-amber-600"
                              }
                              variant="secondary"
                            >
                              {record.isCredit ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : record.status === "paid" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {record.isCredit ? t("officerBillingCreditBadge") : record.status === "paid" ? t("officerBillingPaidBadge") : t("officerBillingPendingBadge")}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={!!quickInvoice} onOpenChange={(open) => !open && setQuickInvoice(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("officerBillingGenerateForRecordTitle")}</DialogTitle>
              <DialogDescription>{t("officerBillingGenerateForRecordDescription")}</DialogDescription>
            </DialogHeader>
            {quickInvoice && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quickApp">{t("officerBillingApplicationID")}</Label>
                  <Input id="quickApp" value={invoiceForm.applicationId} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quickAmount">{t("officerBillingAmount")}</Label>
                    <Input id="quickAmount" value={invoiceForm.amount} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quickDue">{t("officerBillingDueDate")}</Label>
                    <Input
                      id="quickDue"
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) => setInvoiceForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quickDesc">{t("officerBillingDescription")}</Label>
                  <Input
                    id="quickDesc"
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuickInvoice(null)}>
                {t("cancel")}
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={invoiceSaving || !isQuickInvoiceReady}
                onClick={async () => {
                  if (!quickInvoice || !isQuickInvoiceReady) return
                  setInvoiceSaving(true)
                  try {
                    const dueDateValue = invoiceForm.dueDate
                    const res = await fetch("/api/invoices", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        applicationId: invoiceForm.applicationId,
                        type: "monthly_bill",
                        amount: Number(invoiceForm.amount),
                        dueDate: dueDateValue,
                        description: invoiceForm.description,
                      }),
                    })
                    const data = await res.json().catch(() => ({}))
                    if (!res.ok) throw new Error(data.error || t("officerBillingUnableToCreate"))
                    if (data.invoice) {
                      downloadInvoicePdf(data.invoice)
                    }
                    setQuickInvoice(null)
                    setInvoiceForm({
                      applicationId: "",
                      type: "authority_fee",
                      amount: "",
                      dueDate: "",
                      description: "",
                    })
                    await loadBilling()
                  } catch (err) {
                    setError(err instanceof Error ? err.message : t("officerBillingUnableToCreate"))
                  } finally {
                    setInvoiceSaving(false)
                  }
                }}
              >
                {invoiceSaving ? t("officerBillingCreating") : t("officerBillingCreateInvoiceButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("officerBillingCreateInvoiceTitle")}</DialogTitle>
              <DialogDescription>{t("officerBillingCreateInvoiceDescription")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicationId">{t("officerBillingApplicationID")}</Label>
                <Input
                  id="applicationId"
                  placeholder={t("officerBillingApplicationIdPlaceholder")}
                  value={invoiceForm.applicationId}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, applicationId: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceType">{t("officerBillingType")}</Label>
                  <select
                    id="invoiceType"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={invoiceForm.type}
                    onChange={(e) => setInvoiceForm((prev) => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="authority_fee">{t("officerBillingAuthorityFee")}</option>
                    <option value="installation">{t("officerBillingInstallation")}</option>
                    <option value="monthly_bill">{t("officerBillingMonthlyBill")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">{t("officerBillingAmount")}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">{t("officerBillingDueDate")}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("officerBillingDescription")}</Label>
                <Input
                  id="description"
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={invoiceSaving || !isInvoiceFormReady}
                onClick={async () => {
                  if (!isInvoiceFormReady) return
                  setInvoiceSaving(true)
                  try {
                    const res = await fetch("/api/invoices", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        applicationId: invoiceForm.applicationId,
                        type: invoiceForm.type,
                        amount: Number(invoiceForm.amount),
                        dueDate: invoiceForm.dueDate,
                        description: invoiceForm.description,
                      }),
                    })
                    const data = await res.json().catch(() => ({}))
                    if (!res.ok) throw new Error(data.error || t("officerBillingUnableToCreate"))
                    if (data.invoice) {
                      downloadInvoicePdf(data.invoice)
                    }
                    setInvoiceDialogOpen(false)
                    setInvoiceForm({
                      applicationId: "",
                      type: "authority_fee",
                      amount: "",
                      dueDate: "",
                      description: "",
                    })
                    await loadBilling()
                  } catch (err) {
                    setError(err instanceof Error ? err.message : t("officerBillingUnableToCreate"))
                  } finally {
                    setInvoiceSaving(false)
                  }
                }}
              >
                {invoiceSaving ? t("officerBillingCreating") : t("officerBillingCreateInvoiceButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
