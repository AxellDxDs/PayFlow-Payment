"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, Mail, Lock, Smartphone, ArrowLeft, User, Check } from "@/components/icons"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "register" | "setup"

export function LoginForm() {
  const router = useRouter()
  const { login, register, completeProfile, isLoading, isNewUser, isProfileComplete, hasHydrated } = useAppStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginMethod, setLoginMethod] = React.useState<"email" | "phone">("email")
  const [authMode, setAuthMode] = React.useState<AuthMode>("login")
  const [formData, setFormData] = React.useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [profileData, setProfileData] = React.useState({
    fullName: "",
    phone: "",
    username: "",
  })

  React.useEffect(() => {
    if (hasHydrated && isNewUser && !isProfileComplete) {
      setAuthMode("setup")
    }
  }, [hasHydrated, isNewUser, isProfileComplete])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const identifier = loginMethod === "email" ? formData.email : formData.phone

    if (!identifier || !formData.password) {
      toast.error("Mohon lengkapi semua field")
      return
    }

    if (authMode === "register") {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password tidak cocok")
        return
      }
      if (formData.password.length < 6) {
        toast.error("Password minimal 6 karakter")
        return
      }

      const success = await register(identifier, formData.password)
      if (success) {
        toast.success("Pendaftaran berhasil!")
        setAuthMode("setup")
      } else {
        toast.error("Pendaftaran gagal")
      }
    } else {
      const success = await login(identifier, formData.password)
      if (success) {
        toast.success("Login berhasil!")
        const store = useAppStore.getState()
        if (store.isNewUser && !store.isProfileComplete) {
          setAuthMode("setup")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast.error("Email/Password salah")
      }
    }
  }

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileData.fullName.trim()) {
      toast.error("Nama lengkap harus diisi")
      return
    }
    if (!profileData.phone.trim()) {
      toast.error("Nomor telepon harus diisi")
      return
    }

    completeProfile({
      fullName: profileData.fullName.trim(),
      phone: profileData.phone.trim(),
      username: profileData.username.trim() || formData.email.split("@")[0],
    })

    toast.success("Profil berhasil disimpan! Anda mendapat bonus Rp50.000")
    router.push("/dashboard")
  }

  if (!hasHydrated) {
    return (
      <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (authMode === "setup") {
    return (
      <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Lengkapi Profil</CardTitle>
          <CardDescription>Isi data diri untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap"
                  className="pl-10"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setupPhone">Nomor Telepon *</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="setupPhone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="pl-10"
                  value={profileData.phone}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (opsional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground text-sm">@</span>
                <Input
                  id="username"
                  placeholder="username"
                  className="pl-8"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, "") }))
                  }
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Bonus Rp50.000 menanti Anda!</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lengkapi profil untuk mendapatkan saldo bonus.</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Simpan & Lanjutkan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl bg-card/95 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="space-y-1 text-center relative">
        <Link
          href="/"
          className="absolute top-0 left-0 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <div className="flex justify-center mb-4 pt-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center transition-transform hover:scale-105">
            <span className="text-3xl font-bold text-primary-foreground">P</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {authMode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
        </CardTitle>
        <CardDescription>
          {authMode === "login" ? "Masuk ke akun PayFlow Anda" : "Daftar untuk memulai"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              type="button"
              variant={loginMethod === "email" ? "default" : "ghost"}
              size="sm"
              className={cn("flex-1 transition-all", loginMethod !== "email" && "hover:bg-transparent")}
              onClick={() => setLoginMethod("email")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              type="button"
              variant={loginMethod === "phone" ? "default" : "ghost"}
              size="sm"
              className={cn("flex-1 transition-all", loginMethod !== "phone" && "hover:bg-transparent")}
              onClick={() => setLoginMethod("phone")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Telepon
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={loginMethod}>{loginMethod === "email" ? "Email" : "Nomor Telepon"}</Label>
            <div className="relative">
              {loginMethod === "email" ? (
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              ) : (
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id={loginMethod}
                type={loginMethod === "email" ? "email" : "tel"}
                placeholder={loginMethod === "email" ? "email@example.com" : "08xxxxxxxxxx"}
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                value={loginMethod === "email" ? formData.email : formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [loginMethod]: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {authMode === "login" && (
                <Button variant="link" className="px-0 h-auto text-xs" type="button">
                  Lupa Password?
                </Button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {authMode === "register" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  className="pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full transition-all hover:scale-[1.02]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : authMode === "login" ? (
              "Masuk"
            ) : (
              "Daftar"
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Atau {authMode === "login" ? "masuk" : "daftar"} dengan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="bg-transparent transition-all hover:scale-[1.02]">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" className="bg-transparent transition-all hover:scale-[1.02]">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          {authMode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <Button
            variant="link"
            className="px-0 h-auto"
            type="button"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Daftar sekarang" : "Masuk"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}
