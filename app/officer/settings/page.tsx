"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import { ProfileSettings } from "@/components/profile-settings"

export default function OfficerSettingsPage() {
  const { t } = useLanguage()
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("officerSettingsTitle")}</h1>
          <p className="text-muted-foreground">{t("officerSettingsSubtitle")}</p>
        </div>
        <ProfileSettings />
      </div>
    </DashboardLayout>
  )
}
