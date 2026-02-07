"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"

export function VerificationPendingCard({ className = "" }: { className?: string }) {
  const { t } = useLanguage()
  return (
    <div className={`max-w-2xl mx-auto ${className}`.trim()}>
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {t("verificationPending")}
          </h2>
          <p className="text-muted-foreground">
            {t("verificationPendingDescription")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
