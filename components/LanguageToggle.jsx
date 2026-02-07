"use client"
import { useLanguage } from "@/context/LanguageContext"

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "si" : "en")}
      className="px-3 py-1 border rounded"
    >
      {language === "en" ? t("sinhalaLanguage") : t("englishLanguage")}
    </button>
  )
}
