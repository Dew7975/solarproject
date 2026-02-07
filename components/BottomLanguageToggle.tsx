"use client"

import { useLanguage } from "@/context/LanguageContext"
import { Languages } from "lucide-react"
import { useState, useEffect } from "react"

export default function BottomLanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleLanguage = () => {
    setIsAnimating(true)
    setLanguage(language === "en" ? "si" : "en")
  }

  // Reset animation after it completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Button with Animation */}
      <button
        onClick={toggleLanguage}
        className="relative group"
        aria-label={`${t("switchToLanguage")} ${language === "en" ? t("sinhalaLanguage") : t("englishLanguage")}`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Main Button */}
        <div className={`
          relative flex items-center justify-center w-16 h-16 
          rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 
          text-white shadow-lg hover:shadow-xl 
          transition-all duration-300 hover:scale-105
          ${isAnimating ? 'scale-110' : ''}
        `}>
          {/* Animated Background */}
          <div className="absolute inset-2 rounded-full bg-white/10" />
          
          {/* Languages Icon */}
          <div className="relative z-10">
            <Languages className="w-6 h-6" />
          </div>
          
          {/* Language Badge with Animation */}
          <div className={`
            absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full 
            flex items-center justify-center shadow-md
            transition-all duration-300
            ${isAnimating ? 'scale-125 rotate-180' : ''}
          `}>
            <span className={`
              font-bold text-xs transition-all duration-300
              ${language === "si" ? "text-emerald-600" : "text-cyan-600"}
              ${isAnimating ? 'scale-0' : 'scale-100'}
            `}>
              {language === "si" ? "සිං" : "ENG"}
            </span>
          </div>
          
          {/* Hover Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {t("clickForLanguage")} {language === "en" ? t("sinhalaLanguage") : t("englishLanguage")}
          </div>
          
          {/* Click Animation Ring */}
          <div className={`
            absolute inset-0 rounded-full border-2 border-white/30
            transition-all duration-500
            ${isAnimating ? 'scale-150 opacity-0' : ''}
          `} />
        </div>
        
        {/* Pulse Animation on Click */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-ping opacity-25" />
        )}
      </button>
      
      {/* Current Language Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {language === "en" ? t("englishLanguage") : t("sinhalaLanguage")}
        </span>
      </div>
    </div>
  )
}
