"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext"

import {
  FileText,
  Upload,
  Download,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

type Agreement = {
  id: string
  installerPdfUrl?: string | null
  installerSignedUrl?: string | null
  sentAt?: string | null
  officerApprovedAt?: string | null
}

function AnimatedYellowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_0%,rgba(250,204,21,0.35),transparent_58%),radial-gradient(55%_55%_at_100%_20%,rgba(245,158,11,0.22),transparent_55%),radial-gradient(60%_60%_at_40%_100%,rgba(251,146,60,0.18),transparent_60%)]" />
      <motion.div
        className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-amber-500/16 blur-3xl"
        animate={{ x: [0, -36, 0], y: [0, -18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.35)_1px,transparent_1px)] dark:opacity-[0.12] [background-size:46px_46px]" />
    </div>
  )
}

function StatusPill({
  icon: Icon,
  label,
  tone = "yellow",
}: {
  icon: React.ElementType
  label: string
  tone?: "yellow" | "amber" | "emerald" | "red"
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : tone === "amber"
        ? "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-200"
        : tone === "red"
          ? "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300"
          : "border-yellow-500/25 bg-yellow-400/15 text-yellow-900 dark:text-yellow-200"

  return (
    <div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 ${toneClass}`}>
      <Icon className="h-4 w-4" />
      <span className="text-xs font-semibold">{label}</span>
    </div>
  )
}

export default function InstallerAgreementPage() {
  const params = useParams()
  const idParam = (params as { id?: string | string[] })?.id
  const id = Array.isArray(idParam) ? idParam[0] : idParam

  const { t } = useLanguage()

  const [agreement, setAgreement] = useState<Agreement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return

    let active = true

    async function load() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/api/agreements/${id}/sign`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || t("installer_agreement_error_load"))
        if (active) setAgreement((data.agreement as Agreement) ?? null)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : t("installer_agreement_error_load"))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [id, t])

  const submitSigned = async () => {
    if (!id || !file) return

    setSubmitting(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(`/api/agreements/${id}/sign`, {
        method: "PATCH",
        body: formData,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || t("installer_agreement_error_upload"))

      setAgreement((data.agreement as Agreement) ?? null)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("installer_agreement_error_upload"))
    } finally {
      setSubmitting(false)
    }
  }

  const step = useMemo(() => {
    // UI-only step indicator (derived from existing fields)
    if (!agreement) return 0
    if (!agreement.sentAt) return 1
    if (agreement.sentAt && !agreement.installerSignedUrl) return 2
    if (agreement.installerSignedUrl && !agreement.officerApprovedAt) return 3
    return 4
  }, [agreement])

  return (
    <DashboardLayout>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Compact hero */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                      <FileText className="h-5 w-5 text-yellow-950/80" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground truncate">
                        {t("installer_agreement_page_title")}
                      </h1>
                      <p className="text-xs text-muted-foreground truncate">
                        Download, sign, and upload your agreement (PDF/image)
                      </p>
                    </div>
                  </div>

                  {/* status pills */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {agreement?.sentAt ? (
                      <StatusPill icon={Clock} label="Sent" tone="amber" />
                    ) : (
                      <StatusPill icon={Clock} label="Not sent yet" tone="yellow" />
                    )}

                    {agreement?.installerSignedUrl ? (
                      <StatusPill icon={CheckCircle2} label="Uploaded" tone="emerald" />
                    ) : (
                      <StatusPill icon={Upload} label="Upload pending" tone="yellow" />
                    )}

                    {agreement?.officerApprovedAt ? (
                      <StatusPill icon={ShieldCheck} label="Approved" tone="emerald" />
                    ) : (
                      <StatusPill icon={ShieldCheck} label="Awaiting approval" tone="amber" />
                    )}
                  </div>
                </div>

                {/* simple step meter */}
                <div className="sm:text-right">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <div className="mt-1 h-2 w-full sm:w-56 rounded-full bg-yellow-950/10 dark:bg-yellow-50/10 overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / 4) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{step}/4</p>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <div className="min-w-0">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Main card (denser, more color, motion) */}
          <Card className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
            <CardHeader className="py-4">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base sm:text-lg">
                  {t("installer_agreement_card_title")}
                </CardTitle>

                {agreement?.installerPdfUrl && (
                  <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="inline-flex"
                    href={agreement.installerPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-semibold shadow-sm">
                      <Download className="h-4 w-4 mr-2" />
                      {t("installer_agreement_download_pdf")}
                    </Button>
                  </motion.a>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3 text-sm">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 w-72 rounded bg-yellow-500/10 animate-pulse" />
                  <div className="h-3 w-96 max-w-full rounded bg-yellow-500/10 animate-pulse" />
                  <div className="h-24 w-full rounded-2xl bg-yellow-500/10 animate-pulse" />
                </div>
              ) : !agreement ? (
                <div className="rounded-2xl border border-dashed border-yellow-500/30 bg-yellow-500/5 p-4 text-muted-foreground">
                  {t("installer_agreement_not_found")}
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-muted-foreground">
                    {t("installer_agreement_instructions")}
                  </div>

                  {!agreement.installerPdfUrl && (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-muted-foreground">
                      PDF not available yet.
                      {agreement.sentAt ? "" : " (Officer has not sent the agreement yet.)"}
                    </div>
                  )}

                  {/* Upload box */}
                  <div className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">Upload signed agreement</p>
                        <p className="text-xs text-muted-foreground">
                          Accepted: PDF / images. Keep file clear and readable.
                        </p>
                      </div>

                      {agreement.installerSignedUrl ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Signed uploaded
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-400/15 text-yellow-900 dark:text-yellow-200 border border-yellow-500/25">
                          Pending
                        </Badge>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                          className="border-yellow-500/25 bg-background/60"
                        />

                        <AnimatePresence>
                          {file && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="text-xs text-muted-foreground flex items-center justify-between gap-2"
                            >
                              <span className="truncate">
                                Selected: <span className="font-semibold text-foreground">{file.name}</span>
                              </span>
                              <button
                                className="text-yellow-700 dark:text-yellow-300 underline underline-offset-2"
                                onClick={() => setFile(null)}
                                type="button"
                              >
                                Clear
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          onClick={submitSigned}
                          disabled={!file || submitting}
                          className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-semibold shadow-sm"
                        >
                          <Upload className={`h-4 w-4 mr-2 ${submitting ? "animate-pulse" : ""}`} />
                          {submitting ? t("installer_agreement_uploading") : t("installer_agreement_upload_btn")}
                        </Button>
                      </motion.div>
                    </div>

                    {agreement.installerSignedUrl && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        {t("installer_agreement_signed_uploaded")}
                      </p>
                    )}

                    {agreement.officerApprovedAt && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        {t("installer_agreement_officer_approved")}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}