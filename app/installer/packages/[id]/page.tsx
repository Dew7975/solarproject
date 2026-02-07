"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { VerificationPendingCard } from "@/components/verification-pending-card"

import { ArrowLeft, Package, Plus, X, Sparkles, AlertTriangle, ShieldCheck, Wand2 } from "lucide-react"

import { fetchCurrentUser, fetchInstallers } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

const commonFeatures = [
  { value: "Free installation", key: "edit_package_feature_free_installation" },
  { value: "Net metering setup", key: "edit_package_feature_net_metering" },
  { value: "Monitoring system", key: "edit_package_feature_monitoring" },
  { value: "Battery backup option", key: "edit_package_feature_battery_backup" },
  { value: "24/7 support", key: "edit_package_feature_support_247" },
  { value: "Annual maintenance", key: "edit_package_feature_annual_maintenance" },
] as const

function parsePanelType(panelType: string) {
  const lower = panelType.toLowerCase()
  const candidates = ["monocrystalline", "polycrystalline", "thin_film"]
  const matched = candidates.find((value) => lower.includes(value)) ?? ""
  const brand = matched ? panelType.replace(new RegExp(matched, "i"), "").trim() : panelType
  return { panelType: matched, panelBrand: brand }
}

function parseWarrantyYears(warranty: string) {
  const match = warranty.match(/(\d+)/)
  return match?.[1] ?? ""
}

/* ---------- UI helpers (no logic changes) ---------- */

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

function FieldCard({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string
  icon?: React.ElementType
  description?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
        <CardHeader className="py-4">
          <CardTitle className="text-foreground flex items-center gap-2">
            {Icon ? (
              <span className="h-9 w-9 rounded-2xl grid place-items-center bg-yellow-400/20 border border-yellow-500/20">
                <Icon className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
              </span>
            ) : null}
            <span className="leading-tight">{title}</span>
          </CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </motion.div>
  )
}

export default function EditPackage() {
  const { t } = useLanguage()

  const router = useRouter()
  const params = useParams<{ id: string }>()
  const packageId = params.id

  const [loading, setLoading] = useState(false)
  const [loadingPackage, setLoadingPackage] = useState(true)
  const [error, setError] = useState("")
  const [customFeature, setCustomFeature] = useState("")
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    panelCount: "",
    panelType: "",
    panelBrand: "",
    inverterType: "",
    inverterBrand: "",
    warrantyYears: "",
    price: "",
    description: "",
    installationDays: "",
    features: [] as string[],
  })

  useEffect(() => {
    let active = true
    async function loadPackage() {
      try {
        const user = await fetchCurrentUser()
        const installers = await fetchInstallers(false)
        const installer = installers.find((inst) => inst.id === user?.organization?.id)
        const verified = Boolean(installer?.verified)

        if (!active) return
        setIsVerified(verified)

        if (!verified) return

        const pkg = installer?.packages.find((item) => item.id === packageId)
        if (!pkg) throw new Error(t("edit_package_error_not_found"))

        const parsedPanel = parsePanelType(pkg.panelType ?? "")
        const warrantyYears = parseWarrantyYears(pkg.warranty ?? "")

        if (!active) return
        setFormData((prev) => ({
          ...prev,
          name: pkg.name ?? "",
          capacity: pkg.capacity ?? "",
          description: pkg.description ?? "",
          panelCount: String(pkg.panelCount ?? ""),
          panelType: parsedPanel.panelType,
          panelBrand: parsedPanel.panelBrand,
          inverterType: pkg.inverterType ?? "",
          inverterBrand: pkg.inverterBrand ?? "",
          installationDays: pkg.installationDays ? String(pkg.installationDays) : "",
          warrantyYears,
          price: String(pkg.price ?? ""),
          features: pkg.features ?? [],
        }))
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : t("edit_package_error_load"))
      } finally {
        if (!active) return
        setLoadingPackage(false)
      }
    }

    loadPackage()
    return () => {
      active = false
    }
  }, [packageId, t])

  const selectedFeatures = useMemo(() => new Set(formData.features), [formData.features])

  const handleFeatureToggle = (featureValue: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureValue)
        ? prev.features.filter((f) => f !== featureValue)
        : [...prev.features, featureValue],
    }))
  }

  const addCustomFeature = () => {
    if (customFeature.trim() && !formData.features.includes(customFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, customFeature.trim()],
      }))
      setCustomFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const panelType = [formData.panelBrand, formData.panelType].filter(Boolean).join(" ").trim()

      // NOTE: Keeping these stored values in English (data consistency across languages)
      const warranty = formData.warrantyYears ? `${formData.warrantyYears} years` : "Standard warranty"

      const res = await fetch(`/api/installers/packages/${packageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          capacity: formData.capacity,
          description: formData.description.trim(),
          panelCount: Number(formData.panelCount || 0),
          panelType: panelType || "Standard panels",
          inverterType: formData.inverterType || null,
          inverterBrand: formData.inverterBrand || formData.inverterType || "Standard inverter",
          installationDays: formData.installationDays ? Number(formData.installationDays) : null,
          warranty,
          price: Number(formData.price || 0),
          features: formData.features,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("edit_package_error_update"))
      }

      router.push("/installer/packages?updated=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("edit_package_error_update"))
    } finally {
      setLoading(false)
    }
  }

  // UI-only completion meter (does not affect submit logic)
  const completeness = useMemo(() => {
    const checks = [
      Boolean(formData.name.trim()),
      Boolean(formData.capacity),
      Boolean(formData.description.trim()),
      Boolean(formData.price),
      Boolean(formData.panelCount),
      Boolean(formData.panelType),
      Boolean(formData.panelBrand.trim()),
      Boolean(formData.inverterType),
      Boolean(formData.inverterBrand.trim()),
      Boolean(formData.warrantyYears),
      // installationDays is optional in your form; do not count it as required here
      formData.features.length > 0,
    ]
    const done = checks.filter(Boolean).length
    const total = checks.length
    return { done, total, pct: Math.round((done / total) * 100) }
  }, [formData])

  if (!loadingPackage && isVerified === false) {
    return (
      <DashboardLayout>
        <VerificationPendingCard />
      </DashboardLayout>
    )
  }

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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <Link href="/installer/packages">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </Link>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
                        <Sparkles className="h-5 w-5 text-yellow-950/80" />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
                          {t("edit_package_title")}
                        </h1>
                        <p className="text-xs text-muted-foreground truncate">
                          {t("edit_package_subtitle")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-yellow-500/25 bg-yellow-400/15 px-3 py-1.5">
                        <Wand2 className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                        <span className="text-xs font-semibold text-yellow-900 dark:text-yellow-200">
                          {completeness.pct}% complete ({completeness.done}/{completeness.total})
                        </span>
                      </div>

                      <div className="h-2 w-40 sm:w-56 rounded-full bg-yellow-950/10 dark:bg-yellow-50/10 overflow-hidden">
                        <motion.div
                          className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${completeness.pct}%` }}
                          transition={{ type: "spring", stiffness: 120, damping: 18 }}
                        />
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} className="self-start">
                  <Button
                    type="submit"
                    form="edit-package-form"
                    className="rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold shadow-sm"
                    disabled={loading || loadingPackage}
                  >
                    {loading ? t("edit_package_saving") : t("edit_package_save_changes")}
                  </Button>
                </motion.div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 rounded-3xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <span className="min-w-0">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {loadingPackage ? (
            <Card className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="py-10">
                <div className="space-y-3">
                  <div className="h-4 w-52 rounded bg-yellow-500/10 animate-pulse" />
                  <div className="h-20 w-full rounded-2xl bg-yellow-500/10 animate-pulse" />
                  <div className="h-20 w-full rounded-2xl bg-yellow-500/10 animate-pulse" />
                </div>
                <p className="mt-4 text-center text-muted-foreground">{t("edit_package_loading")}</p>
              </CardContent>
            </Card>
          ) : (
            <form id="edit-package-form" onSubmit={handleSubmit} className="space-y-3">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-3"
              >
                {/* LEFT */}
                <div className="lg:col-span-3 space-y-3">
                  <FieldCard
                    title={t("edit_package_info_title")}
                    icon={Package}
                    description={t("edit_package_info_desc")}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("edit_package_label_name")}</Label>
                          <Input
                            id="name"
                            placeholder={t("edit_package_ph_name")}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="capacity">{t("edit_package_label_capacity")}</Label>
                          <Select
                            value={formData.capacity}
                            onValueChange={(value) => setFormData({ ...formData, capacity: value })}
                          >
                            <SelectTrigger className="rounded-2xl border-yellow-500/25 bg-background/60">
                              <SelectValue placeholder={t("edit_package_ph_capacity")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 kW</SelectItem>
                              <SelectItem value="3">3 kW</SelectItem>
                              <SelectItem value="5">5 kW</SelectItem>
                              <SelectItem value="10">10 kW</SelectItem>
                              <SelectItem value="15">15 kW</SelectItem>
                              <SelectItem value="20">20 kW+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">{t("edit_package_label_description")}</Label>
                        <Textarea
                          id="description"
                          placeholder={t("edit_package_ph_description")}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="rounded-2xl border-yellow-500/25 bg-background/60"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="price">{t("edit_package_label_price")}</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder={t("edit_package_ph_price")}
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="installationDays">{t("edit_package_label_install_days")}</Label>
                          <Input
                            id="installationDays"
                            type="number"
                            placeholder={t("edit_package_ph_install_days")}
                            value={formData.installationDays}
                            onChange={(e) =>
                              setFormData({ ...formData, installationDays: e.target.value })
                            }
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>
                      </div>
                    </div>
                  </FieldCard>

                  <FieldCard title={t("edit_package_tech_title")} description={t("edit_package_tech_desc")}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="panelCount">{t("edit_package_label_panel_count")}</Label>
                          <Input
                            id="panelCount"
                            type="number"
                            placeholder={t("edit_package_ph_panel_count")}
                            value={formData.panelCount}
                            onChange={(e) => setFormData({ ...formData, panelCount: e.target.value })}
                            required
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{t("edit_package_label_panel_type")}</Label>
                          <Select
                            value={formData.panelType}
                            onValueChange={(value) => setFormData({ ...formData, panelType: value })}
                          >
                            <SelectTrigger className="rounded-2xl border-yellow-500/25 bg-background/60">
                              <SelectValue placeholder={t("edit_package_ph_select_type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monocrystalline">{t("edit_package_option_mono")}</SelectItem>
                              <SelectItem value="polycrystalline">{t("edit_package_option_poly")}</SelectItem>
                              <SelectItem value="thin_film">{t("edit_package_option_thin")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="panelBrand">{t("edit_package_label_panel_brand")}</Label>
                          <Input
                            id="panelBrand"
                            placeholder={t("edit_package_ph_panel_brand")}
                            value={formData.panelBrand}
                            onChange={(e) => setFormData({ ...formData, panelBrand: e.target.value })}
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>{t("edit_package_label_inverter_type")}</Label>
                          <Select
                            value={formData.inverterType}
                            onValueChange={(value) => setFormData({ ...formData, inverterType: value })}
                          >
                            <SelectTrigger className="rounded-2xl border-yellow-500/25 bg-background/60">
                              <SelectValue placeholder={t("edit_package_ph_select_type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">
                                {t("edit_package_option_inverter_string")}
                              </SelectItem>
                              <SelectItem value="micro">{t("edit_package_option_inverter_micro")}</SelectItem>
                              <SelectItem value="hybrid">
                                {t("edit_package_option_inverter_hybrid")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="inverterBrand">{t("edit_package_label_inverter_brand")}</Label>
                          <Input
                            id="inverterBrand"
                            placeholder={t("edit_package_ph_inverter_brand")}
                            value={formData.inverterBrand}
                            onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value })}
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="warrantyYears">{t("edit_package_label_warranty_years")}</Label>
                          <Input
                            id="warrantyYears"
                            type="number"
                            placeholder={t("edit_package_ph_warranty_years")}
                            value={formData.warrantyYears}
                            onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })}
                            required
                            className="rounded-2xl border-yellow-500/25 bg-background/60"
                          />
                        </div>
                      </div>
                    </div>
                  </FieldCard>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-2 space-y-3">
                  <FieldCard title={t("edit_package_features_title")} description={t("edit_package_features_desc")}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {commonFeatures.map((feature) => (
                          <label
                            key={feature.value}
                            htmlFor={feature.value}
                            className="flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-background/40 p-2 cursor-pointer hover:bg-yellow-500/5 transition"
                          >
                            <Checkbox
                              id={feature.value}
                              checked={selectedFeatures.has(feature.value)}
                              onCheckedChange={() => handleFeatureToggle(feature.value)}
                            />
                            <span className="text-sm text-foreground">{t(feature.key)}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder={t("edit_package_ph_custom_feature")}
                          value={customFeature}
                          onChange={(e) => setCustomFeature(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFeature())}
                          className="rounded-2xl border-yellow-500/25 bg-background/60"
                        />
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addCustomFeature}
                            className="rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>

                      {formData.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.features.map((feature) => (
                            <span
                              key={feature}
                              className="inline-flex items-center gap-1 rounded-full border border-yellow-500/25 bg-yellow-400/15 px-3 py-1 text-sm text-yellow-900 dark:text-yellow-200"
                            >
                              {feature}
                              <button
                                type="button"
                                onClick={() => removeFeature(feature)}
                                className="text-yellow-900/70 dark:text-yellow-100/70 hover:text-yellow-900 dark:hover:text-yellow-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </FieldCard>

                  {/* Actions */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="lg:sticky lg:top-4">
                    <Card className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-background/70 to-orange-500/10 shadow-sm">
                      <CardHeader className="py-4">
                        <CardTitle className="text-foreground">Actions</CardTitle>
                        <CardDescription>Update your package details</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        <Link href="/installer/packages" className="block">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-2xl border-yellow-500/25 bg-background/50 hover:bg-yellow-500/10"
                          >
                            {t("edit_package_cancel")}
                          </Button>
                        </Link>

                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            type="submit"
                            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-yellow-950 font-extrabold shadow-sm disabled:opacity-50"
                            disabled={loading}
                          >
                            {loading ? t("edit_package_saving") : t("edit_package_save_changes")}
                          </Button>
                        </motion.div>

                        <p className="text-[11px] text-muted-foreground">
                          Completion:{" "}
                          <span className="font-semibold text-foreground">{completeness.pct}%</span>
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}