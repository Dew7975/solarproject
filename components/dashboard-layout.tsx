"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/context/LanguageContext"

import {
  Sun,
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Building,
  Gavel,
  Receipt,
  ClipboardList,
  BarChart3,
  CheckCircle,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { fetchCurrentUser, logout, type User, type UserRole } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { NotificationProvider, NotificationBell } from "@/components/notifications"
import { VerificationPendingCard } from "@/components/verification-pending-card"
import { VerificationRejectedCard } from "@/components/verification-rejected-card"

interface NavItem {
  labelKey: string
  href: string
  icon: React.ElementType
}

const navigationByRole: Record<UserRole, NavItem[]> = {
  customer: [
    { labelKey: "dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { labelKey: "myApplications", href: "/customer/applications", icon: FileText },
    { labelKey: "solarPackages", href: "/customer/installers", icon: Building },
    { labelKey: "myBids", href: "/customer/bids", icon: Gavel },
    { labelKey: "invoices", href: "/customer/invoices", icon: Receipt },
    { labelKey: "calibrations", href: "/customer/reports/calibrations", icon: ClipboardList },
    { labelKey: "reports", href: "/customer/reports", icon: BarChart3 },
  ],
  installer: [
    { labelKey: "dashboard", href: "/installer/dashboard", icon: LayoutDashboard },
    { labelKey: "myPackages", href: "/installer/packages", icon: Package },
    { labelKey: "bidRequests", href: "/installer/bids", icon: Gavel },
    { labelKey: "orders", href: "/installer/orders", icon: ClipboardList },
    { labelKey: "reports", href: "/installer/reports", icon: BarChart3 },
  ],
  officer: [
    { labelKey: "dashboard", href: "/officer/dashboard", icon: LayoutDashboard },
    { labelKey: "applications", href: "/officer/applications", icon: FileText },
    { labelKey: "installers", href: "/officer/installers", icon: Building },
    { labelKey: "siteVisits", href: "/officer/site-visits", icon: Calendar },
    { labelKey: "payments", href: "/officer/payments", icon: Receipt },
    { labelKey: "installations", href: "/officer/installations", icon: CheckCircle },
    { labelKey: "calibrations", href: "/officer/calibrations", icon: ClipboardList },
    { labelKey: "billing", href: "/officer/billing", icon: BarChart3 },
    { labelKey: "users", href: "/officer/users", icon: Users },
  ],
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [installerStatus, setInstallerStatus] = useState<"loading" | "verified" | "pending" | "rejected">(
    "loading",
  )

  // ✅ Role color system (Customer = Green, Installer = Yellow, Officer = Blue)
  const roleTheme: Record<
    UserRole,
    {
      brandBg: string
      brandSoftBg: string
      brandText: string
      brandTextSoft: string
      activeNav: string
      hoverNav: string
      focusRing: string
      headerStrip: string
    }
  > = {
    customer: {
      brandBg: "bg-emerald-500",
      brandSoftBg: "bg-emerald-500/15",
      brandText: "text-emerald-700 dark:text-emerald-300",
      brandTextSoft: "text-emerald-600 dark:text-emerald-300",
      activeNav: "bg-emerald-500 text-white shadow-sm",
      hoverNav: "hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300",
      focusRing: "focus-visible:ring-emerald-500/30",
      headerStrip: "from-emerald-500 via-emerald-400 to-emerald-600",
    },
    installer: {
      brandBg: "bg-amber-500",
      brandSoftBg: "bg-amber-500/15",
      brandText: "text-amber-800 dark:text-amber-200",
      brandTextSoft: "text-amber-700 dark:text-amber-300",
      activeNav: "bg-amber-500 text-amber-950 shadow-sm",
      hoverNav: "hover:bg-amber-500/10 hover:text-amber-800 dark:hover:text-amber-200",
      focusRing: "focus-visible:ring-amber-500/30",
      headerStrip: "from-yellow-400 via-amber-500 to-orange-500",
    },
    officer: {
      brandBg: "bg-blue-500",
      brandSoftBg: "bg-blue-500/15",
      brandText: "text-blue-700 dark:text-blue-300",
      brandTextSoft: "text-blue-600 dark:text-blue-300",
      activeNav: "bg-blue-500 text-white shadow-sm",
      hoverNav: "hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300",
      focusRing: "focus-visible:ring-blue-500/30",
      headerStrip: "from-blue-500 via-sky-500 to-indigo-500",
    },
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await fetchCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        setUser(currentUser)
      } catch (err) {
        const message = err instanceof Error ? err.message : ""
        console.error(err)
        router.push(message.toLowerCase().includes("suspended") ? "/login?suspended=1" : "/login")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  useEffect(() => {
    if (!user) return

    if (user.role !== "installer") {
      setInstallerStatus("verified")
      return
    }

    if (user.organization?.isRejected) {
      setInstallerStatus("rejected")
      return
    }

    if (user.verified) {
      setInstallerStatus("verified")
      return
    }

    setInstallerStatus("pending")
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t("loading")}</div>
      </div>
    )
  }

  if (user.role === "installer" && installerStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t("loading")}</div>
      </div>
    )
  }

  const theme = roleTheme[user.role]
  const navigation = navigationByRole[user.role]

  const officerRouteSet = new Set([
    "/officer/dashboard",
    "/officer/applications",
    "/officer/installers",
    "/officer/site-visits",
    "/officer/payments",
    "/officer/installations",
    "/officer/calibrations",
    "/officer/billing",
    "/officer/users",
    "/officer/settings",
  ])
  const shouldAnimateOfficer = user.role === "officer" && officerRouteSet.has(pathname)

  const needsGate = user.role === "installer" && installerStatus !== "verified"
  const mainContent = needsGate
    ? installerStatus === "rejected"
      ? <VerificationRejectedCard />
      : <VerificationPendingCard />
    : children

  return (
    <NotificationProvider>
      <div className={cn("min-h-screen bg-background", shouldAnimateOfficer && "officer-scope")}>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            <div className="h-14 px-4 border-b border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", theme.brandBg)}>
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">CEB Solar</span>
              </Link>

              <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors outline-none",
                      theme.focusRing,
                      isActive
                        ? theme.activeNav
                        : shouldAnimateOfficer
                          ? cn("text-muted-foreground hover:text-foreground hover:bg-muted/50", theme.hoverNav)
                          : cn("text-muted-foreground hover:bg-muted hover:text-foreground", theme.hoverNav),
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {t(item.labelKey as any)}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.name} />}
                  <AvatarFallback className={cn("text-white", theme.brandBg)}>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                className="lg:hidden text-muted-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-2 rounded-xl",
                        theme.focusRing,
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.name} />}
                        <AvatarFallback className={cn("text-white text-xs", theme.brandBg)}>
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-semibold">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href={`/${user.role}/settings`} className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        {t("settings")}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className={cn("p-4 md:p-6", shouldAnimateOfficer && "officer-page-transition")}>
            {mainContent}
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
}