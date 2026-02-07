"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap,
  Download,
  Building,
  Star,
} from "lucide-react"
import { fetchApplication, type Application } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/translations"

const statusConfig: Record<string, { labelKey: string; color: string; icon: React.ElementType }> = {
  pending: { labelKey: "status.pending", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  under_review: { labelKey: "status.under_review", color: "bg-blue-500/10 text-blue-600", icon: FileText },
  pre_visit_approved: {
    labelKey: "status.pre_visit_approved",
    color: "bg-emerald-500/10 text-emerald-600",
    icon: CheckCircle,
  },
  site_visit_scheduled: { labelKey: "status.site_visit_scheduled", color: "bg-cyan-500/10 text-cyan-600", icon: Calendar },
  approved: { labelKey: "status.approved", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  site_visit_payment_completed: {
    labelKey: "site_visit_payment_completed",
    color: "bg-emerald-500/10 text-emerald-600",
    icon: CheckCircle,
  },
  rejected: { labelKey: "rejected", color: "bg-red-500/10 text-red-600", icon: AlertCircle },
  payment_pending: { labelKey: "payment_pending", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  payment_confirmed: { labelKey: "payment_confirmed", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  finding_installer: { labelKey: "findingInstaller", color: "bg-blue-500/10 text-blue-600", icon: FileText },
  installation_in_progress: { labelKey: "installation_in_progress", color: "bg-cyan-500/10 text-cyan-600", icon: Zap },
  installation_complete: { labelKey: "installation_complete", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  final_inspection: { labelKey: "final_inspection", color: "bg-blue-500/10 text-blue-600", icon: FileText },
  agreement_pending: { labelKey: "agreement_pending", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  inspection_approved: { labelKey: "inspection_approved", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  agreement_sent: { labelKey: "agreement_sent", color: "bg-cyan-500/10 text-cyan-600", icon: FileText },
  customer_signed: { labelKey: "customer_signed", color: "bg-blue-500/10 text-blue-600", icon: FileText },
  installer_signed: { labelKey: "installer_signed", color: "bg-blue-500/10 text-blue-600", icon: FileText },
  officer_final_approved: { labelKey: "officer_final_approved", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
  completed: { labelKey: "completed", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
}

const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]

type Review = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={
            n <= value ? "w-5 h-5 text-yellow-500 fill-yellow-500" : "w-5 h-5 text-gray-300"
          }
        />
      ))}
    </div>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-1 rounded hover:bg-muted"
          aria-label={`Rate ${n} star`}
        >
          <Star
            className={
              n <= value ? "w-6 h-6 text-yellow-500 fill-yellow-500" : "w-6 h-6 text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  )
}

export default function ApplicationDetail() {
  const params = useParams<{ id: string }>()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [previewDoc, setPreviewDoc] = useState<{ url: string; label: string } | null>(null)
  const { t } = useLanguage()

  // Feedback state
  const [review, setReview] = useState<Review | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [feedbackError, setFeedbackError] = useState("")
  const [savingFeedback, setSavingFeedback] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const app = await fetchApplication(params.id as string)
        if (!app) {
          setError(t("applicationNotFound"))
          setApplication(null)
          return
        }
        setApplication(app)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unableToLoadApplication"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, t])

  // Load existing review for this application (if any)
  useEffect(() => {
    async function loadMyReview() {
      if (!application) return
      if (!application.selectedInstaller) return

      try {
        const res = await fetch(
          `/api/reviews/me?applicationRef=${encodeURIComponent(application.id)}`,
          { cache: "no-store" }
        )
        if (!res.ok) return
        const data = await res.json()
        if (data.review) {
          setReview(data.review)
          setRating(data.review.rating ?? 5)
          setComment(data.review.comment ?? "")
        } else {
          setReview(null)
        }
      } catch (e) {
        console.log("Failed to load review:", e)
      }
    }

    loadMyReview()
  }, [application])

  async function saveFeedback() {
    if (!application) return

    setSavingFeedback(true)
    setFeedbackError("")

    try {
      const url = review ? `/api/reviews/${review.id}` : "/api/reviews"
      const method = review ? "PUT" : "POST"

      const body =
        method === "POST"
          ? { applicationRef: application.id, rating, comment }
          : { rating, comment }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setFeedbackError(data?.error ?? "Failed to save feedback")
        return
      }

      setReview(data.review)
      setFeedbackOpen(false)
    } catch (e) {
      setFeedbackError("Failed to save feedback")
    } finally {
      setSavingFeedback(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          {t("loadingApplication")}
        </div>
      </DashboardLayout>
    )
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  const status = statusConfig[application.status] || statusConfig.pending
  const StatusIcon = status.icon

  // allow feedback after completion
  const canCreateReview =
    application.selectedInstaller &&
    ["installation_complete", "officer_final_approved", "completed"].includes(application.status)

  // allow editing if review exists (even if status changed later)
  const canOpenFeedback = !!review || !!canCreateReview

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/customer/applications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{application.id}</h1>
              <Badge className={status.color} variant="secondary">
                <StatusIcon className="w-3 h-3 mr-1" />
                {t(status.labelKey as keyof typeof translations)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {t("createdOn")} {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              {t("uploadedDocuments")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(application.documents).map(([key, doc]) => {
              if (!doc) return null
              const url = typeof doc === "string" ? doc : doc.url
              const label =
                typeof doc === "string"
                  ? key.replace(/([A-Z])/g, " $1").trim()
                  : doc.fileName

              const lowerLabel = label.toLowerCase()
              const isImage = imageExtensions.some((ext) => lowerLabel.endsWith(ext))

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <p className="text-sm font-medium text-foreground capitalize">{label}</p>

                  {isImage ? (
                    <Button variant="ghost" size="sm" onClick={() => setPreviewDoc({ url, label })}>
                      {t("preview")}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={url} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Site visit messages */}
        {application.status === "pre_visit_approved" && !application.siteVisitFeePaid && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("siteVisitPaymentRequired")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-muted-foreground">{t("siteVisitFeePaymentNote")}</p>
              <Link href="/customer/invoices">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  {t("paySiteVisitFee")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {(application.status === "site_visit_payment_completed" || application.siteVisitFeePaid) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("paymentCompleted")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("siteVisitPaymentCompletedMessage")}</p>
            </CardContent>
          </Card>
        )}

        {application.status === "site_visit_scheduled" && application.siteVisitDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("status.site_visit_scheduled")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("siteVisitScheduledFor")} {new Date(application.siteVisitDate).toLocaleString()}.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              {t("applicationDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{t("fullName")}</p>
              <p className="text-foreground">{application.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("email")}</p>
              <p className="text-foreground">{application.email || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("phone")}</p>
              <p className="text-foreground">{application.phone || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("address")}</p>
              <p className="text-foreground">{application.address || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("propertyType")}</p>
              <p className="text-foreground">{application.technicalDetails?.propertyType || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("propertyOwnership")}</p>
              <p className="text-foreground">{application.technicalDetails?.propertyOwnership || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("tariffCategory")}</p>
              <p className="text-foreground">{application.technicalDetails?.tariffCategory || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("electricityAccount")}</p>
              <p className="text-foreground">{application.technicalDetails?.electricityAccountNumber || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("roofType")}</p>
              <p className="text-foreground">{application.technicalDetails?.roofType || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("roofArea")}</p>
              <p className="text-foreground">{application.technicalDetails?.roofArea || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("roofOrientation")}</p>
              <p className="text-foreground">{application.technicalDetails?.roofOrientation || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("shading")}</p>
              <p className="text-foreground">{application.technicalDetails?.shading || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("monthlyConsumption")}</p>
              <p className="text-foreground">{application.technicalDetails?.monthlyConsumption || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("connectionPhase")}</p>
              <p className="text-foreground">{application.technicalDetails?.connectionPhase || t("notAvailable")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("desiredCapacity")}</p>
              <p className="text-foreground">{application.technicalDetails?.desiredCapacity || t("notAvailable")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Installer */}
        {application.selectedInstaller && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-500" />
                {t("selectedInstaller")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold text-foreground">{application.selectedInstaller.name}</p>
                  <p className="text-sm text-muted-foreground">{application.selectedInstaller.packageName}</p>
                </div>
                {application.selectedInstaller.price && (
                  <p className="text-lg font-bold text-emerald-500">
                    {t("rs")} {application.selectedInstaller.price.toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback */}
        {application.selectedInstaller && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Feedback
              </CardTitle>

              <Button
                onClick={() => {
                  setFeedbackError("")
                  // preload values
                  setRating(review?.rating ?? 5)
                  setComment(review?.comment ?? "")
                  setFeedbackOpen(true)
                }}
                disabled={!canOpenFeedback}
              >
                {review ? "Edit Feedback" : "Give Feedback"}
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {!canCreateReview && !review && (
                <p className="text-sm text-muted-foreground">
                  Feedback is available after installation is completed.
                </p>
              )}

              {review ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StarDisplay value={review.rating} />
                    <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                  </div>

                  <p className="text-sm text-foreground">{review.comment || "No comment"}</p>

                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(review.updatedAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("documentPreview")}</DialogTitle>
            <DialogDescription>{previewDoc?.label}</DialogDescription>
          </DialogHeader>
          {previewDoc && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <img
                src={previewDoc.url}
                alt={previewDoc.label}
                className="mx-auto max-h-[70vh] w-auto rounded-md object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{review ? "Edit Feedback" : "Give Feedback"}</DialogTitle>
            <DialogDescription>
              Rate your installer and leave a comment. You can edit later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Comment</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[110px] rounded-md border border-border bg-background p-3 text-sm"
                placeholder="Write your feedback..."
              />
            </div>

            {!canCreateReview && !review && (
              <p className="text-sm text-muted-foreground">
                You can submit feedback only after completion.
              </p>
            )}

            {feedbackError && <p className="text-sm text-red-600">{feedbackError}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveFeedback} disabled={savingFeedback || (!canCreateReview && !review)}>
                {savingFeedback ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}