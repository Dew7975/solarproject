"use client"

import { createContext, useContext, useState } from "react"
import { translations, Language } from "@/lib/translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en") // default English

  const t = (key: keyof typeof translations) =>
    translations[key]?.[language] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider")
  return ctx
}
