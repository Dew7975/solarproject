// final/app/customer/installers/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Search,
  Building,
  Star,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  AlertCircle,
  Filter,
} from "lucide-react";

import { fetchInstallers, fetchCurrentUser, type Installer } from "@/lib/auth";
import { formatCapacityForFiltering } from "@/lib/utils";

export default function CustomerInstallers() {
  const router = useRouter();

  // State
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [filteredInstallers, setFilteredInstallers] = useState<Installer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [approvedCapacity, setApprovedCapacity] = useState<string | null>(null);
  const [hasApprovedApplication, setHasApprovedApplication] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        // 1) Get current user
        const user = await fetchCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }

        if (user.role !== "customer") {
          setError("Only customers can view installers");
          return;
        }

        // 2) Get approved application status + capacity from API
        let capacity: string | null = null;
        let isApproved = false;

        try {
          const statusRes = await fetch("/api/customer/application/status", { cache: "no-store" });
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            isApproved = !!statusData?.isApproved;
            capacity = statusData?.capacity ?? null;
          }
        } catch (err) {
          console.log("Could not get application status:", err);
        }

        setApprovedCapacity(capacity);
        setHasApprovedApplication(isApproved);

        // If no approved application, stop early (UI will show message)
        if (!isApproved) return;

        // 3) Fetch all installers (with packages)
        const installerData = await fetchInstallers(true);

        // 4) Filter installers by approved capacity (if provided)
        let filtered = installerData;

        if (capacity) {
          const appCapacity = formatCapacityForFiltering(capacity);

          filtered = installerData
            .map((installer) => ({
              ...installer,
              packages: (installer.packages ?? []).filter((pkg) => {
                const pkgCapacity = formatCapacityForFiltering(pkg.capacity);
                return pkgCapacity === appCapacity;
              }),
            }))
            .filter((installer) => (installer.packages ?? []).length > 0);
        }

        setInstallers(filtered);
        setFilteredInstallers(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load installers");
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  // Apply search filter
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      setFilteredInstallers(installers);
      return;
    }

    const filtered = installers.filter((installer) => {
      const name = (installer.companyName ?? "").toLowerCase();
      const desc = (installer.description ?? "").toLowerCase();
      const addr = (installer.address ?? "").toLowerCase();

      return name.includes(q) || desc.includes(q) || addr.includes(q);
    });

    setFilteredInstallers(filtered);
  }, [searchQuery, installers]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading installers...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // No approved application message
  if (!hasApprovedApplication) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Solar Installers</h1>
            <p className="text-gray-600">Browse verified solar installation companies</p>
          </div>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">No Approved Application Found</h3>
                  <p className="text-yellow-700">
                    You need an approved solar application to view installers. Please submit an
                    application and get it approved first.
                  </p>

                  <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700" asChild>
                    <Link href="/customer/applications/new">Apply Now</Link>
                  </Button>

                  {/* Optional debug info */}
                  <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                    <p className="text-xs font-mono text-yellow-800">
                      Debug Info: hasApprovedApplication = {hasApprovedApplication.toString()}
                      <br />
                      approvedCapacity = {approvedCapacity || "null"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // No installers matching capacity (but approved application exists)
  if (hasApprovedApplication && installers.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Solar Installers</h1>
            <p className="text-gray-600">
              Browse installers with packages matching your approved capacity
            </p>
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Your application is approved!</p>
                    <p className="text-sm text-blue-600">
                      Approved capacity:
                      <Badge className="ml-2 bg-white" variant="outline">
                        {approvedCapacity || "Not specified"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-12 text-center">
              <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Installers Found</h3>
              <p className="text-gray-600 mb-4">
                {approvedCapacity
                  ? `No installers found with ${approvedCapacity} packages.`
                  : "No installers are currently available for your approved application."}
              </p>
              <p className="text-sm text-gray-500">
                Try checking back later or contact support for assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Solar Installers</h1>
          <p className="text-gray-600">
            Browse installers with packages matching your approved capacity
          </p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Showing installers with packages matching your approved capacity
                  </p>
                  <p className="text-sm text-blue-600">
                    Your approved system:
                    <Badge className="ml-2 bg-white" variant="outline">
                      {approvedCapacity || "Not specified"}
                    </Badge>
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                {filteredInstallers.length}{" "}
                {filteredInstallers.length === 1 ? "installer" : "installers"} found
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search installers by name or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {filteredInstallers.length === 0 && searchQuery && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Installers Found</h3>
              <p className="text-gray-600 mb-4">No installers match your search criteria.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {filteredInstallers.map((installer) => (
            <Card key={installer.id} className="overflow-hidden">
              <CardHeader className="pb-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{installer.companyName}</CardTitle>
                        {installer.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{installer.description ?? ""}</CardDescription>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{installer.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {installer.completedInstallations} installations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {installer.address ?? ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {installer.phone ?? ""}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    Available Packages ({installer.packages?.length ?? 0})
                  </h4>

                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/customer/installers/${installer.id}/packages`}>View All</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(installer.packages ?? []).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{pkg.name}</h5>
                        <Badge variant="outline">{pkg.capacity}</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {pkg.panelCount} panels • {pkg.inverterBrand}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-blue-600">
                            Rs. {pkg.price.toLocaleString()}
                          </p>
                          {pkg.warranty && (
                            <p className="text-xs text-gray-500">Warranty: {pkg.warranty}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={`/customer/installers/${installer.id}/packages/${pkg.id}`}
                            >
                              Details
                            </Link>
                          </Button>

                          <Button size="sm" asChild>
                            <Link
                            href={`/customer/installers/${installer.id}/packages/${pkg.id}`}
                            >
                               Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}