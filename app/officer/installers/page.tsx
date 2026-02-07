"use client"

import type React from "react"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Download,
  Star,
  Phone,
  Mail,
  MapPin,
  XCircle,
} from "lucide-react"
import type { DocumentMeta, Installer, InstallerStatus } from "@/lib/auth"

function OfficerInstallersContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const defaultStatus = searchParams.get("status") || "all"

  const [installers, setInstallers] = useState<Installer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState(defaultStatus === "pending" ? "pending" : "all")
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [reason, setReason] = useState("")

  useEffect(() => {
    const fetchInstallers = async () => {
      setLoading(true)
      const res = await fetch("/api/officer/installers")
      const data = await res.json()
      setInstallers(data.installers)
      setLoading(false)
    }

    fetchInstallers()
  }, [])

  const getStatusBadge = (status: InstallerStatus) => {
    const config: Record<InstallerStatus, { label: string; color: string; icon: React.ElementType }> = {
      pending: { label: t("officerInstallersStatusPending"), color: "bg-amber-500/10 text-amber-600", icon: Clock },
      verified: { label: t("officerInstallersStatusVerified"), color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle },
      rejected: { label: t("officerInstallersStatusRejected"), color: "bg-red-500/10 text-red-600", icon: XCircle },
      suspended: { label: t("officerInstallersStatusSuspended"), color: "bg-red-500/10 text-red-600", icon: XCircle },
    }
    const { label, color, icon: Icon } = config[status]
    return (
      <Badge className={color} variant="secondary">
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const filteredInstallers = useMemo(() => {
    return installers.filter((installer) => {
      const matchesSearch =
        installer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        installer.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && installer.status === "pending") ||
        (activeTab === "verified" && installer.status === "verified") ||
        (activeTab === "rejected" && installer.status === "rejected")
      return matchesSearch && matchesTab
    })
  }, [activeTab, installers, searchQuery])

  const refreshInstaller = (installer: Installer) => {
    setInstallers((prev) => prev.map((i) => (i.id === installer.id ? installer : i)))
  }

  const updateStatus = async (status: InstallerStatus, extra?: { rejectionReason?: string; suspendedReason?: string }) => {
    if (!selectedInstaller) return
    const res = await fetch("/api/officer/installers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installerId: selectedInstaller.id, status, ...extra }),
    })
    const data = await res.json()
    if (res.ok) {
      refreshInstaller(data.installer)
      setSelectedInstaller(data.installer)
    } else {
      alert(data.error || t("officerInstallersUpdateFailed"))
    }
  }

  const handleVerify = () => updateStatus("verified")

  const handleReject = async () => {
    await updateStatus("rejected", { rejectionReason: reason })
    setShowRejectDialog(false)
    setReason("")
  }


  const renderDocument = (doc: DocumentMeta, index: number) => (
    <div key={`${doc.fileName}-${index}`} className="flex items-center justify-between p-2 rounded border border-border">
      <div>
        <span className="text-sm text-foreground">{doc.fileName}</span>
        <p className="text-xs text-muted-foreground">
          {t("officerInstallersUploaded")} {new Date(doc.uploadedAt).toLocaleString()}
        </p>
      </div>
      <Button asChild variant="ghost" size="sm" className="h-6 px-2">
        <a href={doc.url} target="_blank" rel="noreferrer">
          <Download className="w-3 h-3 mr-1" />
          {t("officerInstallersView")}
        </a>
      </Button>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("officerInstallersTitle")}</h1>
          <p className="text-muted-foreground">{t("officerInstallersSubtitle")}</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("officerInstallersSearch")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">{t("officerInstallersAll")} ({installers.length})</TabsTrigger>
            <TabsTrigger value="pending">
              {t("officerInstallersPending")} ({installers.filter((i) => i.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              {t("officerInstallersVerified")} ({installers.filter((i) => i.status === "verified").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              {t("officerInstallersRejected")} ({installers.filter((i) => i.status === "rejected").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">{t("officerInstallersListTitle")} ({filteredInstallers.length})</CardTitle>
                <CardDescription>{t("officerInstallersListDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">{t("officerInstallersLoading")}</p>
                ) : (
                  <div className="space-y-4">
                    {filteredInstallers.map((installer) => (
                      <div
                        key={installer.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border border-border hover:border-blue-500/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedInstaller(installer)}
                      >
                        <div className="flex items-start gap-4 mb-4 lg:mb-0">
                          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                            <Building className="w-6 h-6 text-amber-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{installer.companyName}</p>
                              {getStatusBadge(installer.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{installer.id}</p>
                            <p className="text-xs text-muted-foreground mt-1">{installer.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {installer.status === "verified" && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-medium text-foreground">{installer.rating}</span>
                            </div>
                          )}
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="w-4 h-4 mr-1" />
                            {t("officerInstallersReview")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Installer Detail Dialog */}
        <Dialog open={!!selectedInstaller && !showRejectDialog} onOpenChange={() => setSelectedInstaller(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">{t("officerInstallersDetailsTitle")}</DialogTitle>
              <DialogDescription>{selectedInstaller?.id}</DialogDescription>
            </DialogHeader>
            {selectedInstaller && (
              <div className="space-y-6">
                {/* Company Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Building className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{selectedInstaller.companyName}</h3>
                      {getStatusBadge(selectedInstaller.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{selectedInstaller.description}</p>
                    {selectedInstaller.status === "verified" && (
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {selectedInstaller.rating} {t("officerInstallersRating")}
                        </span>
                        <span className="text-muted-foreground">
                          {selectedInstaller.completedInstallations} {t("officerInstallersInstallations")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3">{t("officerInstallersContactInfo")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {selectedInstaller.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {selectedInstaller.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {selectedInstaller.address}
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3">{t("officerInstallersBusinessDetails")}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("officerInstallersVerification")}</p>
                      <p className="text-foreground capitalize">
                        {selectedInstaller.status}
                        {selectedInstaller.verifiedAt && (
                          <span className="text-xs text-muted-foreground block">
                            {t("officerInstallersVerifiedAt")} {new Date(selectedInstaller.verifiedAt).toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3">{t("officerInstallersSubmittedDocuments")}</h4>
                  {selectedInstaller.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("officerInstallersNoDocuments")}</p>
                  ) : (
                    <div className="space-y-2">{selectedInstaller.documents.map(renderDocument)}</div>
                  )}
                </div>

                {/* Packages */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-3">{t("officerInstallersInstallerPackages")}</h4>
                  {selectedInstaller.packages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("officerInstallersNoPackages")}</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedInstaller.packages.map((pkg) => (
                        <div key={pkg.id} className="rounded-lg border border-border p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">{pkg.name}</p>
                            <span className="text-sm text-emerald-600">
                              Rs. {pkg.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {pkg.capacity} • {pkg.panelCount} {t("panels")} • {pkg.panelType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("inverter")}: {pkg.inverterBrand} • {t("warranty")}: {pkg.warranty}
                          </p>
                          {pkg.features.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("officerInstallersFeatures")}: {pkg.features.join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rejection Reason */}
                {selectedInstaller.status === "rejected" && selectedInstaller.rejectionReason && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="font-semibold text-red-500 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {t("officerInstallersRejectionReason")}
                    </h4>
                    <p className="text-sm text-foreground">{selectedInstaller.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex-col sm:flex-row gap-2">
              {selectedInstaller?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500/50 hover:bg-red-500/10 bg-transparent"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {t("officerInstallersRejectButton")}
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleVerify}>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {t("officerInstallersVerifyInstaller")}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">{t("officerInstallersRejectInstaller")}</DialogTitle>
              <DialogDescription>
                {t("officerInstallersRejectDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("officerInstallersRejectionReason")}</Label>
                <Textarea
                  placeholder={t("officerInstallersRejectReasonPlaceholder")}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="bg-transparent">
                {t("cancel")}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleReject}
                disabled={!reason.trim()}
              >
                {t("officerInstallersConfirmRejection")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  )
}

export default function OfficerInstallers() {
  return (
    <Suspense fallback={<InstallersLoading />}>
      <OfficerInstallersContent />
    </Suspense>
  )
}

function InstallersLoading() {
  const { t } = useLanguage()
  return <div>{t("loadingGeneric")}</div>
}
