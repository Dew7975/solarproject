"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"
import { motion } from "framer-motion"


const history = [
  { date: "2025-01-01", energy: 14.2 },
  { date: "2025-01-02", energy: 16.8 },
  { date: "2025-01-03", energy: 15.4 },
]

export default function EnergyHistory() {
  const { t } = useLanguage() // ✅ GLOBAL language

  return (
    <DashboardLayout>
      <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100"
    >
      <Card
  className="
    max-w-3xl mx-auto
    relative
    overflow-hidden
    rounded-2xl
    border border-emerald-100
    bg-white/80
    backdrop-blur
    shadow-sm
  "
>
  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600" />

        <CardHeader className="pb-3">
          <CardTitle className="text-foreground text-xl">
  {t("energyHistory")}
</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="border-b border-emerald-200 text-muted-foreground">
                <th className="text-left py-2">{t("date")}</th>
                <th className="text-right">{t("energyKwh")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr
                  key={row.date}
                  className="rounded-lg hover:bg-emerald-50 transition"
                >
                  <td className="py-2 px-2 text-foreground">{row.date}</td>
                  <td className="text-right font-medium text-emerald-600">{row.energy}</td>
                </tr>
              ))}

              {history.length === 0 && (
  <div className="text-center py-12 text-muted-foreground">
    {t("noEnergyHistory")}
  </div>
)}

            </tbody>
          </table>
        </CardContent>
      </Card>
      </motion.div>
    </DashboardLayout>
  )
}
