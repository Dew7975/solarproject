"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Banknote,
} from "lucide-react"

import { fetchPayments, type Invoice } from "@/lib/auth"

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function statusBadge(status: Invoice["status"], t: (key: string) => string) {
  const map = {
    pending: {
      label: t("officerPaymentsStatusPending"),
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600",
    },
    paid: {
      label: t("officerPaymentsStatusPaid"),
      icon: CheckCircle,
      className: "bg-emerald-500/10 text-emerald-600",
    },
    overdue: {
      label: t("officerPaymentsStatusOverdue"),
      icon: XCircle,
      className: "bg-red-500/10 text-red-600",
    },
  }

  const cfg = map[status]
  const Icon = cfg.icon

  return (
    <Badge variant="secondary" className={cfg.className}>
      <Icon className="w-3 h-3 mr-1" />
      {cfg.label}
    </Badge>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function OfficerPaymentsPage() {
  const { t } = useLanguage()
  const [payments, setPayments] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [siteVisitFee, setSiteVisitFee] = useState("")
  const [savingFee, setSavingFee] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<Invoice | null>(null)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [note, setNote] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [data, feeRes] = await Promise.all([
          fetchPayments(),
          fetch("/api/officer/fees"),
        ])
        setPayments(data.invoices)
        if (feeRes.ok) {
          const feeData = await feeRes.json()
          setSiteVisitFee(String(feeData.siteVisitFee ?? ""))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("officerPaymentsUnableToLoad"))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return payments.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.applicationId.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [payments, searchTerm])

  const pending = filtered.filter((p) => p.status === "pending")
  const paid = filtered.filter((p) => p.status === "paid")
  const overdue = filtered.filter((p) => p.status === "overdue")

  const totals = {
    pending: pending.reduce((s, p) => s + p.amount, 0),
    paid: paid.reduce((s, p) => s + p.amount, 0),
  }

  async function saveFee() {
    setSavingFee(true)
    try {
      const res = await fetch("/api/officer/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteVisitFee: Number(siteVisitFee) }),
      })
      if (!res.ok) throw new Error(t("officerPaymentsFailedToUpdate"))
    } catch (err) {
      setError(err instanceof Error ? err.message : t("officerPaymentsFailedToUpdate"))
    } finally {
      setSavingFee(false)
    }
  }

  async function updateStatus(status: "paid" | "overdue") {
    if (!selectedPayment) return

    try {
      const res = await fetch(`/api/payments/${selectedPayment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      })

      if (!res.ok) throw new Error(t("officerPaymentsUpdateFailed"))

      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id ? { ...p, status } : p,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : t("officerPaymentsUpdateFailed"))
    } finally {
      setVerifyOpen(false)
      setFlagOpen(false)
      setSelectedPayment(null)
      setNote("")
    }
  }

  function PaymentCard({ payment }: { payment: Invoice }) {
    return (
      <div className="p-4 rounded-lg border space-y-3">
        <div className="flex justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{payment.id}</p>
              <Badge variant="secondary">
                {payment.type === "authority_fee"
                  ? t("officerPaymentsTypeAuthorityFee")
                  : payment.type === "installation"
                  ? t("officerPaymentsTypeInstallation")
                  : t("officerPaymentsTypeMonthlyBill")}
              </Badge>
              {statusBadge(payment.status, t)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {payment.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("officerPaymentsApplication")}: {payment.applicationId}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-emerald-600">
              LKR {payment.amount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("officerPaymentsDue")} {new Date(payment.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {payment.status === "pending" && (
          <div className="flex gap-2 pt-3 border-t">
            <Button
              size="sm"
              className="bg-emerald-500 text-white"
              onClick={() => {
                setSelectedPayment(payment)
                setVerifyOpen(true)
              }}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {t("officerPaymentsMarkPaid")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-600"
              onClick={() => {
                setSelectedPayment(payment)
                setFlagOpen(true)
              }}
            >
              <XCircle className="w-4 h-4 mr-1" />
              {t("officerPaymentsFlag")}
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            {t("officerPaymentsLoading")}
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("officerPaymentsTitle")}</h1>
            <p className="text-muted-foreground">
              {t("officerPaymentsSubtitle")}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/3 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("SearchInvoices")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">{t("officerPaymentsSiteVisitFeeTitle")}</CardTitle>
            <CardDescription>{t("officerPaymentsSiteVisitFeeDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="w-full sm:w-48 space-y-2">
              <Label htmlFor="siteVisitFee">Fee (LKR)</Label>
              <Input
                id="siteVisitFee"
                value={siteVisitFee}
                onChange={(e) => setSiteVisitFee(e.target.value)}
                type="number"
                min="0"
              />
            </div>
            <Button onClick={saveFee} disabled={savingFee}>
              {savingFee ? t("officerPaymentsSaving") : t("officerPaymentsSaveFee")}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="p-3 rounded bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("officerPaymentsPending")}</p>
                <p className="text-2xl font-bold">
                  LKR {totals.pending.toLocaleString()}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-amber-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("officerPaymentsPaid")}</p>
                <p className="text-2xl font-bold">
                  LKR {totals.paid.toLocaleString()}
                </p>
              </div>
              <Banknote className="w-8 h-8 text-emerald-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("officerPaymentsOverdue")}</p>
                <p className="text-2xl font-bold">{overdue.length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">{t("officerPaymentsPending")} ({pending.length})</TabsTrigger>
            <TabsTrigger value="paid">{t("officerPaymentsPaid")} ({paid.length})</TabsTrigger>
            <TabsTrigger value="overdue">{t("officerPaymentsOverdue")} ({overdue.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3 mt-4">
            {pending.map((p) => (
              <PaymentCard key={p.id} payment={p} />
            ))}
          </TabsContent>

          <TabsContent value="paid" className="space-y-3 mt-4">
            {paid.map((p) => (
              <PaymentCard key={p.id} payment={p} />
            ))}
          </TabsContent>

          <TabsContent value="overdue" className="space-y-3 mt-4">
            {overdue.map((p) => (
              <PaymentCard key={p.id} payment={p} />
            ))}
          </TabsContent>
        </Tabs>

        <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("officerPaymentsConfirmPaymentTitle")}</DialogTitle>
              <DialogDescription>
                {t("officerPaymentsConfirmPaymentDescription")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setVerifyOpen(false)}>
                {t("officerPaymentsCancel")}
              </Button>
              <Button
                className="bg-emerald-500 text-white"
                onClick={() => updateStatus("paid")}
              >
                {t("officerPaymentsConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={flagOpen} onOpenChange={setFlagOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("officerPaymentsFlagInvoiceTitle")}</DialogTitle>
              <DialogDescription>
                {t("officerPaymentsFlagInvoiceDescription")}
              </DialogDescription>
            </DialogHeader>
            <Label>{t("officerPaymentsNote")}</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setFlagOpen(false)}>
                {t("officerPaymentsCancel")}
              </Button>
              <Button
                className="bg-red-500 text-white"
                onClick={() => updateStatus("overdue")}
              >
                {t("officerPaymentsFlag")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}



