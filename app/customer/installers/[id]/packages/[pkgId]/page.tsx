"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

import { useLanguage } from "@/context/LanguageContext"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ArrowLeft,
  Building,
  Star,
  CheckCircle,
  Zap,
  Sun,
  Shield,
  Gavel,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

import {
  fetchApplications,
  fetchInstallers,
  type Application,
  type Installer,
  type SolarPackage,
} from "@/lib/auth"

export default function PackageDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()

  const installerId = params.id as string
  const packageId = params.pkgId as string

  const [installer, setInstaller] = useState<Installer | null>(null)
  const [pkg, setPkg] = useState<SolarPackage | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [hasPaymentPending, setHasPaymentPending] = useState(false)

  const [openBidDialog, setOpenBidDialog] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState("")
  const [bidDuration, setBidDuration] = useState("7")
  const [requirements, setRequirements] = useState("")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [installerList, applicationList] = await Promise.all([
          fetchInstallers(true),
          fetchApplications(),
        ])

        const foundInstaller = installerList.find((i) => i.id === installerId)
        if (!foundInstaller) {
          setError(t("installer_not_found"))
          return
        }

        const foundPackage = foundInstaller.packages.find(
          (p) => p.id === packageId,
        )
        if (!foundPackage) {
          setError(t("package_not_found"))
          return
        }

        setInstaller(foundInstaller)
        setPkg(foundPackage)
        setHasPaymentPending(
          applicationList.some((app) => app.status === "payment_pending"),
        )

        setApplications(
          applicationList.filter((app) =>
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
          ),
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unable_to_load_data"))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [installerId, packageId])

  async function handleCreateBid() {
    if (!selectedApplication) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApplication,
          durationHours: Number(bidDuration) * 24,
          requirements,
          bidType: "specific",
          selectedPackageId: packageId,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t("unable_to_create_bid"))
      }

      setOpenBidDialog(false)
      router.push("/customer/bids")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unable_to_create_bid"))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
          {t("loading_package_details")}
        </div>
      </DashboardLayout>
    )
  }

  if (error || !installer || !pkg) {
    return (
      <DashboardLayout>
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <p className="text-destructive font-medium">{error ?? t("packageUnavailable")}</p>
          <Link href="/customer/installers">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToInstallers")}
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 py-6">
        
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Link href={`/customer/installers`}>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-slate-200 hover:bg-slate-100 transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{pkg.name}</h1>
            <p className="text-muted-foreground font-medium">
              {t("by")} <span className="text-emerald-600">{installer.companyName}</span>
            </p>
          </div>
        </div>

        {/* Installer Info Card */}
        <Card className="border-none shadow-lg bg-white overflow-hidden ring-1 ring-slate-900/5">
          <CardContent className="p-8 flex justify-between flex-wrap gap-6 items-center">
            <div className="flex gap-5 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center border border-emerald-100 shadow-sm shrink-0">
                <Building className="w-9 h-9 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900">{installer.companyName}</h3>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    {t("verified")}
                  </Badge>
                </div>
                <div className="space-y-1 pt-1">
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {installer.address}
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500 flex-wrap">
                        <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {installer.phone}
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {installer.email}
                        </p>
                    </div>
                </div>
              </div>
            </div>
            <div className="text-center px-6 py-3 bg-slate-50 rounded-xl border border-slate-100 min-w-[100px]">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xl font-bold text-slate-800">{installer.rating}</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("rating")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Package Specs */}
        <Card className="shadow-md border-slate-200">
          <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <CardTitle className="text-xl text-slate-800">{t("package_overview")}</CardTitle>
            <CardDescription className="text-slate-500">
              {t("installation_details_pricing")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                     <Sun className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t("capacity")}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 pl-1">{pkg.capacity}</p>
            </div>
            
            <div className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                     <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t("panels")}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 pl-1">{pkg.panelCount}</p>
            </div>

            <div className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
                     <Shield className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{t("warranty")}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 pl-1">{pkg.warranty}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href={`/customer/applications/new?installerId=${installer.id}&packageId=${pkg.id}&mode=direct`}
          >
            <Button
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20 px-8 py-6 text-lg h-auto transition-all hover:-translate-y-0.5"
              disabled={hasPaymentPending}
              title={
                hasPaymentPending
                  ? t("pendingPaymentTooltip")
                  : undefined
              }
            >
              {t("buy_package")}
            </Button>
          </Link>

          <Dialog open={openBidDialog} onOpenChange={setOpenBidDialog}>
            <DialogTrigger asChild>
            
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">{t("request_bid_title")}</DialogTitle>
                <DialogDescription className="text-slate-500">
                  {t("request_bid_for")} <span className="font-medium text-emerald-600">{installer.companyName}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-4">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">{t("application")}</Label>
                    <Select
                    value={selectedApplication}
                    onValueChange={setSelectedApplication}
                    >
                    <SelectTrigger className="w-full h-11 border-slate-200 focus:ring-emerald-500">
                        <SelectValue placeholder={t("select_application")} />
                    </SelectTrigger>
                    <SelectContent>
                        {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                            {app.id}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">{t("bid_duration")}</Label>
                    <Select value={bidDuration} onValueChange={setBidDuration}>
                    <SelectTrigger className="w-full h-11 border-slate-200 focus:ring-emerald-500">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="3">{t("days3")}</SelectItem>
                        <SelectItem value="5">{t("days5")}</SelectItem>
                        <SelectItem value="7">{t("days7")}</SelectItem>
                        <SelectItem value="10">{t("days10")}</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">{t("requirements")}</Label>
                    <Textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder={t("special_requirements_placeholder")}
                    className="min-h-[100px] border-slate-200 focus:ring-emerald-500 resize-none"
                    />
                </div>

                <Button
                  onClick={handleCreateBid}
                  disabled={!selectedApplication || submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-medium mt-2"
                >
                  {submitting ? t("sending") : t("send_bid_request")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </DashboardLayout>
  )
}