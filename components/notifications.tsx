"use client"

import { useEffect, useState, createContext, useContext, type ReactNode } from "react"
import { Bell, X, CheckCircle, AlertTriangle, Info, FileText, Zap, Receipt, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: "success" | "warning" | "info" | "application" | "payment" | "installation" | "bid" | "billing" | "agreement"
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
  channel?: "in_app" | "email" | "sms"
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

type ApiNotification = {
  id: string
  title: string
  body: string
  read: boolean
  createdAt: string
  link?: string | null
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (days > 0) return `${days}d ago · ${time}`
  if (hours > 0) return `${hours}h ago · ${time}`
  return `Just now · ${time}`
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        const mapped = (data.notifications as ApiNotification[] | undefined)?.map(mapNotification) ?? []
        if (active) setNotifications(mapped)
      } catch {
        if (active) setNotifications([])
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    fetch(`/api/notifications/${id}`, { method: "PATCH" }).catch(() => {})
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    fetch("/api/notifications", { method: "PATCH" }).catch(() => {})
  }

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    fetch(`/api/notifications/${id}`, { method: "DELETE" }).catch(() => {})
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications()

  const getIcon = (type: Notification["type"]) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />,
      application: <FileText className="w-5 h-5 text-cyan-500" />,
      payment: <Receipt className="w-5 h-5 text-emerald-500" />,
      installation: <Zap className="w-5 h-5 text-amber-500" />,
      bid: <Calendar className="w-5 h-5 text-blue-500" />,
      billing: <CreditPill label="Billing" />,
      agreement: <FileText className="w-5 h-5 text-purple-500" />,
    }
    return icons[type] || icons.info
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-14 right-4 z-50 w-96 max-h-[80vh] bg-card border border-border rounded-lg shadow-lg overflow-hidden notification-panel">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && <Badge className="bg-emerald-500 text-white">{unreadCount}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "group p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer notification-item",
                  !notification.read && "bg-emerald-500/5 notification-item--unread",
                )}
                onClick={() => {
                  markAsRead(notification.id)
                  if (notification.link) {
                    window.location.href = notification.link
                  }
                }}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium text-foreground", !notification.read && "font-semibold")}>
                        {notification.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 w-6 h-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearNotification(notification.id)
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {notification.channel && (
                        <Badge variant="outline" className="text-[10px] h-5 px-2 bg-muted/50">
                          {notification.channel === "email" ? "Email" : notification.channel === "sms" ? "SMS" : "In-app"}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                    </div>
                  </div>
                  {!notification.read && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

function mapNotification(notification: ApiNotification): Notification {
  return {
    id: notification.id,
    type: inferType(notification.title, notification.body),
    title: notification.title,
    message: notification.body,
    timestamp: notification.createdAt,
    read: notification.read,
    link: notification.link ?? undefined,
    channel: "in_app",
  }
}

function inferType(title: string, body: string): Notification["type"] {
  const text = `${title} ${body}`.toLowerCase()
  if (text.includes("payment") || text.includes("invoice") || text.includes("fee")) {
    return "payment"
  }
  if (text.includes("bid")) return "bid"
  if (text.includes("installation")) return "installation"
  if (text.includes("agreement")) return "agreement"
  if (text.includes("visit")) return "application"
  if (text.includes("application")) return "application"
  return "info"
}

export function NotificationBell() {
  const { unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(!open)}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function CreditPill({ label }: { label: string }) {
  return (
    <div className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold leading-none">
      {label}
    </div>
  )
}

export function NotificationFeed({ limit = 5 }: { limit?: number }) {
  const { notifications } = useNotifications()
  const items = notifications.slice(0, limit)

  return (
    <div className="space-y-3">
      {items.map((notification) => (
        <div key={notification.id} className="p-3 rounded-lg border border-border bg-card">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {notification.type === "billing" ? (
                <CreditPill label="Billing" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  {notification.type === "payment" ? <Receipt className="w-4 h-4 text-emerald-600" /> : null}
                  {notification.type === "installation" ? <Zap className="w-4 h-4 text-amber-500" /> : null}
                  {notification.type === "agreement" ? <FileText className="w-4 h-4 text-purple-500" /> : null}
                  {notification.type === "application" ? <FileText className="w-4 h-4 text-cyan-500" /> : null}
                  {notification.type === "info" ? <Info className="w-4 h-4 text-blue-500" /> : null}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
          </div>
          <p className="text-sm font-semibold text-foreground mt-1">{notification.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          {notification.channel && (
            <div className="mt-2">
              <Badge variant="outline" className="text-[10px] h-5 px-2 bg-muted/60">
                {notification.channel === "email" ? "Email delivery" : notification.channel === "sms" ? "SMS" : "In-app"}
              </Badge>
            </div>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-muted-foreground text-sm">No notifications yet</p>}
    </div>
  )
}
