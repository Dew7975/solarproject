"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Package, Plus, X } from "lucide-react"
import { VerificationPendingCard } from "@/components/verification-pending-card"
import { fetchCurrentUser, fetchInstallers } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"

const commonFeatures = [
  { value: "Free installation", key: "new_package_feature_free_installation" },
  { value: "Net metering setup", key: "new_package_feature_net_metering" },
  { value: "Monitoring system", key: "new_package_feature_monitoring" },
  { value: "Battery backup option", key: "new_package_feature_battery_backup" },
  { value: "24/7 support", key: "new_package_feature_support_247" },
  { value: "Annual maintenance", key: "new_package_feature_annual_maintenance" },
] as const

export default function NewPackage() {
  const { t } = useLanguage()

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [customFeature, setCustomFeature] = useState("")
  const [checkingStatus, setCheckingStatus] = useState(true)
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
    async function loadStatus() {
      try {
        const user = await fetchCurrentUser()
        const installers = await fetchInstallers(false)
        const installer = installers.find((inst) => inst.id === user?.organization?.id)
        if (!active) return
        setIsVerified(Boolean(installer?.verified))
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : t("new_package_error_load_status"))
        setIsVerified(false)
      } finally {
        if (!active) return
        setCheckingStatus(false)
      }
    }

    loadStatus()
    return () => {
      active = false
    }
  }, [t])

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
    setError("")

    const trimmedName = formData.name.trim()
    const trimmedDescription = formData.description.trim()
    const trimmedPanelBrand = formData.panelBrand.trim()
    const trimmedInverterBrand = formData.inverterBrand.trim()

    const requiredFieldsFilled =
      trimmedName &&
      formData.capacity &&
      trimmedDescription &&
      formData.price &&
      formData.installationDays &&
      formData.panelCount &&
      formData.panelType &&
      trimmedPanelBrand &&
      formData.inverterType &&
      trimmedInverterBrand &&
      formData.warrantyYears &&
      formData.features.length > 0

    if (!requiredFieldsFilled) {
      setError(t("new_package_error_required_fields"))
      return
    }

    setLoading(true)
    try {
      const panelType = [formData.panelBrand, formData.panelType].filter(Boolean).join(" ").trim()

      // NOTE: keep stored values in English for consistency
      const warranty = formData.warrantyYears ? `${formData.warrantyYears} years` : "Standard warranty"

      const res = await fetch("/api/installers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          capacity: formData.capacity,
          description: trimmedDescription,
          panelCount: Number(formData.panelCount || 0),
          panelType: panelType || "Standard panels",
          inverterType: formData.inverterType || null,
          inverterBrand: trimmedInverterBrand || formData.inverterType || "Standard inverter",
          installationDays: formData.installationDays ? Number(formData.installationDays) : null,
          warranty,
          price: Number(formData.price || 0),
          features: formData.features,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("new_package_error_create"))
      }

      router.push("/installer/packages?success=true")
    } catch (error) {
      alert(error instanceof Error ? error.message : t("new_package_error_create"))
    } finally {
      setLoading(false)
    }
  }

  const isFormComplete =
    formData.name.trim() &&
    formData.capacity &&
    formData.description.trim() &&
    formData.price &&
    formData.installationDays &&
    formData.panelCount &&
    formData.panelType &&
    formData.panelBrand.trim() &&
    formData.inverterType &&
    formData.inverterBrand.trim() &&
    formData.warrantyYears &&
    formData.features.length > 0

  if (checkingStatus) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          {t("new_package_loading_form")}
        </div>
      </DashboardLayout>
    )
  }

  if (isVerified === false) {
    return (
      <DashboardLayout>
        <VerificationPendingCard />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/installer/packages">
            <Button
              variant="ghost"
              size="icon"
              className="bg-transparent hover:bg-amber-500/10 text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("new_package_title")}</h1>
            <p className="text-muted-foreground">{t("new_package_subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-background to-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                {t("new_package_info_title")}
              </CardTitle>
              <CardDescription>{t("new_package_info_desc")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("new_package_label_name")}</Label>
                  <Input
                    id="name"
                    placeholder={t("new_package_ph_name")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">{t("new_package_label_capacity")}</Label>
                  <Select
                    value={formData.capacity}
                    onValueChange={(value) => setFormData({ ...formData, capacity: value })}
                  >
                    <SelectTrigger className="border-amber-500/25 focus:ring-amber-500/30">
                      <SelectValue placeholder={t("new_package_ph_capacity")} />
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
                <Label htmlFor="description">{t("new_package_label_description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("new_package_ph_description")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  className="border-amber-500/25 focus-visible:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{t("new_package_label_price")}</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder={t("new_package_ph_price")}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installationDays">{t("new_package_label_install_days")}</Label>
                  <Input
                    id="installationDays"
                    type="number"
                    placeholder={t("new_package_ph_install_days")}
                    value={formData.installationDays}
                    onChange={(e) => setFormData({ ...formData, installationDays: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specs */}
          <Card className="border-amber-500/20 bg-gradient-to-br from-yellow-500/5 via-background to-amber-500/10">
            <CardHeader>
              <CardTitle className="text-foreground">{t("new_package_tech_title")}</CardTitle>
              <CardDescription>{t("new_package_tech_desc")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panelCount">{t("new_package_label_panel_count")}</Label>
                  <Input
                    id="panelCount"
                    type="number"
                    placeholder={t("new_package_ph_panel_count")}
                    value={formData.panelCount}
                    onChange={(e) => setFormData({ ...formData, panelCount: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("new_package_label_panel_type")}</Label>
                  <Select
                    value={formData.panelType}
                    onValueChange={(value) => setFormData({ ...formData, panelType: value })}
                  >
                    <SelectTrigger className="border-amber-500/25 focus:ring-amber-500/30">
                      <SelectValue placeholder={t("new_package_ph_select_type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monocrystalline">{t("new_package_option_mono")}</SelectItem>
                      <SelectItem value="polycrystalline">{t("new_package_option_poly")}</SelectItem>
                      <SelectItem value="thin_film">{t("new_package_option_thin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panelBrand">{t("new_package_label_panel_brand")}</Label>
                  <Input
                    id="panelBrand"
                    placeholder={t("new_package_ph_panel_brand")}
                    value={formData.panelBrand}
                    onChange={(e) => setFormData({ ...formData, panelBrand: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("new_package_label_inverter_type")}</Label>
                  <Select
                    value={formData.inverterType}
                    onValueChange={(value) => setFormData({ ...formData, inverterType: value })}
                  >
                    <SelectTrigger className="border-amber-500/25 focus:ring-amber-500/30">
                      <SelectValue placeholder={t("new_package_ph_select_type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">{t("new_package_option_inverter_string")}</SelectItem>
                      <SelectItem value="micro">{t("new_package_option_inverter_micro")}</SelectItem>
                      <SelectItem value="hybrid">{t("new_package_option_inverter_hybrid")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inverterBrand">{t("new_package_label_inverter_brand")}</Label>
                  <Input
                    id="inverterBrand"
                    placeholder={t("new_package_ph_inverter_brand")}
                    value={formData.inverterBrand}
                    onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyYears">{t("new_package_label_warranty_years")}</Label>
                  <Input
                    id="warrantyYears"
                    type="number"
                    placeholder={t("new_package_ph_warranty_years")}
                    value={formData.warrantyYears}
                    onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })}
                    required
                    className="border-amber-500/25 focus-visible:ring-amber-500/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-background to-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-foreground">{t("new_package_features_title")}</CardTitle>
              <CardDescription>{t("new_package_features_desc")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonFeatures.map((feature) => (
                  <div key={feature.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.value}
                      checked={formData.features.includes(feature.value)}
                      onCheckedChange={() => handleFeatureToggle(feature.value)}
                    />
                    <label htmlFor={feature.value} className="text-sm text-foreground cursor-pointer">
                      {t(feature.key)}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={t("new_package_ph_custom_feature")}
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFeature())}
                  className="border-amber-500/25 focus-visible:ring-amber-500/30"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomFeature}
                  className="bg-transparent border-amber-500/30 hover:bg-amber-500/10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/10 text-amber-800 dark:text-amber-200 text-sm border border-amber-500/20"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="hover:text-amber-900 dark:hover:text-amber-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/installer/packages">
              <Button variant="outline" className="bg-transparent border-amber-500/30 hover:bg-amber-500/10">
                {t("new_package_cancel")}
              </Button>
            </Link>

            <Button
              type="submit"
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-500 hover:to-orange-600 text-white"
              disabled={loading || !isFormComplete}
            >
              {loading ? t("new_package_creating") : t("new_package_create_btn")}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}