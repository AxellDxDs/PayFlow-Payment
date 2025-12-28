"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatNumber, formatCurrency } from "@/lib/utils/format"
import { toast } from "sonner"
import {
  Coins,
  Gift,
  Wallet,
  ArrowRight,
  Ticket,
  Coffee,
  ShoppingBag,
  Smartphone,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RewardItem {
  id: string
  name: string
  description: string
  pointsCost: number
  category: "voucher" | "pulsa" | "ewallet" | "merchandise"
  icon: React.ElementType
  image?: string
  stock?: number
  popular?: boolean
}

const rewardItems: RewardItem[] = [
  {
    id: "voucher-50k",
    name: "Voucher Belanja Rp50.000",
    description: "Voucher belanja untuk berbagai merchant",
    pointsCost: 5000,
    category: "voucher",
    icon: Ticket,
    stock: 100,
    popular: true,
  },
  {
    id: "voucher-100k",
    name: "Voucher Belanja Rp100.000",
    description: "Voucher belanja premium untuk merchant pilihan",
    pointsCost: 9500,
    category: "voucher",
    icon: Ticket,
    stock: 50,
  },
  {
    id: "voucher-coffee",
    name: "Voucher Kopi Gratis",
    description: "Gratis 1 minuman di coffee shop partner",
    pointsCost: 2500,
    category: "voucher",
    icon: Coffee,
    stock: 200,
    popular: true,
  },
  {
    id: "pulsa-25k",
    name: "Pulsa Rp25.000",
    description: "Pulsa semua operator",
    pointsCost: 2750,
    category: "pulsa",
    icon: Smartphone,
  },
  {
    id: "pulsa-50k",
    name: "Pulsa Rp50.000",
    description: "Pulsa semua operator",
    pointsCost: 5250,
    category: "pulsa",
    icon: Smartphone,
  },
  {
    id: "pulsa-100k",
    name: "Pulsa Rp100.000",
    description: "Pulsa semua operator",
    pointsCost: 10000,
    category: "pulsa",
    icon: Smartphone,
  },
  {
    id: "ewallet-50k",
    name: "Saldo E-Wallet Rp50.000",
    description: "Top up saldo ke dompet digital Anda",
    pointsCost: 5000,
    category: "ewallet",
    icon: Wallet,
    popular: true,
  },
  {
    id: "ewallet-100k",
    name: "Saldo E-Wallet Rp100.000",
    description: "Top up saldo ke dompet digital Anda",
    pointsCost: 9500,
    category: "ewallet",
    icon: Wallet,
  },
  {
    id: "token-listrik",
    name: "Token Listrik Rp50.000",
    description: "Token listrik PLN prabayar",
    pointsCost: 5500,
    category: "voucher",
    icon: Zap,
  },
  {
    id: "merch-tumbler",
    name: "Tumbler Eksklusif PayFlow",
    description: "Tumbler premium edisi terbatas",
    pointsCost: 15000,
    category: "merchandise",
    icon: ShoppingBag,
    stock: 20,
  },
  {
    id: "merch-tshirt",
    name: "Kaos PayFlow Limited Edition",
    description: "Kaos premium dengan desain eksklusif",
    pointsCost: 20000,
    category: "merchandise",
    icon: ShoppingBag,
    stock: 15,
  },
]

export default function ExchangePointsPage() {
  const { wallet, updateWallet } = useAppStore()
  const [selectedItem, setSelectedItem] = React.useState<RewardItem | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")

  const userPoints = wallet?.balancePoints || 0

  const filteredItems = React.useMemo(() => {
    if (activeTab === "all") return rewardItems
    return rewardItems.filter((item) => item.category === activeTab)
  }, [activeTab])

  const handleSelectItem = (item: RewardItem) => {
    setSelectedItem(item)
    setIsConfirmOpen(true)
  }

  const handleExchange = async () => {
    if (!selectedItem) return

    if (userPoints < selectedItem.pointsCost) {
      toast.error("Poin tidak mencukupi!")
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Deduct points
    updateWallet({
      balancePoints: userPoints - selectedItem.pointsCost,
    })

    setIsProcessing(false)
    setIsConfirmOpen(false)
    setIsSuccessOpen(true)

    toast.success(`Berhasil menukar ${selectedItem.name}!`)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "voucher":
        return Ticket
      case "pulsa":
        return Smartphone
      case "ewallet":
        return Wallet
      case "merchandise":
        return ShoppingBag
      default:
        return Gift
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tukar Poin</h1>
        <p className="text-muted-foreground">Tukarkan poin rewards Anda dengan berbagai hadiah menarik</p>
      </div>

      {/* Points Balance Card */}
      <Card className="bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600 border-0 text-white overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Poin Anda</p>
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8" />
                <p className="text-4xl font-bold">{formatNumber(userPoints)}</p>
              </div>
              <p className="text-white/70 text-sm mt-2">Setara dengan {formatCurrency(userPoints * 10)}</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">
                <Star className="h-3 w-3 mr-1 fill-yellow-300 text-yellow-300" />
                Gold Member
              </Badge>
              <p className="text-white/70 text-xs">1 Poin = Rp10</p>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <Sparkles className="absolute top-4 right-4 h-6 w-6 text-white/30" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold">{formatNumber(1250)}</p>
            <p className="text-xs text-muted-foreground">Poin Bulan Ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-5 w-5 mx-auto text-purple-500 mb-1" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Hadiah Ditukar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold">30</p>
            <p className="text-xs text-muted-foreground">Hari Kadaluarsa</p>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Katalog Hadiah
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="voucher">Voucher</TabsTrigger>
              <TabsTrigger value="pulsa">Pulsa</TabsTrigger>
              <TabsTrigger value="ewallet">E-Wallet</TabsTrigger>
              <TabsTrigger value="merchandise">Merch</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const canAfford = userPoints >= item.pointsCost
                  const CategoryIcon = getCategoryIcon(item.category)

                  return (
                    <Card
                      key={item.id}
                      className={cn(
                        "group cursor-pointer transition-all hover:shadow-lg relative overflow-hidden",
                        !canAfford && "opacity-60",
                      )}
                      onClick={() => canAfford && handleSelectItem(item)}
                    >
                      {item.popular && (
                        <Badge className="absolute top-2 right-2 bg-amber-500 text-white z-10">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Popular
                        </Badge>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <item.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-primary font-semibold">
                                <Coins className="h-4 w-4" />
                                <span>{formatNumber(item.pointsCost)}</span>
                              </div>
                              {item.stock !== undefined && (
                                <span className="text-xs text-muted-foreground">Stok: {item.stock}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!canAfford && (
                          <div className="mt-3 p-2 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground text-center">
                              Butuh {formatNumber(item.pointsCost - userPoints)} poin lagi
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penukaran</DialogTitle>
            <DialogDescription>Pastikan detail penukaran sudah benar sebelum melanjutkan.</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <selectedItem.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedItem.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
              </div>

              {(selectedItem.category === "pulsa" || selectedItem.category === "ewallet") && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Tujuan</Label>
                  <Input
                    id="phone"
                    placeholder="08xxxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Poin Anda</span>
                  <span className="font-medium">{formatNumber(userPoints)} Poin</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Poin Dibutuhkan</span>
                  <span className="font-medium text-primary">-{formatNumber(selectedItem.pointsCost)} Poin</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-medium">Sisa Poin</span>
                  <span className="font-bold">{formatNumber(userPoints - selectedItem.pointsCost)} Poin</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleExchange} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Memproses...
                </>
              ) : (
                <>
                  Tukar Sekarang
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Penukaran Berhasil!</h3>
              <p className="text-muted-foreground">
                {selectedItem?.name} telah berhasil ditukar. Cek email atau notifikasi untuk detail lebih lanjut.
              </p>
            </div>
            <Button className="w-full" onClick={() => setIsSuccessOpen(false)}>
              Selesai
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
