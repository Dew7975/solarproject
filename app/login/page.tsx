"use client"

import { useActionState, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Sun, Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/app/actions/auth"
import { useLanguage } from "@/context/LanguageContext"

function LoginParticles() {
  const [dots, setDots] = useState<number[]>([])
  useEffect(() => { setDots(Array.from({ length: 20 })) }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-10"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%" 
          }}
          animate={{
            y: [null, Math.random() * -100 + "%"],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
          }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/customer/dashboard"
  const suspended = searchParams.get("suspended") === "1"

  const [state, formAction, pending] = useActionState(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 overflow-hidden">
      
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20 relative bg-white">
        <div className="max-w-[400px] w-full mx-auto space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              {/* Softer, deeper blue icon background */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-500/20 transition-transform group-hover:scale-105">
                <Sun className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-800">CEB Solar</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("welcomeBack")}</h1>
            <p className="text-slate-500 text-lg">{t("loginSubtitle")}</p>
          </motion.div>

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="redirect" value={redirect} />

            {suspended && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {t("suspendedMsg")}
              </motion.div>
            )}

            {state?.error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {state.error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-slate-700">{t("email")}</Label>
                {/* Clean white input with subtle border */}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("enterEmail")}
                  className="h-12 bg-white border-slate-300 transition-all duration-300 focus-visible:ring-slate-500 hover:border-slate-400 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium text-slate-700">{t("password")}</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("enterPassword")}
                    className="h-12 bg-white border-slate-300 transition-all duration-300 focus-visible:ring-slate-500 hover:border-slate-400 shadow-sm pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Darker, professional button color (Slate-900) */}
            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium text-lg shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
              disabled={pending}
            >
              {pending ? t("signingIn") : (
                <span className="flex items-center gap-2">
                  {t("signIn")} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <div className="text-center text-sm pt-2">
              <span className="text-slate-500">{t("dontHaveAccount")} </span>
              <Link href="/register" className="text-slate-900 font-bold hover:underline">
                {t("register")}
              </Link>
            </div>
          </form>
        </div>
        
        <div className="absolute bottom-6 left-0 w-full text-center">
           <p className="text-xs text-slate-400">{t("loginFooter")}</p>
        </div>
      </div>

      {/* --- RIGHT SIDE: DEEP PROFESSIONAL THEME --- */}
      {/* Used a deep Slate/Blue gradient which is much easier on the eyes than bright blue */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center text-white bg-slate-900">
         
         {/* Gradient Mesh */}
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e293b]"></div>
         
         {/* Particles */}
         <LoginParticles />

         {/* Soft Ambient Glows (Subtle) */}
         <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-emerald-500/05 rounded-full blur-[120px]"></div>
         
         {/* Content */}
         <div className="relative z-10 max-w-md text-center px-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8 inline-block p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
            >
               <ShieldCheck className="w-16 h-16 text-slate-200" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 tracking-tight drop-shadow-md">{t("login_promo_title")}</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              {t("login_promo_desc")}
            </p>

            <div className="mt-8 flex justify-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-xs font-mono backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t("login_badge_online")}
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono backdrop-blur-sm">
                  <Lock className="w-3 h-3" />
                  {t("login_badge_encrypted")}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
