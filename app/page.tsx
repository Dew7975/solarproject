"use client"

import { useLanguage } from "@/context/LanguageContext"
import Link from "next/link"
import { Sun, Zap, Shield, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { SmallThemeToggle } from "@/components/small-theme-toggle"

// --- 1. THEMED PARTICLES COMPONENT ---
function FloatingParticles() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      duration: number
      delay: number
      xMove: number
      opacity: number
    }>
  >([])

  useEffect(() => {
    const particleCount = 120 // High density
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const rand = Math.random()
      
      // --- COLOR THEME LOGIC ---
      // 33% Green (Customer), 33% Orange (Installer), 33% Blue (Officer)
      let colorClass = "bg-emerald-400" // Default Green
      if (rand > 0.66) {
        colorClass = "bg-blue-400"    // Blue
      } else if (rand > 0.33) {
        colorClass = "bg-orange-400"  // Orange
      }

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: colorClass,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * -20, // Start moving immediately
        xMove: Math.random() * 40 - 20,
        opacity: Math.random() * 0.5 + 0.1,
      }
    })
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full blur-[1px] ${p.color}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -100],
            x: [0, p.xMove],
            opacity: [p.opacity, 0, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatType: "mirror",
            delay: 0,
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const { t } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30">
      
      {/* --- Full Page Themed Particles --- */}
      <FloatingParticles />

      {/* --- Background Ambient Glows (Updated with Blue/Orange) --- */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Green Glow (Top Left) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-emerald-500/10 rounded-full blur-[120px]"
        />
        {/* Orange Glow (Bottom Right) */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] bg-orange-500/10 rounded-full blur-[120px]"
        />
        {/* Blue Glow (Bottom Left - subtle) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Sticky Glass Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight group-hover:text-emerald-600 transition-colors">
              CEB Solar
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <SmallThemeToggle />
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-emerald-500 transition-colors"
            >
              {t("features")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-emerald-500 transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-emerald-500 transition-colors"
            >
              {t("login")}
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 rounded-full px-6 transition-all hover:scale-105 active:scale-95">
                {t("getStarted")}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative z-10">
        <motion.div
          className="container mx-auto text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <motion.div
              animate={{ 
                y: [0, -5, 0], 
                boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 5px 15px rgba(16, 185, 129, 0.2)", "0px 0px 0px rgba(16, 185, 129, 0)"] 
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 fill-emerald-500/20" />
              {t("portalBadge")}
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 text-balance leading-tight tracking-tight drop-shadow-sm"
          >
            {t("heroTitle")
              .split(" ")
              .map((word, i) => (
                <span
                  key={i}
                  className={
                    i < 2
                      ? "text-foreground"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500"
                  }
                >
                  {word}{" "}
                </span>
              ))}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground/80 mb-10 max-w-2xl mx-auto text-pretty leading-relaxed"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8 h-12 rounded-full shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 text-base font-semibold"
              >
                {t("applyNow")}
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 h-12 rounded-full border-2 hover:bg-emerald-50/50 hover:text-emerald-600 hover:border-emerald-200 transition-all text-base font-medium"
              >
                {t("signIn")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative z-10">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground"
          >
            {t("forAllUsers")}
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Customer Card (GREEN) */}
            <FeatureCard
              icon={<Users className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-500/10"
              title={t("customers")}
              desc={t("customersDesc")}
              link="/register?role=customer"
              linkText={t("customerLogin")}
              colorClass="emerald" // Green Theme
            />

            {/* Installer Card (ORANGE) */}
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-orange-600" />}
              iconBg="bg-orange-500/10"
              title={t("installers")}
              desc={t("installersDesc")}
              link="/register?role=installer"
              linkText={t("installerLogin")}
              colorClass="orange" // Orange Theme
            />

            {/* Officer Card (BLUE) */}
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-500/10"
              title={t("officers")}
              desc={t("officersDesc")}
              link="/login"
              linkText={t("officerLogin")}
              colorClass="blue" // Blue Theme
            />
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border bg-background/50 backdrop-blur-sm z-10 relative">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            <Sun className="w-5 h-5" />
            <span className="font-semibold">CEB Solar</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("footerText")}</p>
        </div>
      </footer>
    </div>
  )
}

// Updated Feature Card to handle Orange/Blue/Green correctly
function FeatureCard({
  icon,
  iconBg,
  title,
  desc,
  link,
  linkText,
  colorClass,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  desc: string
  link: string
  linkText: string
  colorClass: "emerald" | "orange" | "blue"
}) {
  const colorMap = {
    emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/10 group-hover:text-emerald-500",
    orange: "hover:border-orange-500/50 hover:shadow-orange-500/10 group-hover:text-orange-500",
    blue: "hover:border-blue-500/50 hover:shadow-blue-500/10 group-hover:text-blue-500",
  }

  // Helper to get text color class for the link arrow/text
  const getTextColor = () => {
    if (colorClass === "emerald") return "text-emerald-500 group-hover:text-emerald-600"
    if (colorClass === "orange") return "text-orange-500 group-hover:text-orange-600"
    if (colorClass === "blue") return "text-blue-500 group-hover:text-blue-600"
    return ""
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 50 },
        },
      }}
      className={`group p-8 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colorMap[colorClass]}`}
    >
      <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-6 min-h-[3rem]">{desc}</p>
      <Link
        href={link}
        className={`inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all duration-300 ${getTextColor()}`}
      >
        <span>{linkText}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}