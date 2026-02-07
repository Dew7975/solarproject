"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileSettings } from "@/components/profile-settings"
import { useLanguage } from "@/context/LanguageContext"

export default function CustomerSettingsPage() {
  const { t } = useLanguage()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("settings")}</h1>
          <p className="text-muted-foreground">{t("settingsSubtitle")}</p>
        </div>
        <ProfileSettings />
      </div>
    </DashboardLayout>
  )
}
