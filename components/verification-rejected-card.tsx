"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

export function VerificationRejectedCard({ className = "" }: { className?: string }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadReason() {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        const notifications = Array.isArray(data.notifications) ? data.notifications : []
        const decision = notifications
          .filter(
            (note: any) =>
              typeof note.title === "string" &&
              note.title.toLowerCase().includes("installer verification rejected"),
          )
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0]

        if (!active) return

        const body = typeof decision?.body === "string" ? decision.body : ""
        const match = body.match(/Reason:\s*(.+)$/i)
        setRejectionReason(match?.[1]?.trim() || null)
      } catch {
        if (!active) return
      }
    }

    loadReason()
    return () => {
      active = false
    }
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } finally {
      router.push("/login")
    }
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`.trim()}>
      <Card className="border-red-500/40 bg-red-500/5">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {t("verificationRejected")}
          </h2>
          <p className="text-muted-foreground">
            {t("verificationRejectedDescription")}
          </p>
          {rejectionReason && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-left">
              <p className="text-xs uppercase tracking-wide text-red-500">
                {t("rejectionReasonLabel")}
              </p>
              <p className="text-sm text-foreground mt-1">{rejectionReason}</p>
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? t("loggingOut") : t("logout")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
