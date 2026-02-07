"use client"

import type React from "react"
import { useState, useEffect, Suspense, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Sun, Eye, EyeOff, Building, User, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { registerAction } from "@/app/actions/auth"
import { useLanguage } from "@/context/LanguageContext"

// --- Floating Particles (Subtle) ---
function FloatingParticles() {
  const [particles, setParticles] = useState<number[]>([])
  useEffect(() => { setParticles(Array.from({ length: 20 })) }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-10"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%", 
            scale: Math.random() * 0.5 + 0.5 
          }}
          animate={{
            y: [null, Math.random() * -100 - 20 + "%"],
            opacity: [0.05, 0.2, 0.05], 
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            width: Math.random() * 6 + 2 + "px",
            height: Math.random() * 6 + 2 + "px",
          }}
        />
      ))}
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 text-white/90"
    >
      <div className="p-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm shadow-sm">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium tracking-wide">{text}</span>
    </motion.div>
  )
}

function RegisterForm() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "customer"

  const [activeTab, setActiveTab] = useState(defaultRole)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, startTransition] = useTransition()

  const isCustomer = activeTab === "customer"
  
  // --- Professional Theme Colors (Deep & Rich) ---
  const themeColors = isCustomer 
    ? {
        // Form Side
        inputClass: "focus-visible:ring-teal-600 focus-visible:border-teal-600 hover:border-teal-400 bg-white border-slate-200 focus:bg-white",
        buttonClass: "bg-teal-700 hover:bg-teal-800 shadow-teal-900/20",
        tabActive: "data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:border-teal-200",
        linkText: "text-teal-700",
        iconBg: "from-teal-600 to-emerald-800",
      }
    : {
        // Form Side
        inputClass: "focus-visible:ring-amber-600 focus-visible:border-amber-600 hover:border-amber-400 bg-white border-slate-200 focus:bg-white",
        buttonClass: "bg-amber-600 hover:bg-amber-700 shadow-amber-900/20",
        tabActive: "data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200",
        linkText: "text-amber-700",
        iconBg: "from-amber-500 to-orange-700",
      }

  const [customerData, setCustomerData] = useState({ name: "", email: "", phone: "", address: "", password: "", confirmPassword: "" })
  const [installerData, setInstallerData] = useState({ companyName: "", email: "", phone: "", address: "", description: "", password: "", confirmPassword: "", brDocument: null as File | null, businessLicense: null as File | null, insuranceCertificate: null as File | null })

  useEffect(() => { setActiveTab(defaultRole) }, [defaultRole])

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    startTransition(async () => {
      const formData = new FormData()
      formData.append("role", "customer"); formData.append("name", customerData.name); formData.append("email", customerData.email); formData.append("phone", customerData.phone); formData.append("address", customerData.address); formData.append("password", customerData.password); formData.append("confirmPassword", customerData.confirmPassword)
      const result = await registerAction(null, formData)
      if (result?.error) setError(result.error)
    })
  }

  const handleInstallerSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    startTransition(async () => {
      const formData = new FormData()
      formData.append("role", "installer"); formData.append("name", installerData.companyName); formData.append("companyName", installerData.companyName); formData.append("description", installerData.description); formData.append("email", installerData.email); formData.append("phone", installerData.phone); formData.append("address", installerData.address); formData.append("password", installerData.password); formData.append("confirmPassword", installerData.confirmPassword)
      if (installerData.brDocument) formData.append("brDocument", installerData.brDocument)
      if (installerData.businessLicense) formData.append("businessLicense", installerData.businessLicense)
      if (installerData.insuranceCertificate) formData.append("insuranceCertificate", installerData.insuranceCertificate)
      const result = await registerAction(null, formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 overflow-hidden">
      
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex flex-col relative bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20 max-w-2xl mx-auto w-full">
          
          <Link href="/" className="flex items-center gap-2 mb-10 group w-fit">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br transition-all duration-500 flex items-center justify-center shadow-lg group-hover:scale-105 ${themeColors.iconBg}`}>
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">CEB Solar</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("createAccount")}</h1>
            <p className="text-slate-500 text-lg">{t("registerSubtitle")}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-2 p-1.5 h-14 bg-slate-100 rounded-2xl border border-slate-200">
              <TabsTrigger 
                value="customer" 
                className={`rounded-xl gap-2 text-sm font-semibold transition-all border border-transparent ${isCustomer ? themeColors.tabActive : "text-slate-500 hover:text-slate-700"}`}
              >
                <User className="w-4 h-4" /> {t("customer")}
              </TabsTrigger>
              <TabsTrigger 
                value="installer" 
                className={`rounded-xl gap-2 text-sm font-semibold transition-all border border-transparent ${!isCustomer ? themeColors.tabActive : "text-slate-500 hover:text-slate-700"}`}
              >
                <Building className="w-4 h-4" /> {t("installer")}
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {isCustomer ? (
                <motion.form
                  key="customer"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleCustomerSubmit}
                  className="space-y-5"
                >
                  <Field label={t("fullName")}><StyledInput value={customerData.name} onChange={(e: any) => setCustomerData({...customerData, name: e.target.value})} className={themeColors.inputClass} /></Field>
                  <Field label={t("email")}><StyledInput type="email" value={customerData.email} onChange={(e: any) => setCustomerData({...customerData, email: e.target.value})} className={themeColors.inputClass} /></Field>
                  <Field label={t("phone")}>
                    <StyledInput
                      value={customerData.phone}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      onChange={(e: any) => {
                        const next = e.target.value.replace(/\D/g, "").slice(0, 10)
                        setCustomerData({ ...customerData, phone: next })
                      }}
                      onInvalid={(e: any) => {
                        e.currentTarget.setCustomValidity("Please enter a valid 10-digit phone number.")
                      }}
                      onInput={(e: any) => e.currentTarget.setCustomValidity("")}
                      className={themeColors.inputClass}
                    />
                  </Field>
                  <Field label={t("address")}><StyledTextarea value={customerData.address} onChange={(e: any) => setCustomerData({...customerData, address: e.target.value})} className={themeColors.inputClass} /></Field>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PasswordField label={t("password")} value={customerData.password} onChange={(v: any) => setCustomerData({...customerData, password: v})} show={showPassword} toggle={() => setShowPassword(!showPassword)} inputClass={themeColors.inputClass} />
                    <div className="space-y-1.5">
                       <Label className="font-semibold text-slate-700">{t("confirmPassword")}</Label>
                       <StyledInput type="password" value={customerData.confirmPassword} onChange={(e: any) => setCustomerData({...customerData, confirmPassword: e.target.value})} className={themeColors.inputClass} />
                    </div>
                  </div>

                  <Button className={`w-full h-12 text-white font-semibold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] ${themeColors.buttonClass}`} disabled={loading}>
                    {loading ? t("creatingAccount") : t("createCustomerAccount")}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="installer"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleInstallerSubmit}
                  className="space-y-5"
                >
                  <Field label={t("companyName")}><StyledInput value={installerData.companyName} onChange={(e: any) => setInstallerData({...installerData, companyName: e.target.value})} className={themeColors.inputClass} /></Field>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Field label={t("email")}><StyledInput type="email" value={installerData.email} onChange={(e: any) => setInstallerData({...installerData, email: e.target.value})} className={themeColors.inputClass} /></Field>
                     <Field label={t("phone")}>
                       <StyledInput
                         value={installerData.phone}
                         inputMode="numeric"
                         pattern="[0-9]{10}"
                         maxLength={10}
                         onChange={(e: any) => {
                           const next = e.target.value.replace(/\D/g, "").slice(0, 10)
                           setInstallerData({ ...installerData, phone: next })
                         }}
                         onInvalid={(e: any) => {
                           e.currentTarget.setCustomValidity("Please enter a valid 10-digit phone number.")
                         }}
                         onInput={(e: any) => e.currentTarget.setCustomValidity("")}
                         className={themeColors.inputClass}
                       />
                     </Field>
                  </div>
                  <Field label={t("address")}><StyledTextarea value={installerData.address} onChange={(e: any) => setInstallerData({...installerData, address: e.target.value})} className={themeColors.inputClass} /></Field>
                  <Field label={t("description")}><StyledTextarea value={installerData.description} onChange={(e: any) => setInstallerData({...installerData, description: e.target.value})} className={themeColors.inputClass} /></Field>
                  
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                     <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Required Documents</p>
                     <div className="grid gap-3">
                        <StyledFileInput
                          label={t("brDocument")}
                          required
                          onChange={(e: any) => setInstallerData({ ...installerData, brDocument: e.target.files?.[0] || null })}
                        />
                        <StyledFileInput
                          label={t("businessLicense")}
                          required
                          onChange={(e: any) => setInstallerData({ ...installerData, businessLicense: e.target.files?.[0] || null })}
                        />
                        <StyledFileInput
                          label={t("insuranceCertificate")}
                          required
                          onChange={(e: any) => setInstallerData({ ...installerData, insuranceCertificate: e.target.files?.[0] || null })}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PasswordField label={t("password")} value={installerData.password} onChange={(v: any) => setInstallerData({...installerData, password: v})} show={showPassword} toggle={() => setShowPassword(!showPassword)} inputClass={themeColors.inputClass} />
                    <div className="space-y-1.5">
                       <Label className="font-semibold text-slate-700">{t("confirmPassword")}</Label>
                       <StyledInput type="password" value={installerData.confirmPassword} onChange={(e: any) => setInstallerData({...installerData, confirmPassword: e.target.value})} className={themeColors.inputClass} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-100">
                     <Building className="w-5 h-5 shrink-0" />
                     <span>{t("installerReviewNotice")}</span>
                  </div>

                  <Button className={`w-full h-12 text-white font-semibold text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] ${themeColors.buttonClass}`} disabled={loading}>
                    {loading ? t("creatingAccount") : t("createInstallerAccount")}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="text-center text-sm pt-4">
              <span className="text-slate-500">{t("alreadyHaveAccount")} </span>
              <Link href="/login" className={`font-bold hover:underline transition-colors ${themeColors.linkText}`}>
                {t("signIn")}
              </Link>
            </div>
          </Tabs>
        </div>
      </div>

      {/* --- RIGHT SIDE: LIGHT UP VISUAL PANEL --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12 text-white shadow-2xl z-10">
        
        {/* Background Layer - Customer (Teal/Green) */}
        <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-teal-700 to-emerald-900"
            animate={{ opacity: isCustomer ? 1 : 0 }}
            transition={{ duration: 0.6 }}
        />
        
        {/* Background Layer - Installer (Amber/Orange) */}
        <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-800"
            animate={{ opacity: isCustomer ? 0 : 1 }}
            transition={{ duration: 0.6 }}
        />

        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay" />
        
        {/* Glow Orbs */}
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
        
        {/* Floating Particles */}
        <FloatingParticles />

        {/* Content */}
        <div className="relative z-10 max-w-lg">
           <AnimatePresence mode="wait">
              {isCustomer ? (
                 <motion.div 
                   key="customer-panel"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.4 }}
                   className="space-y-8"
                 >
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                       <Sun className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tight drop-shadow-md">{t("reg_promo_customer_title")}</h2>
                    <p className="text-emerald-50 text-xl leading-relaxed font-medium">
                      {t("reg_promo_customer_desc")}
                    </p>
                    <div className="space-y-5 pt-6 border-t border-white/10">
                       <BenefitItem text={t("reg_benefit_tracking")} />
                       <BenefitItem text={t("reg_benefit_connect")} />
                       <BenefitItem text={t("reg_benefit_savings")} />
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                   key="installer-panel"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.4 }}
                   className="space-y-8"
                 >
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                       <Building className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tight drop-shadow-md">{t("reg_promo_installer_title")}</h2>
                    <p className="text-orange-50 text-xl leading-relaxed font-medium">
                       {t("reg_promo_installer_desc")}
                    </p>
                    <div className="space-y-5 pt-6 border-t border-white/10">
                       <BenefitItem text={t("reg_benefit_leads")} />
                       <BenefitItem text={t("reg_benefit_approvals")} />
                       <BenefitItem text={t("reg_benefit_compliance")} />
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// --- Styled Components ---
function StyledInput({ className, ...props }: any) {
  return <Input {...props} className={`h-11 transition-all duration-300 shadow-sm ${className}`} />
}

function StyledTextarea({ className, ...props }: any) {
  return <Textarea {...props} className={`min-h-[100px] transition-all duration-300 shadow-sm ${className}`} />
}

function StyledFileInput({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</Label>
      <Input 
        type="file" 
        {...props}
        className="h-10 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold cursor-pointer border-slate-200 bg-white hover:bg-slate-50 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-sm font-semibold text-slate-700">{label}</Label>{children}</div>
}

function PasswordField({ label, value, onChange, show, toggle, inputClass }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      <div className="relative">
        <StyledInput type={show ? "text" : "password"} value={value} onChange={(e: any) => onChange(e.target.value)} className={inputClass} required />
        <button type="button" onClick={toggle} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}><RegisterForm /></Suspense>
}