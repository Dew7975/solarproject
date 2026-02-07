"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/context/LanguageContext"

type Agreement = {
  id: string
  customerPdfUrl?: string | null
  customerSignedUrl?: string | null
  sentAt?: string | null
  officerApprovedAt?: string | null
}

export default function CustomerAgreementPage() {
  const params = useParams()
  const [agreement, setAgreement] = useState<Agreement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/agreements/${params.id}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || t("loadAgreementError"))
        }
        const data = await res.json()
        setAgreement(data.agreement)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("loadAgreementError"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const submitSigned = async () => {
    if (!file || !agreement) return
    setSubmitting(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`/api/agreements/${agreement.id}/sign`, {
        method: "PATCH",
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("uploadAgreementError"))
      }
      const data = await res.json()
      setAgreement(data.agreement)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadAgreementError"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t("agreementTitle")}</h1>
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>{t("customerAgreementTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {loading ? (
              <p>{t("agreementLoading")}</p>
            ) : agreement ? (
              <>
                <p>{t("agreementInstruction")}</p>
                {agreement.customerPdfUrl && (
                  <a className="text-emerald-600 underline" href={agreement.customerPdfUrl} target="_blank">
                    {t("downloadAgreement")}
                  </a>
                )}
                <div className="space-y-2">
                  <Input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <Button
                    onClick={submitSigned}
                    disabled={!file || submitting}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {submitting ? t("uploading") : t("uploadSignedAgreement")}
                  </Button>
                  {agreement.customerSignedUrl && (
                    <p className="text-xs text-emerald-600">{t("signedUploaded")}</p>
                  )}
                </div>
                {agreement.officerApprovedAt && (
                  <p className="text-xs text-emerald-600">{t("officerApproved")}</p>
                )}
              </>
            ) : (
              <p>{t("noAgreementFound")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
