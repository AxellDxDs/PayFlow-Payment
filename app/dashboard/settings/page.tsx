"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Smartphone,
  Key,
  Camera,
  Check,
  Globe,
  Moon,
  Sun,
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2,
} from "@/components/icons"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUser, logout } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = React.useState(false)

  const [formData, setFormData] = React.useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  })

  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "",
      })
    }
  }, [user])

  const [settings, setSettings] = React.useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      transactions: true,
      promo: true,
      security: true,
    },
    security: {
      twoFactor: false,
      biometric: true,
      loginAlert: true,
      freezeAccount: false,
    },
    limits: {
      dailyTransfer: 50000000,
      dailyPayment: 25000000,
    },
    language: "id",
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update user in store - this will propagate everywhere
    updateUser({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
    })

    toast.success("Profil berhasil diperbarui!")
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Pengaturan berhasil disimpan")
    setIsLoading(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola profil dan preferensi akun Anda</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile" className="transition-all">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="transition-all">
            <Shield className="h-4 w-4 mr-2" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="notifications" className="transition-all">
            <Bell className="h-4 w-4 mr-2" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="limits" className="transition-all">
            <CreditCard className="h-4 w-4 mr-2" />
            Limit
          </TabsTrigger>
          <TabsTrigger value="preferences" className="transition-all">
            <Globe className="h-4 w-4 mr-2" />
            Preferensi
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Update informasi pribadi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 transition-transform group-hover:scale-105">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                      {formData.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full transition-transform hover:scale-110"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{formData.fullName || "Pengguna Baru"}</h3>
                  <p className="text-sm text-muted-foreground">@{formData.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="transition-all">
                      {user?.kycStatus === "verified" ? "Terverifikasi" : "Belum Verifikasi"}
                    </Badge>
                    <Badge className="capitalize">{user?.level || "bronze"}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, "") }))
                      }
                      className="pl-8 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Masukkan alamat lengkap"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="transition-all hover:scale-[1.02]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* KYC Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Verifikasi KYC</CardTitle>
              <CardDescription>Verifikasi identitas untuk fitur lengkap</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.kycStatus === "verified" ? (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 transition-all">
                  <Check className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-500">Akun Terverifikasi</p>
                    <p className="text-sm text-muted-foreground">Identitas Anda telah diverifikasi pada 15 Jan 2024</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10">
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-yellow-500">Verifikasi Diperlukan</p>
                      <p className="text-sm text-muted-foreground">Upload KTP dan selfie untuk verifikasi identitas</p>
                    </div>
                  </div>
                  <Button className="transition-all hover:scale-[1.02]">Mulai Verifikasi KYC</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>Kelola PIN, password, dan keamanan lainnya</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIN */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">PIN Transaksi</p>
                    <p className="text-sm text-muted-foreground">PIN 6 digit untuk keamanan transaksi</p>
                  </div>
                </div>
                <Button variant="outline" className="bg-transparent transition-all hover:scale-[1.02]">
                  Ubah PIN
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Terakhir diubah 30 hari yang lalu</p>
                  </div>
                </div>
                <Button variant="outline" className="bg-transparent transition-all hover:scale-[1.02]">
                  Ubah Password
                </Button>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Tambah keamanan dengan 2FA</p>
                  </div>
                </div>
                <Switch
                  checked={settings.security.twoFactor}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, security: { ...settings.security, twoFactor: checked } })
                  }
                />
              </div>

              {/* Biometric */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Biometric Login</p>
                    <p className="text-sm text-muted-foreground">Login dengan fingerprint atau face ID</p>
                  </div>
                </div>
                <Switch
                  checked={settings.security.biometric}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, security: { ...settings.security, biometric: checked } })
                  }
                />
              </div>

              {/* Login Alert */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Alert Login Device Baru</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat ada login dari device baru</p>
                  </div>
                </div>
                <Switch
                  checked={settings.security.loginAlert}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, security: { ...settings.security, loginAlert: checked } })
                  }
                />
              </div>

              {/* Freeze Account */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-red-500">Bekukan Akun</p>
                    <p className="text-sm text-muted-foreground">Nonaktifkan sementara semua transaksi</p>
                  </div>
                </div>
                <Switch
                  checked={settings.security.freezeAccount}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, security: { ...settings.security, freezeAccount: checked } })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Perangkat Aktif</CardTitle>
              <CardDescription>Kelola perangkat yang login ke akun Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { device: "iPhone 14 Pro", location: "Jakarta, Indonesia", current: true, lastActive: "Sekarang" },
                { device: "MacBook Pro", location: "Jakarta, Indonesia", current: false, lastActive: "2 jam lalu" },
                {
                  device: "Chrome Windows",
                  location: "Surabaya, Indonesia",
                  current: false,
                  lastActive: "1 hari lalu",
                },
              ].map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border transition-all hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {session.device}
                        {session.current && <Badge variant="secondary">Perangkat ini</Badge>}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 transition-colors">
                      Logout
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Channel Notifikasi</h4>
                {[
                  { key: "push", label: "Push Notification", desc: "Notifikasi di perangkat" },
                  { key: "email", label: "Email", desc: "Notifikasi via email" },
                  { key: "sms", label: "SMS", desc: "Notifikasi via SMS" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [item.key]: checked },
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="font-medium">Jenis Notifikasi</h4>
                {[
                  { key: "transactions", label: "Transaksi", desc: "Update setiap transaksi" },
                  { key: "promo", label: "Promo & Penawaran", desc: "Info promo dan cashback" },
                  { key: "security", label: "Keamanan", desc: "Alert keamanan akun" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [item.key]: checked },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits" className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Limit Transaksi</CardTitle>
              <CardDescription>Atur batas transaksi harian Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Limit Transfer Harian</Label>
                  <Input
                    type="number"
                    value={settings.limits.dailyTransfer}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        limits: { ...settings.limits, dailyTransfer: Number(e.target.value) },
                      })
                    }
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-sm text-muted-foreground">Maksimal: {formatCurrency(100000000)} (sesuai level)</p>
                </div>

                <div className="space-y-2">
                  <Label>Limit Pembayaran Harian</Label>
                  <Input
                    type="number"
                    value={settings.limits.dailyPayment}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        limits: { ...settings.limits, dailyPayment: Number(e.target.value) },
                      })
                    }
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-sm text-muted-foreground">Maksimal: {formatCurrency(50000000)} (sesuai level)</p>
                </div>
              </div>

              <Button onClick={handleSave} disabled={isLoading} className="transition-all hover:scale-[1.02]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Simpan Limit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Aplikasi</CardTitle>
              <CardDescription>Atur tampilan dan bahasa aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Tema Aplikasi</p>
                    <p className="text-sm text-muted-foreground">Pilih tampilan terang atau gelap</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="transition-all"
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Terang
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="transition-all"
                  >
                    <Moon className="h-4 w-4 mr-1" />
                    Gelap
                  </Button>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border transition-all hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Bahasa</p>
                    <p className="text-sm text-muted-foreground">Pilih bahasa aplikasi</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={settings.language === "id" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings({ ...settings, language: "id" })}
                    className="transition-all"
                  >
                    Indonesia
                  </Button>
                  <Button
                    variant={settings.language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings({ ...settings, language: "en" })}
                    className="transition-all"
                  >
                    English
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Zona Berbahaya</CardTitle>
              <CardDescription>Tindakan ini tidak dapat dibatalkan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <LogOut className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Keluar dari Akun</p>
                    <p className="text-sm text-muted-foreground">Logout dari semua perangkat</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                  className="transition-all hover:scale-[1.02]"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Hapus Akun</p>
                    <p className="text-sm text-muted-foreground">Hapus akun dan semua data Anda secara permanen</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" className="transition-all hover:scale-[1.02]">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
