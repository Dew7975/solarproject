"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Settings2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileSettings } from "@/components/profile-settings"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"

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

export default function InstallerSettingsPage() {
  const { t } = useLanguage()

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.10),transparent_55%)]" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl p-4 sm:p-6 space-y-3"
        >
          {/* Hero */}
          <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/12 via-background/70 to-orange-500/10 shadow-sm">
            <AnimatedYellowBackdrop />
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                  <Settings2 className="h-5 w-5 text-yellow-950/80" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                      {t("installer_settings_title")}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-2xl border border-yellow-500/25 bg-yellow-400/15 px-2.5 py-1 text-xs font-semibold text-yellow-900 dark:text-yellow-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      Pro
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {t("installer_settings_subtitle")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings content */}
          <AnimatePresence mode="wait">
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm p-3 sm:p-4"
            >
              <ProfileSettings />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}