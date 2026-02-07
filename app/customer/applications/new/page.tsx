"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, ArrowLeft, ArrowRight, CheckCircle, Info, FileText, Home, Zap, Package } from "lucide-react"
import { fetchApplications, fetchInstallers, type Application, type Installer, type SolarPackage } from "@/lib/auth"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/translations"

const nicPattern = /^(?:\d{9}[VvXx]|\d{12})$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\d{10}$/
const accountNumberPattern = /^\d{10}$/

const steps: Array<{ id: number; titleKey: keyof typeof translations; icon: typeof FileText }> = [
  { id: 1, titleKey: "applicationStepPersonalInfo", icon: FileText },
  { id: 2, titleKey: "applicationStepPropertyDetails", icon: Home },
  { id: 3, titleKey: "applicationStepTechnicalInfo", icon: Zap },
  { id: 4, titleKey: "applicationStepDocuments", icon: Upload },
  { id: 5, titleKey: "applicationStepReview", icon: CheckCircle },
]

export default function NewApplication() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const selectedInstallerId = searchParams.get("installerId") || ""
  const selectedPackageId = searchParams.get("packageId") || ""
  const isDirectPurchase = searchParams.get("mode") === "direct"
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [feeAmount, setFeeAmount] = useState<number | null>(null)
  const [feePaid, setFeePaid] = useState(false)
  const [feeInvoiceId, setFeeInvoiceId] = useState<string | null>(null)
  const [feeLoading, setFeeLoading] = useState(false)
  const [feeError, setFeeError] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [selectedPackage, setSelectedPackage] = useState<SolarPackage | null>(null)
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null)
  const [packageLoading, setPackageLoading] = useState(false)
  const [packageError, setPackageError] = useState<string | null>(null)
  const [directApplications, setDirectApplications] = useState<Application[]>([])
  const [selectedApplicationId, setSelectedApplicationId] = useState("")
  const [directAppLoading, setDirectAppLoading] = useState(false)
  const [hasPaymentPending, setHasPaymentPending] = useState(false)
  const [pendingApplicationId, setPendingApplicationId] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    nic: "",
    email: "",
    phone: "",
    address: "",

    // Property Details
    propertyType: "",
    propertyOwnership: "",
    electricityAccountNumber: "",
    tariffCategory: "",

    // Technical Info
    roofType: "",
    roofArea: "",
    roofOrientation: "",
    shading: "",
    monthlyConsumption: "",
    connectionPhase: "",
    desiredCapacity: "",

    // Documents
    nicDocument: null as File | null,
    bankDetails: null as File | null,
    electricityBill: null as File | null,
    propertyDocument: null as File | null,
    confirmSingleSystem: false,
  })
  type FormField = keyof typeof formData

  const updateField = <K extends FormField>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const getStepErrors = (step: number) => {
    const nextErrors: Record<string, string> = {}
    const isBlank = (value: string) => value.trim().length === 0

    if (step === 1) {
      if (isBlank(formData.fullName)) nextErrors.fullName = t("fullNameRequired")
      if (isBlank(formData.nic)) {
        nextErrors.nic = t("nicRequired")
      } else if (!nicPattern.test(formData.nic.trim())) {
        nextErrors.nic = t("nicInvalid")
      }
      if (isBlank(formData.email)) {
        nextErrors.email = t("emailRequired")
      } else if (!emailPattern.test(formData.email.trim())) {
        nextErrors.email = t("emailInvalid")
      }
      if (isBlank(formData.phone)) {
        nextErrors.phone = t("phoneRequired")
      } else if (!phonePattern.test(formData.phone.trim())) {
        nextErrors.phone = t("phoneInvalid")
      }
      if (isBlank(formData.address)) nextErrors.address = t("addressRequired")
    }

    if (step === 2) {
      if (isBlank(formData.propertyType)) nextErrors.propertyType = t("propertyTypeRequired")
      if (isBlank(formData.propertyOwnership)) nextErrors.propertyOwnership = t("propertyOwnershipRequired")
      if (isBlank(formData.electricityAccountNumber)) {
        nextErrors.electricityAccountNumber = t("electricityAccountRequired")
      } else if (!accountNumberPattern.test(formData.electricityAccountNumber.trim())) {
        nextErrors.electricityAccountNumber = t("electricityAccountInvalid")
      }
      if (isBlank(formData.tariffCategory)) nextErrors.tariffCategory = t("tariffCategoryRequired")
    }

    if (step === 3) {
      if (isBlank(formData.roofType)) nextErrors.roofType = t("roofTypeRequired")
      if (isBlank(formData.roofArea)) nextErrors.roofArea = t("roofAreaRequired")
      if (isBlank(formData.roofOrientation)) nextErrors.roofOrientation = t("roofOrientationRequired")
      if (isBlank(formData.shading)) nextErrors.shading = t("shadingRequired")
      if (isBlank(formData.monthlyConsumption)) nextErrors.monthlyConsumption = t("monthlyConsumptionRequired")
      if (isBlank(formData.connectionPhase)) nextErrors.connectionPhase = t("connectionPhaseRequired")
      if (isBlank(formData.desiredCapacity)) nextErrors.desiredCapacity = t("desiredCapacityRequired")
    }

    if (step === 4) {
      if (!formData.nicDocument) nextErrors.nicDocument = t("nicDocumentRequired")
      if (!formData.bankDetails) nextErrors.bankDetails = t("bankDetailsRequired")
      if (!formData.electricityBill) nextErrors.electricityBill = t("electricityBillRequired")
      if (!formData.propertyDocument) nextErrors.propertyDocument = t("propertyDocumentRequired")
    }

    return nextErrors
  }

  const validateAllSteps = () => {
    const stepOrder = [1, 2, 3, 4]
    const merged: Record<string, string> = {}
    let firstInvalidStep = 1
    let foundInvalid = false

    stepOrder.forEach((step) => {
      const stepErrors = getStepErrors(step)
      if (!foundInvalid && Object.keys(stepErrors).length > 0) {
        firstInvalidStep = step
        foundInvalid = true
      }
      Object.assign(merged, stepErrors)
    })

    return { valid: Object.keys(merged).length === 0, errors: merged, firstInvalidStep }
  }

  useEffect(() => {
    if (!selectedPackageId || !selectedInstallerId) return
    let active = true
    setPackageLoading(true)
    setPackageError(null)

    fetchInstallers(true)
      .then((installers) => {
        if (!active) return
        const installer = installers.find((inst) => inst.id === selectedInstallerId) || null
        const pkg = installer?.packages.find((item) => item.id === selectedPackageId) || null
        if (!installer || !pkg) {
          setPackageError(t("selectedPackageNotFound"))
          setSelectedInstaller(null)
          setSelectedPackage(null)
          return
        }
        setSelectedInstaller(installer)
        setSelectedPackage(pkg)
        setFormData((prev) => {
          if (prev.desiredCapacity) return prev
          return { ...prev, desiredCapacity: pkg.capacity }
        })
      })
      .catch((error) => {
        if (!active) return
        setPackageError(error instanceof Error ? error.message : t("unableToLoadPackageDetails"))
      })
      .finally(() => {
        if (active) setPackageLoading(false)
      })

    return () => {
      active = false
    }
  }, [selectedInstallerId, selectedPackageId, t])

  useEffect(() => {
    if (!isDirectPurchase) return
    let active = true
    setDirectAppLoading(true)
    fetchApplications()
      .then((apps) => {
        if (!active) return
        const pending = apps.find((app) => app.status === "payment_pending")
        setHasPaymentPending(Boolean(pending))
        setPendingApplicationId(pending?.id ?? "")
        const eligible = apps.filter((app) =>
          [
            "approved",
            "payment_confirmed",
            "finding_installer",
            "installation_in_progress",
            "installation_complete",
            "final_inspection",
            "agreement_pending",
            "completed",
          ].includes(app.status),
        )
        setDirectApplications(eligible)
      })
      .catch(() => {
        if (!active) return
        setDirectApplications([])
      })
      .finally(() => {
        if (active) setDirectAppLoading(false)
      })

    return () => {
      active = false
    }
  }, [isDirectPurchase])

  const handleNext = () => {
    if (currentStep >= 5) return
    const stepErrors = getStepErrors(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitApplication = async (mode?: "fee") => {
    if (isDirectPurchase && (!selectedPackage || !selectedInstaller)) {
      alert(t("selectValidPackage"))
      return
    }
    if (isDirectPurchase && hasPaymentPending && pendingApplicationId !== selectedApplicationId) {
      alert(t("pendingPaymentWarning"))
      return
    }
    if (isDirectPurchase && !selectedApplicationId) {
      alert(t("selectApprovedApplication"))
      return
    }
    if (!isDirectPurchase && !formData.confirmSingleSystem) {
      alert(t("confirmSingleSystemWarning"))
      return
    }

    setLoading(true)
    try {
      const payload = isDirectPurchase
        ? {
            selectedPackageId: selectedPackage?.id,
            installerOrganizationId: selectedInstaller?.id,
            purchaseMode: "direct",
            applicationId: selectedApplicationId,
          }
        : {
            siteAddress: formData.address,
            systemCapacity: formData.desiredCapacity,
            connectionPhase: formData.connectionPhase,
            confirmSingleSystem: formData.confirmSingleSystem,
            technicalDetails: {
              roofType: formData.roofType,
              roofArea: formData.roofArea,
              monthlyConsumption: formData.monthlyConsumption,
              connectionPhase: formData.connectionPhase,
              propertyType: formData.propertyType,
              propertyOwnership: formData.propertyOwnership,
              tariffCategory: formData.tariffCategory,
              roofOrientation: formData.roofOrientation,
              shading: formData.shading,
              desiredCapacity: formData.desiredCapacity,
            },
          }

      const data = new FormData()
      data.append("meta", JSON.stringify(payload))
      if (!isDirectPurchase) {
        if (formData.nicDocument) data.append("nicDocument", formData.nicDocument)
        if (formData.bankDetails) data.append("bankDetails", formData.bankDetails)
        if (formData.electricityBill) data.append("electricityBill", formData.electricityBill)
        if (formData.propertyDocument) data.append("propertyDocument", formData.propertyDocument)
      }

      const urlMode = isDirectPurchase ? "direct" : mode
      const url = urlMode ? `/api/applications?mode=${urlMode}` : "/api/applications"
      const res = await fetch(url, {
        method: "POST",
        body: data,
      })

      const responseData = await res.json().catch(() => ({}))

      if (res.status === 402) {
        if (responseData.invoiceId) {
          router.push(`/customer/invoices/${responseData.invoiceId}`)
          return
        }
        throw new Error(responseData.error || t("paymentRequired"))
      }

      if (!res.ok) {
        throw new Error(responseData.error || t("unableToSubmitApplication"))
      }

      if (isDirectPurchase && responseData.invoiceId) {
        router.push(`/customer/invoices/${responseData.invoiceId}`)
        return
      }

      if (responseData.paymentRequired && responseData.invoiceId && mode === "fee") {
        router.push(`/customer/invoices/${responseData.invoiceId}`)
        return
      }

      router.push("/customer/applications?success=true")
    } catch (error) {
      alert(error instanceof Error ? error.message : t("unableToSubmitApplication"))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!isDirectPurchase) {
      const { valid, errors: allErrors, firstInvalidStep } = validateAllSteps()
      if (!valid) {
        setErrors(allErrors)
        setCurrentStep(firstInvalidStep)
        return
      }
    }
    await submitApplication()
  }

  useEffect(() => {
    let active = true
    async function loadFee() {
      try {
        const res = await fetch("/api/fees/site-visit/status?ignorePaid=true")
        if (!res.ok) throw new Error(t("unableToLoadSiteVisitFee"))
        const data = await res.json()
        if (!active) return
        setFeeAmount(data.amount ?? null)
        setFeePaid(Boolean(data.paid))
        setFeeInvoiceId(data.invoiceId ?? null)
      } catch (error) {
        if (!active) return
        setFeeError(error instanceof Error ? error.message : t("unableToLoadFee"))
      }
    }
    loadFee()
    return () => {
      active = false
    }
  }, [t])

  useEffect(() => {
    const files: Array<[string, File | null]> = [
      ["nicDocument", formData.nicDocument],
      ["bankDetails", formData.bankDetails],
      ["electricityBill", formData.electricityBill],
      ["propertyDocument", formData.propertyDocument],
    ]
    const nextUrls: Record<string, string> = {}
    const createdUrls: string[] = []

    files.forEach(([key, file]) => {
      if (!file || !file.type.startsWith("image/")) return
      const url = URL.createObjectURL(file)
      nextUrls[key] = url
      createdUrls.push(url)
    })

    setPreviewUrls(nextUrls)
    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [formData.nicDocument, formData.bankDetails, formData.electricityBill, formData.propertyDocument])

  const handlePayFee = async () => {
    setFeeLoading(true)
    setFeeError(null)
    await submitApplication("fee")
    setFeeLoading(false)
  }

  const handleFileChange = (field: string, file: File | null) => {
    updateField(field as FormField, file)
  }

  const progress = (currentStep / 5) * 100

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-6 p-6">
          {/* Header */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              {t("newApplicationTitle")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("newApplicationSubtitle")}</p>
          </div>

          {(isDirectPurchase || selectedPackageId) && (
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  {t("selectedPackage")}
                </CardTitle>
                <CardDescription>{t("directPurchaseDetails")}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {packageLoading ? (
                  <p className="text-sm text-muted-foreground">{t("loadingPackageDetails")}</p>
                ) : packageError ? (
                  <p className="text-sm text-destructive">{packageError}</p>
                ) : selectedPackage && selectedInstaller ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-sm">
                    <div>
                      <p className="font-semibold text-lg text-foreground">{selectedPackage.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedInstaller.companyName} • {selectedPackage.capacity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedPackage.panelCount} {t("panels")} • {selectedPackage.inverterBrand}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t("packagePrice")}</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {t("lkr")} {selectedPackage.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noPackageSelected")}</p>
                )}
              </CardContent>
            </Card>
          )}

          {isDirectPurchase && (
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                <CardTitle className="text-foreground">{t("selectApplication")}</CardTitle>
                <CardDescription>{t("selectApplicationDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {directAppLoading ? (
                  <p className="text-sm text-muted-foreground">{t("loadingApplications")}</p>
                ) : hasPaymentPending ? (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-700">
                      {t("paymentPendingApplication")} ({pendingApplicationId}). {t("pendingPaymentWarning")}
                    </p>
                  </div>
                ) : directApplications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noApprovedApplications")}</p>
                ) : (
                  <>
                    <Label>{t("application")}</Label>
                    <Select value={selectedApplicationId} onValueChange={setSelectedApplicationId}>
                      <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                        <SelectValue placeholder={t("select_application")} />
                      </SelectTrigger>
                      <SelectContent>
                        {directApplications.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {!isDirectPurchase && (
            <>
              {/* Progress */}
              <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon
                      return (
                        <div key={step.id} className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                              currentStep >= step.id 
                                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white scale-110" 
                                : "bg-gray-100 text-muted-foreground"
                            }`}
                          >
                            {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`hidden sm:block w-16 lg:w-24 h-1.5 mx-2 rounded-full transition-all duration-300 ${
                                currentStep > step.id ? "bg-gradient-to-r from-emerald-500 to-green-600" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <Progress value={progress} className="h-2.5 bg-gray-200" />
                  <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
                    {t("stepLabel")} {currentStep} {t("ofLabel")} 5: {t(steps[currentStep - 1].titleKey)}
                  </p>
                </CardContent>
              </Card>

              {/* Form Steps */}
              <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
                  <CardTitle className="text-foreground text-xl">{t(steps[currentStep - 1].titleKey)}</CardTitle>
                  <CardDescription>
                    {currentStep === 1 && t("applicationStepPersonalDescription")}
                    {currentStep === 2 && t("applicationStepPropertyDescription")}
                    {currentStep === 3 && t("applicationStepTechnicalDescription")}
                    {currentStep === 4 && t("applicationStepDocumentsDescription")}
                    {currentStep === 5 && t("applicationStepReviewDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-sm font-medium">{t("fullNameAsPerNic")}</Label>
                          <Input
                            id="fullName"
                            placeholder={t("enterFullName")}
                            value={formData.fullName}
                            onChange={(e) => updateField("fullName", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nic" className="text-sm font-medium">{t("nicNumber")}</Label>
                          <Input
                            id="nic"
                            placeholder={t("enterNic")}
                            value={formData.nic}
                            onChange={(e) => updateField("nic", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          {errors.nic && <p className="text-xs text-destructive">{errors.nic}</p>}
                          <p className="text-xs text-muted-foreground">
                            {t("nicFormatHint")}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">{t("emailAddress")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("enterEmail")}
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">{t("phoneNumber")}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t("enterPhoneNumber")}
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">{t("residentialAddress")}</Label>
                        <Textarea
                          id="address"
                          placeholder={t("enterFullAddress")}
                          value={formData.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                        />
                        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Property Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("propertyType")}</Label>
                          <Select
                            value={formData.propertyType}
                            onValueChange={(value) => updateField("propertyType", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectPropertyType")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">{t("propertyResidential")}</SelectItem>
                              <SelectItem value="commercial">{t("propertyCommercial")}</SelectItem>
                              <SelectItem value="industrial">{t("propertyIndustrial")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {t("propertyTypeHint")}
                          </p>
                          {errors.propertyType && <p className="text-xs text-destructive">{errors.propertyType}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("propertyOwnership")}</Label>
                          <Select
                            value={formData.propertyOwnership}
                            onValueChange={(value) => updateField("propertyOwnership", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectOwnership")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owned">{t("ownershipOwned")}</SelectItem>
                              <SelectItem value="rented">{t("ownershipRented")}</SelectItem>
                              <SelectItem value="leased">{t("ownershipLeased")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.propertyOwnership && <p className="text-xs text-destructive">{errors.propertyOwnership}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber" className="text-sm font-medium">{t("electricityAccountNumber")}</Label>
                          <Input
                            id="accountNumber"
                            placeholder={t("enterElectricityAccount")}
                            value={formData.electricityAccountNumber}
                            onChange={(e) => updateField("electricityAccountNumber", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          <p className="text-xs text-muted-foreground">{t("electricityAccountHint")}</p>
                          {errors.electricityAccountNumber && (
                            <p className="text-xs text-destructive">{errors.electricityAccountNumber}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("tariffCategory")}</Label>
                          <Select
                            value={formData.tariffCategory}
                            onValueChange={(value) => updateField("tariffCategory", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectTariffCategory")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="domestic">{t("tariffDomestic")}</SelectItem>
                              <SelectItem value="general_purpose">{t("tariffGeneralPurpose")}</SelectItem>
                              <SelectItem value="industrial">{t("tariffIndustrial")}</SelectItem>
                              <SelectItem value="hotel">{t("tariffHotel")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.tariffCategory && <p className="text-xs text-destructive">{errors.tariffCategory}</p>}
                        </div>
                      </div>
                      <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl flex items-start gap-3 shadow-sm">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-semibold mb-1">{t("whyNeedThisInfo")}</p>
                          <p>
                            {t("electricityAccountInfoNote")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Technical Info */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("roofType")}</Label>
                          <Select
                            value={formData.roofType}
                            onValueChange={(value) => updateField("roofType", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectRoofType")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flat_concrete">{t("roofFlatConcrete")}</SelectItem>
                              <SelectItem value="sloped_tile">{t("roofSlopedTile")}</SelectItem>
                              <SelectItem value="metal_sheet">{t("roofMetalSheet")}</SelectItem>
                              <SelectItem value="asbestos">{t("roofAsbestos")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">{t("roofTypeHint")}</p>
                          {errors.roofType && <p className="text-xs text-destructive">{errors.roofType}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roofArea" className="text-sm font-medium">{t("availableRoofArea")}</Label>
                          <Input
                            id="roofArea"
                            type="number"
                            placeholder={t("enterRoofArea")}
                            value={formData.roofArea}
                            onChange={(e) => updateField("roofArea", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          <p className="text-xs text-muted-foreground">{t("roofAreaHint")}</p>
                          {errors.roofArea && <p className="text-xs text-destructive">{errors.roofArea}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("roofOrientation")}</Label>
                          <Select
                            value={formData.roofOrientation}
                            onValueChange={(value) => updateField("roofOrientation", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectOrientation")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="south">{t("orientationSouth")}</SelectItem>
                              <SelectItem value="east">{t("orientationEast")}</SelectItem>
                              <SelectItem value="west">{t("orientationWest")}</SelectItem>
                              <SelectItem value="north">{t("orientationNorth")}</SelectItem>
                              <SelectItem value="flat">{t("orientationFlat")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.roofOrientation && <p className="text-xs text-destructive">{errors.roofOrientation}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("shading")}</Label>
                          <Select
                            value={formData.shading}
                            onValueChange={(value) => updateField("shading", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectShading")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{t("shadingNone")}</SelectItem>
                              <SelectItem value="minimal">{t("shadingMinimal")}</SelectItem>
                              <SelectItem value="moderate">{t("shadingModerate")}</SelectItem>
                              <SelectItem value="heavy">{t("shadingHeavy")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            {t("shadingHint")}
                          </p>
                          {errors.shading && <p className="text-xs text-destructive">{errors.shading}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="consumption" className="text-sm font-medium">{t("monthlyConsumptionKwh")}</Label>
                          <Input
                            id="consumption"
                            type="number"
                            placeholder={t("monthlyConsumptionExample")}
                            value={formData.monthlyConsumption}
                            onChange={(e) => updateField("monthlyConsumption", e.target.value)}
                            className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                          />
                          <p className="text-xs text-muted-foreground">{t("monthlyConsumptionHint")}</p>
                          {errors.monthlyConsumption && (
                            <p className="text-xs text-destructive">{errors.monthlyConsumption}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("connectionPhase")}</Label>
                          <Select
                            value={formData.connectionPhase}
                            onValueChange={(value) => updateField("connectionPhase", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectPhase")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">{t("phaseSingle")}</SelectItem>
                              <SelectItem value="three">{t("phaseThree")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.connectionPhase && <p className="text-xs text-destructive">{errors.connectionPhase}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("desiredCapacityKw")}</Label>
                          <Select
                            value={formData.desiredCapacity}
                            onValueChange={(value) => updateField("desiredCapacity", value)}
                          >
                            <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                              <SelectValue placeholder={t("selectCapacity")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 {t("capacity2kw")}</SelectItem>
                              <SelectItem value="3">3 {t("capacity3kw")}</SelectItem>
                              <SelectItem value="5">5 {t("capacity5kw")}</SelectItem>
                              <SelectItem value="10">10 {t("capacity10kw")}</SelectItem>
                              <SelectItem value="custom">{t("capacityCustom")}</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.desiredCapacity && <p className="text-xs text-destructive">{errors.desiredCapacity}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Documents */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-700">
                          <p className="font-semibold mb-1">{t("documentRequirements")}</p>
                          <p>
                            {t("documentRequirementsHint")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NIC Document */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("nicCopyFrontBack")}</Label>
                          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300">
                            {formData.nicDocument ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  <span className="text-sm text-foreground font-medium">{formData.nicDocument.name}</span>
                                  <Button variant="ghost" size="sm" onClick={() => handleFileChange("nicDocument", null)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    {t("remove")}
                                  </Button>
                                </div>
                                {previewUrls.nicDocument && (
                                  <img
                                    src={previewUrls.nicDocument}
                                    alt={t("nicPreviewAlt")}
                                    className="mx-auto max-h-40 w-full rounded-lg border-2 border-emerald-200 bg-white object-contain shadow-md"
                                  />
                                )}
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                                <p className="text-sm text-muted-foreground mb-3">
                                  {t("nicUploadHint")}
                                </p>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="nic-upload"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange("nicDocument", e.target.files?.[0] || null)}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => document.getElementById("nic-upload")?.click()}
                                >
                                  {t("selectFile")}
                                </Button>
                              </>
                            )}
                          </div>
                          {errors.nicDocument && <p className="text-xs text-destructive">{errors.nicDocument}</p>}
                          <p className="text-xs text-muted-foreground">{t("nicSidesHint")}</p>
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("bankAccountDetails")}</Label>
                          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300">
                            {formData.bankDetails ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  <span className="text-sm text-foreground font-medium">{formData.bankDetails.name}</span>
                                  <Button variant="ghost" size="sm" onClick={() => handleFileChange("bankDetails", null)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    {t("remove")}
                                  </Button>
                                </div>
                                {previewUrls.bankDetails && (
                                  <img
                                    src={previewUrls.bankDetails}
                                    alt={t("bankDetailsPreviewAlt")}
                                    className="mx-auto max-h-40 w-full rounded-lg border-2 border-emerald-200 bg-white object-contain shadow-md"
                                  />
                                )}
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                                <p className="text-sm text-muted-foreground mb-3">{t("bankDetailsUploadHint")}</p>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="bank-upload"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange("bankDetails", e.target.files?.[0] || null)}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => document.getElementById("bank-upload")?.click()}
                                >
                                  {t("selectFile")}
                                </Button>
                              </>
                            )}
                          </div>
                          {errors.bankDetails && <p className="text-xs text-destructive">{errors.bankDetails}</p>}
                          <p className="text-xs text-muted-foreground">{t("bankDetailsHint")}</p>
                        </div>

                        {/* Electricity Bill */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("recentElectricityBill")}</Label>
                          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300">
                            {formData.electricityBill ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  <span className="text-sm text-foreground font-medium">{formData.electricityBill.name}</span>
                                  <Button variant="ghost" size="sm" onClick={() => handleFileChange("electricityBill", null)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    {t("remove")}
                                  </Button>
                                </div>
                                {previewUrls.electricityBill && (
                                  <img
                                    src={previewUrls.electricityBill}
                                    alt={t("electricityBillPreviewAlt")}
                                    className="mx-auto max-h-40 w-full rounded-lg border-2 border-emerald-200 bg-white object-contain shadow-md"
                                  />
                                )}
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                                <p className="text-sm text-muted-foreground mb-3">{t("electricityBillUploadHint")}</p>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="bill-upload"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange("electricityBill", e.target.files?.[0] || null)}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => document.getElementById("bill-upload")?.click()}
                                >
                                  {t("selectFile")}
                                </Button>
                              </>
                            )}
                          </div>
                          {errors.electricityBill && <p className="text-xs text-destructive">{errors.electricityBill}</p>}
                        </div>

                        {/* Property Document */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t("propertyOwnershipDocument")}</Label>
                          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300">
                            {formData.propertyDocument ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  <span className="text-sm text-foreground font-medium">{formData.propertyDocument.name}</span>
                                  <Button variant="ghost" size="sm" onClick={() => handleFileChange("propertyDocument", null)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    {t("remove")}
                                  </Button>
                                </div>
                                {previewUrls.propertyDocument && (
                                  <img
                                    src={previewUrls.propertyDocument}
                                    alt={t("propertyDocumentPreviewAlt")}
                                    className="mx-auto max-h-40 w-full rounded-lg border-2 border-emerald-200 bg-white object-contain shadow-md"
                                  />
                                )}
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                                <p className="text-sm text-muted-foreground mb-3">{t("propertyDocumentUploadHint")}</p>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="property-upload"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange("propertyDocument", e.target.files?.[0] || null)}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                  onClick={() => document.getElementById("property-upload")?.click()}
                                >
                                  {t("selectFile")}
                                </Button>
                              </>
                            )}
                          </div>
                          {errors.propertyDocument && <p className="text-xs text-destructive">{errors.propertyDocument}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info Summary */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            {t("personalInformation")}
                          </h3>
                          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-200 space-y-2.5 shadow-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("fullName")}</span>
                              <span className="text-foreground font-medium">{formData.fullName || t("notProvided")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("nic")}</span>
                              <span className="text-foreground font-medium">{formData.nic || t("notProvided")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("email")}</span>
                              <span className="text-foreground font-medium">{formData.email || t("notProvided")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("phone")}</span>
                              <span className="text-foreground font-medium">{formData.phone || t("notProvided")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Property Summary */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                            <Home className="w-5 h-5 text-emerald-600" />
                            {t("propertyDetails")}
                          </h3>
                          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-200 space-y-2.5 shadow-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("propertyType")}</span>
                              <span className="text-foreground font-medium capitalize">{formData.propertyType || t("notProvided")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("ownership")}</span>
                              <span className="text-foreground font-medium capitalize">
                                {formData.propertyOwnership || t("notProvided")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("accountNumber")}</span>
                              <span className="text-foreground font-medium">{formData.electricityAccountNumber || t("notProvided")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("tariff")}</span>
                              <span className="text-foreground font-medium capitalize">{formData.tariffCategory || t("notProvided")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Technical Summary */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                            <Zap className="w-5 h-5 text-emerald-600" />
                            {t("technicalInformation")}
                          </h3>
                          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-200 space-y-2.5 shadow-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("roofType")}</span>
                              <span className="text-foreground font-medium capitalize">
                                {formData.roofType?.replace("_", " ") || t("notProvided")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("roofArea")}</span>
                              <span className="text-foreground font-medium">
                                {formData.roofArea ? `${formData.roofArea} ${t("m2")}` : t("notProvided")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("monthlyUsage")}</span>
                              <span className="text-foreground font-medium">
                                {formData.monthlyConsumption ? `${formData.monthlyConsumption} ${t("kwh")}` : t("notProvided")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-sm">{t("desiredCapacity")}</span>
                              <span className="text-foreground font-medium">
                                {formData.desiredCapacity ? `${formData.desiredCapacity} ${t("kw")}` : t("notProvided")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Documents Summary */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                            <Upload className="w-5 h-5 text-emerald-600" />
                            {t("documents")}
                          </h3>
                          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/50 to-green-50/50 border border-emerald-200 space-y-2.5 shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">{t("nicCopy")}</span>
                              {formData.nicDocument ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <span className="text-amber-600 text-sm font-medium">{t("missing")}</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">{t("bankDetails")}</span>
                              {formData.bankDetails ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <span className="text-amber-600 text-sm font-medium">{t("missing")}</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">{t("electricityBill")}</span>
                              {formData.electricityBill ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <span className="text-amber-600 text-sm font-medium">{t("missing")}</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">{t("propertyDocument")}</span>
                              {formData.propertyDocument ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <span className="text-amber-600 text-sm font-medium">{t("missing")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl shadow-sm">
                        <p className="text-sm text-emerald-700">
                          <strong>{t("noteLabel")}</strong> {t("applicationConfirmationNote")}
                        </p>
                      </div>
                      <div className="p-5 rounded-xl border-2 border-emerald-200 bg-white shadow-sm">
                        <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 accent-emerald-600"
                            checked={formData.confirmSingleSystem}
                            onChange={(e) => setFormData({ ...formData, confirmSingleSystem: e.target.checked })}
                          />
                          <span>
                            {t("confirmSingleSystemText")}
                          </span>
                        </label>
                      </div>

                      <div className="p-5 rounded-xl border-2 border-emerald-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground text-lg">{t("siteVisitFee")}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {feeAmount !== null ? `${t("lkr")} ${feeAmount}` : t("loadingFee")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {feePaid ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 border shadow-sm px-3 py-1">{t("paid")}</Badge>
                            ) : (
                              <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 border shadow-sm px-3 py-1">{t("unpaid")}</Badge>
                            )}
                          </div>
                        </div>
                        {feeError && (
                          <p className="text-sm text-destructive mt-2">{feeError}</p>
                        )}
                        {!feePaid && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {t("siteVisitFeePaymentNote")}
                          </p>
                        )}
                        {isDirectPurchase && (
                          <p className="text-xs text-emerald-600 mt-2">
                            {t("directPurchaseCreatesInvoice")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t-2 border-emerald-100">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("back")}
                    </Button>
                    {currentStep < 5 ? (
                      <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105" onClick={handleNext}>
                        {t("next")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        onClick={handleSubmit}
                        disabled={loading || (!isDirectPurchase && !formData.confirmSingleSystem)}
                      >
                        {loading ? t("submitting") : t("submitApplication")}
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {isDirectPurchase && (
            <Card className="border-emerald-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground text-lg">{t("proceedToPayment")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("proceedToPaymentHint")}
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  onClick={handleSubmit}
                  disabled={loading || !selectedApplicationId || hasPaymentPending}
                >
                  {loading ? t("creatingInvoice") : t("proceedToPayment")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}