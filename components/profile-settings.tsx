"use client"

import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/LanguageContext"

type ProfileUser = {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  profileImageUrl?: string | null
  role: string
}

export function ProfileSettings() {
  const { t } = useLanguage()
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [photoSaving, setPhotoSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const avatarPreview = useMemo(() => {
    if (!avatarFile) return null
    return URL.createObjectURL(avatarFile)
  }, [avatarFile])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" })
        if (!res.ok) throw new Error(t("profileLoadError"))
        const data = await res.json()
        if (!active) return
        setUser(data.user)
        setName(data.user.name ?? "")
        setEmail(data.user.email ?? "")
        setPhone(data.user.phone ?? "")
        setAddress(data.user.address ?? "")
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : t("profileLoadError"))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const resetMessages = () => {
    setError(null)
    setSuccess(null)
  }

  async function handleSaveProfile() {
    resetMessages()
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || t("profileUpdateError"))
      }
      setUser(data.user)
      setSuccess(t("profileUpdated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profileUpdateError"))
    } finally {
      setSaving(false)
    }
  }

  async function handleUploadPhoto() {
    if (!avatarFile) return
    resetMessages()
    setPhotoSaving(true)
    try {
      const formData = new FormData()
      formData.append("avatar", avatarFile)
      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || t("profilePhotoUploadError"))
      }
      setUser(data.user)
      setAvatarFile(null)
      setSuccess(t("profilePhotoUpdated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : t("profilePhotoUploadError"))
    } finally {
      setPhotoSaving(false)
    }
  }

  async function handleChangePassword() {
    resetMessages()
    if (!currentPassword || !newPassword) {
      setError(t("passwordChangeMissing"))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t("passwordChangeMismatch"))
      return
    }
    setPasswordSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || t("passwordChangeError"))
      }
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccess(t("passwordUpdated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : t("passwordChangeError"))
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return <div className="py-10 text-muted-foreground">{t("loadingProfile")}</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-3 py-2">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 text-emerald-700 text-sm px-3 py-2">{success}</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("profilePhoto")}</CardTitle>
          <CardDescription>{t("profilePhotoSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatarPreview ?? user?.profileImageUrl ?? undefined} alt={user?.name ?? t("profileImageAlt")} />
            <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:shadow-sm file:transition-colors file:duration-200 file:ease-in-out hover:file:bg-[#05339c]"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            />
            <Button
              disabled={!avatarFile || photoSaving}
              onClick={handleUploadPhoto}
            >
              {photoSaving ? t("uploading") : t("uploadPhoto")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("personalDetails")}</CardTitle>
          <CardDescription>{t("personalDetailsSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t("address")}</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <Button className="w-fit" onClick={handleSaveProfile} disabled={saving}>
            {saving ? t("saving") : t("saveChanges")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("changePassword")}</CardTitle>
          <CardDescription>{t("changePasswordSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPassword")}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button className="w-fit" onClick={handleChangePassword} disabled={passwordSaving}>
            {passwordSaving ? t("updating") : t("updatePassword")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
