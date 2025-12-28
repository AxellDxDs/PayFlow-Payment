"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Users,
  Copy,
  Share2,
  Gift,
  Trophy,
  Star,
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  Sparkles,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const referralTiers = [
  { level: 1, name: "Starter", minReferrals: 0, bonus: 10000, color: "bg-slate-500" },
  { level: 2, name: "Bronze", minReferrals: 5, bonus: 25000, color: "bg-amber-600" },
  { level: 3, name: "Silver", minReferrals: 15, bonus: 50000, color: "bg-slate-400" },
  { level: 4, name: "Gold", minReferrals: 30, bonus: 100000, color: "bg-yellow-500" },
  { level: 5, name: "Platinum", minReferrals: 50, bonus: 200000, color: "bg-cyan-500" },
  { level: 6, name: "Diamond", minReferrals: 100, bonus: 500000, color: "bg-purple-500" },
]

const referralHistory = [
  { id: 1, name: "Andi Pratama", date: "2024-01-15", status: "verified", bonus: 25000 },
  { id: 2, name: "Sari Wulandari", date: "2024-01-12", status: "verified", bonus: 25000 },
  { id: 3, name: "Budi Setiawan", date: "2024-01-10", status: "pending", bonus: 25000 },
  { id: 4, name: "Dewi Lestari", date: "2024-01-08", status: "verified", bonus: 25000 },
  { id: 5, name: "Rudi Hartono", date: "2024-01-05", status: "verified", bonus: 25000 },
]

const rewards = [
  { id: 1, title: "Cashback 50%", description: "Top up minimum 100rb", cost: 500, icon: Coins },
  { id: 2, title: "Gratis Transfer", description: "5x transfer gratis", cost: 300, icon: Gift },
  { id: 3, title: "Voucher Makanan", description: "Diskon 30% food order", cost: 750, icon: Star },
  { id: 4, title: "Premium 1 Bulan", description: "Akses fitur premium", cost: 1500, icon: Crown },
]

export default function ReferralPage() {
  const { user } = useAppStore()
  const [copied, setCopied] = React.useState(false)

  const referralCode = user?.username?.toUpperCase() + "PAY2024" || "USERPAY2024"
  const referralLink = `https://payflow.id/ref/${referralCode}`
  const totalReferrals = 12
  const verifiedReferrals = 10
  const pendingReferrals = 2
  const totalEarnings = 250000
  const referralPoints = 1250

  const currentTier = referralTiers.reduce((acc, tier) => {
    if (verifiedReferrals >= tier.minReferrals) return tier
    return acc
  }, referralTiers[0])

  const nextTier = referralTiers.find((t) => t.minReferrals > verifiedReferrals)
  const progressToNextTier = nextTier
    ? ((verifiedReferrals - currentTier.minReferrals) / (nextTier.minReferrals - currentTier.minReferrals)) * 100
    : 100

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Gabung PayFlow!",
        text: `Gunakan kode referral saya ${referralCode} dan dapatkan bonus Rp 25.000!`,
        url: referralLink,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Program Referral</h1>
        <p className="text-muted-foreground">Ajak teman dan dapatkan bonus hingga Rp 500.000</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/60 border-0 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total Referral</p>
                <p className="text-2xl sm:text-3xl font-bold">{totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terverifikasi</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{verifiedReferrals}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-500">{pendingReferrals}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bonus</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(totalEarnings)}</p>
              </div>
              <Coins className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Kode Referral Anda
          </CardTitle>
          <CardDescription>
            Bagikan kode ini ke teman dan dapatkan Rp 25.000 untuk setiap referral yang berhasil
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input value={referralCode} readOnly className="text-center text-lg font-bold tracking-wider pr-10" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => copyToClipboard(referralCode)}
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={shareReferral} className="gap-2">
              <Share2 className="h-4 w-4" />
              Bagikan
            </Button>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Link Referral:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs flex-1 truncate">{referralLink}</code>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(referralLink)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Progress & History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tier Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Level Referral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", currentTier.color)}>
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentTier.name}</p>
                <p className="text-sm text-muted-foreground">Level {currentTier.level}</p>
              </div>
              <Badge className="ml-auto">{formatCurrency(currentTier.bonus)} / referral</Badge>
            </div>

            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress ke {nextTier.name}</span>
                  <span>
                    {verifiedReferrals}/{nextTier.minReferrals} referral
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {nextTier.minReferrals - verifiedReferrals} referral lagi untuk unlock bonus{" "}
                  {formatCurrency(nextTier.bonus)}/referral
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {referralTiers.slice(0, 6).map((tier) => (
                <div
                  key={tier.level}
                  className={cn(
                    "p-2 rounded-lg text-center border",
                    verifiedReferrals >= tier.minReferrals
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/50 border-transparent",
                  )}
                >
                  <div className={cn("h-8 w-8 rounded-full mx-auto mb-1", tier.color)} />
                  <p className="text-xs font-medium">{tier.name}</p>
                  <p className="text-xs text-muted-foreground">{tier.minReferrals}+</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Riwayat Referral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralHistory.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {ref.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{ref.name}</p>
                      <p className="text-xs text-muted-foreground">{ref.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={ref.status === "verified" ? "default" : "secondary"}>
                      {ref.status === "verified" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {ref.status === "verified" ? "Verified" : "Pending"}
                    </Badge>
                    <p className="text-xs text-green-600 mt-1">+{formatCurrency(ref.bonus)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Points & Rewards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Tukar Poin Referral
              </CardTitle>
              <CardDescription>Gunakan poin untuk mendapatkan hadiah menarik</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Poin Anda</p>
              <p className="text-2xl font-bold text-primary">{referralPoints.toLocaleString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className="border-dashed">
                <CardContent className="p-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <reward.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">{reward.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                  <Button
                    size="sm"
                    variant={referralPoints >= reward.cost ? "default" : "outline"}
                    disabled={referralPoints < reward.cost}
                    className="w-full"
                  >
                    {reward.cost} Poin
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Kerja Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">1. Bagikan Kode</h4>
              <p className="text-sm text-muted-foreground">
                Bagikan kode referral Anda ke teman, keluarga, atau di media sosial
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">2. Teman Mendaftar</h4>
              <p className="text-sm text-muted-foreground">
                Teman menggunakan kode Anda saat mendaftar dan melakukan transaksi pertama
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2">3. Dapatkan Bonus</h4>
              <p className="text-sm text-muted-foreground">
                Anda dan teman sama-sama mendapat bonus Rp 25.000 setelah verifikasi
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
