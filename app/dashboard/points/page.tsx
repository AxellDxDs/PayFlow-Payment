"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Coins,
  Gift,
  Ticket,
  Coffee,
  ShoppingBag,
  Smartphone,
  Plane,
  Car,
  Utensils,
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  TrendingUp,
  Search,
  ChevronRight,
  Wallet,
  CreditCard,
  Zap,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface RewardItem {
  id: string
  name: string
  description: string
  points: number
  category: string
  icon: React.ElementType
  image?: string
  discount?: string
  stock?: number
  expiry?: string
  popular?: boolean
}

const rewardCategories = [
  { id: "all", label: "Semua", icon: Gift },
  { id: "voucher", label: "Voucher", icon: Ticket },
  { id: "cashback", label: "Cashback", icon: Wallet },
  { id: "pulsa", label: "Pulsa & Data", icon: Smartphone },
  { id: "food", label: "Makanan", icon: Utensils },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "shopping", label: "Belanja", icon: ShoppingBag },
  { id: "lifestyle", label: "Lifestyle", icon: Coffee },
]

const rewards: RewardItem[] = [
  // Voucher
  {
    id: "v1",
    name: "Voucher Tokopedia Rp50.000",
    description: "Berlaku untuk semua produk",
    points: 5000,
    category: "voucher",
    icon: ShoppingBag,
    discount: "Rp50.000",
    popular: true,
  },
  {
    id: "v2",
    name: "Voucher Shopee Rp25.000",
    description: "Min. belanja Rp100.000",
    points: 2500,
    category: "voucher",
    icon: ShoppingBag,
    discount: "Rp25.000",
  },
  {
    id: "v3",
    name: "Voucher Lazada Rp30.000",
    description: "Berlaku untuk fashion",
    points: 3000,
    category: "voucher",
    icon: ShoppingBag,
    discount: "Rp30.000",
  },
  {
    id: "v4",
    name: "Voucher Blibli Rp100.000",
    description: "Min. belanja Rp500.000",
    points: 10000,
    category: "voucher",
    icon: ShoppingBag,
    discount: "Rp100.000",
  },

  // Cashback
  {
    id: "c1",
    name: "Cashback 10% Top Up",
    description: "Maks. Rp25.000",
    points: 1000,
    category: "cashback",
    icon: Wallet,
    discount: "10%",
    popular: true,
  },
  {
    id: "c2",
    name: "Cashback 15% Transfer",
    description: "Maks. Rp50.000",
    points: 2000,
    category: "cashback",
    icon: Wallet,
    discount: "15%",
  },
  {
    id: "c3",
    name: "Cashback 20% Tagihan",
    description: "Maks. Rp30.000",
    points: 1500,
    category: "cashback",
    icon: Zap,
    discount: "20%",
  },
  {
    id: "c4",
    name: "Cashback 25% QRIS",
    description: "Maks. Rp20.000",
    points: 2500,
    category: "cashback",
    icon: CreditCard,
    discount: "25%",
  },

  // Pulsa & Data
  {
    id: "p1",
    name: "Pulsa Rp10.000",
    description: "Semua operator",
    points: 1200,
    category: "pulsa",
    icon: Smartphone,
  },
  {
    id: "p2",
    name: "Pulsa Rp25.000",
    description: "Semua operator",
    points: 2800,
    category: "pulsa",
    icon: Smartphone,
  },
  {
    id: "p3",
    name: "Pulsa Rp50.000",
    description: "Semua operator",
    points: 5500,
    category: "pulsa",
    icon: Smartphone,
    popular: true,
  },
  {
    id: "p4",
    name: "Paket Data 5GB",
    description: "Masa aktif 30 hari",
    points: 4000,
    category: "pulsa",
    icon: Smartphone,
  },
  {
    id: "p5",
    name: "Paket Data 10GB",
    description: "Masa aktif 30 hari",
    points: 7500,
    category: "pulsa",
    icon: Smartphone,
  },

  // Food
  {
    id: "f1",
    name: "Voucher GoFood Rp30.000",
    description: "Min. order Rp50.000",
    points: 3000,
    category: "food",
    icon: Utensils,
    discount: "Rp30.000",
    popular: true,
  },
  {
    id: "f2",
    name: "Voucher GrabFood Rp25.000",
    description: "Min. order Rp40.000",
    points: 2500,
    category: "food",
    icon: Utensils,
    discount: "Rp25.000",
  },
  {
    id: "f3",
    name: "Voucher ShopeeFood Rp20.000",
    description: "Min. order Rp35.000",
    points: 2000,
    category: "food",
    icon: Utensils,
    discount: "Rp20.000",
  },
  {
    id: "f4",
    name: "Voucher Starbucks Rp50.000",
    description: "Berlaku di semua outlet",
    points: 5000,
    category: "food",
    icon: Coffee,
    discount: "Rp50.000",
  },
  {
    id: "f5",
    name: "Voucher KFC Rp50.000",
    description: "Berlaku di semua outlet",
    points: 5000,
    category: "food",
    icon: Utensils,
    discount: "Rp50.000",
  },

  // Travel
  {
    id: "t1",
    name: "Diskon Tiket Pesawat 10%",
    description: "Maks. Rp100.000",
    points: 8000,
    category: "travel",
    icon: Plane,
    discount: "10%",
  },
  {
    id: "t2",
    name: "Diskon Hotel 15%",
    description: "Maks. Rp200.000",
    points: 10000,
    category: "travel",
    icon: Plane,
    discount: "15%",
  },
  {
    id: "t3",
    name: "Voucher Tiket Kereta Rp25.000",
    description: "Semua rute",
    points: 2500,
    category: "travel",
    icon: Car,
    discount: "Rp25.000",
  },

  // Shopping
  {
    id: "s1",
    name: "Voucher Uniqlo Rp100.000",
    description: "Min. belanja Rp300.000",
    points: 10000,
    category: "shopping",
    icon: ShoppingBag,
    discount: "Rp100.000",
  },
  {
    id: "s2",
    name: "Voucher H&M Rp75.000",
    description: "Min. belanja Rp250.000",
    points: 7500,
    category: "shopping",
    icon: ShoppingBag,
    discount: "Rp75.000",
  },

  // Lifestyle
  {
    id: "l1",
    name: "Voucher CGV Rp35.000",
    description: "1 tiket regular",
    points: 3500,
    category: "lifestyle",
    icon: Ticket,
    discount: "Rp35.000",
  },
  {
    id: "l2",
    name: "Voucher Spotify 1 Bulan",
    description: "Premium Individual",
    points: 6000,
    category: "lifestyle",
    icon: Coffee,
  },
  {
    id: "l3",
    name: "Voucher Netflix 1 Bulan",
    description: "Basic Plan",
    points: 8000,
    category: "lifestyle",
    icon: Coffee,
  },
]

const pointsHistory = [
  { id: 1, type: "earn", description: "Top Up Saldo", points: 50, date: "2024-12-24" },
  { id: 2, type: "earn", description: "Transfer ke Teman", points: 25, date: "2024-12-23" },
  { id: 3, type: "redeem", description: "Voucher GoFood Rp30.000", points: -3000, date: "2024-12-22" },
  { id: 4, type: "earn", description: "Bayar Listrik", points: 100, date: "2024-12-21" },
  { id: 5, type: "earn", description: "Bonus Natal", points: 500, date: "2024-12-20" },
  { id: 6, type: "redeem", description: "Pulsa Rp25.000", points: -2800, date: "2024-12-19" },
]

export default function PointsPage() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedReward, setSelectedReward] = React.useState<RewardItem | null>(null)
  const [isRedeeming, setIsRedeeming] = React.useState(false)
  const [redeemSuccess, setRedeemSuccess] = React.useState(false)

  const filteredRewards = React.useMemo(() => {
    return rewards.filter((reward) => {
      const matchCategory = selectedCategory === "all" || reward.category === selectedCategory
      const matchSearch =
        reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const handleRedeem = async () => {
    if (!selectedReward) return
    if ((wallet?.balancePoints || 0) < selectedReward.points) {
      toast.error("Poin tidak mencukupi")
      return
    }

    setIsRedeeming(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    updateWallet({
      balancePoints: (wallet?.balancePoints || 0) - selectedReward.points,
    })

    addTransaction({
      id: `txn-${Date.now()}`,
      userId: "user-1",
      type: "reward",
      category: "voucher",
      amount: selectedReward.points,
      currency: "POINTS",
      status: "completed",
      description: `Tukar Poin: ${selectedReward.name}`,
      createdAt: new Date(),
      metadata: { rewardId: selectedReward.id },
    })

    setIsRedeeming(false)
    setRedeemSuccess(true)
    toast.success(`Berhasil menukar ${selectedReward.name}!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tukar Poin</h1>
          <p className="text-muted-foreground">Tukarkan poin rewards dengan berbagai hadiah menarik</p>
        </div>
      </div>

      {/* Points Balance Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/80">Total Poin Anda</p>
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-white" />
                <span className="text-4xl font-bold text-white">
                  {(wallet?.balancePoints || 0).toLocaleString("id-ID")}
                </span>
                <Badge className="bg-white/20 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +500 bulan ini
                </Badge>
              </div>
              <p className="text-sm text-white/70">Setara dengan {formatCurrency((wallet?.balancePoints || 0) * 10)}</p>
            </div>
            <div className="hidden sm:block">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                <Gift className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-white/70">Hadiah Ditukar</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5,200</p>
              <p className="text-xs text-white/70">Poin Didapat</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Gold</p>
              <p className="text-xs text-white/70">Level Member</p>
            </div>
          </div>

          {/* Decorative */}
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-5 -top-5 h-20 w-20 rounded-full bg-white/10 blur-xl" />
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="rewards" className="gap-2">
            <Gift className="h-4 w-4" />
            Katalog Hadiah
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Riwayat Poin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari hadiah..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {rewardCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 gap-2"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRewards.map((reward, index) => (
              <Card
                key={reward.id}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  (wallet?.balancePoints || 0) < reward.points && "opacity-60",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedReward(reward)}
              >
                <CardContent className="p-4">
                  {reward.popular && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        reward.category === "voucher" && "bg-purple-500/10 text-purple-500",
                        reward.category === "cashback" && "bg-green-500/10 text-green-500",
                        reward.category === "pulsa" && "bg-blue-500/10 text-blue-500",
                        reward.category === "food" && "bg-orange-500/10 text-orange-500",
                        reward.category === "travel" && "bg-cyan-500/10 text-cyan-500",
                        reward.category === "shopping" && "bg-pink-500/10 text-pink-500",
                        reward.category === "lifestyle" && "bg-amber-500/10 text-amber-500",
                      )}
                    >
                      <reward.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{reward.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{reward.description}</p>
                    </div>
                  </div>

                  {reward.discount && (
                    <Badge variant="secondary" className="mt-3 w-full justify-center">
                      {reward.discount}
                    </Badge>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Coins className="h-4 w-4" />
                      <span className="font-bold">{reward.points.toLocaleString()}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={(wallet?.balancePoints || 0) < reward.points}
                      className="h-8"
                    >
                      Tukar
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Poin</CardTitle>
              <CardDescription>Aktivitas perolehan dan penukaran poin Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pointsHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        item.type === "earn" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
                      )}
                    >
                      {item.type === "earn" ? <TrendingUp className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <span className={cn("font-bold", item.type === "earn" ? "text-green-500" : "text-red-500")}>
                    {item.type === "earn" ? "+" : ""}
                    {item.points.toLocaleString()} Poin
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Redeem Dialog */}
      <Dialog open={!!selectedReward && !redeemSuccess} onOpenChange={(open) => !open && setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penukaran</DialogTitle>
            <DialogDescription>Anda akan menukar poin dengan hadiah berikut</DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <selectedReward.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{selectedReward.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                      {selectedReward.discount && (
                        <Badge variant="secondary" className="mt-2">
                          {selectedReward.discount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <span className="text-muted-foreground">Poin yang dibutuhkan</span>
                <div className="flex items-center gap-2 text-amber-500">
                  <Coins className="h-5 w-5" />
                  <span className="font-bold text-lg">{selectedReward.points.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <span className="text-muted-foreground">Saldo poin Anda</span>
                <span
                  className={cn(
                    "font-bold text-lg",
                    (wallet?.balancePoints || 0) >= selectedReward.points ? "text-green-500" : "text-red-500",
                  )}
                >
                  {(wallet?.balancePoints || 0).toLocaleString()} Poin
                </span>
              </div>

              {(wallet?.balancePoints || 0) < selectedReward.points && (
                <p className="text-sm text-red-500 text-center">
                  Poin Anda tidak mencukupi. Butuh{" "}
                  {(selectedReward.points - (wallet?.balancePoints || 0)).toLocaleString()} poin lagi.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReward(null)}>
              Batal
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={isRedeeming || (wallet?.balancePoints || 0) < (selectedReward?.points || 0)}
            >
              {isRedeeming ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Tukar Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={redeemSuccess}
        onOpenChange={(open) => {
          if (!open) {
            setRedeemSuccess(false)
            setSelectedReward(null)
          }
        }}
      >
        <DialogContent className="text-center">
          <div className="flex flex-col items-center py-6">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Berhasil!</h3>
            <p className="text-muted-foreground mb-4">Anda telah berhasil menukar poin dengan {selectedReward?.name}</p>
            <p className="text-sm text-muted-foreground">
              Voucher telah dikirim ke email dan dapat dilihat di menu Voucher Saya
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setRedeemSuccess(false)
                setSelectedReward(null)
              }}
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
