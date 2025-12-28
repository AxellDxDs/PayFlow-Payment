"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
  TrendingUp,
  TrendingDown,
  LineChart,
  PieChart,
  Plus,
  Wallet,
  Landmark,
  Coins,
  Star,
  Info,
  ArrowUpRight,
  Loader2,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Investment {
  id: string
  name: string
  type: "reksadana" | "saham" | "obligasi" | "emas"
  value: number
  invested: number
  returns: number
  returnPercentage: number
  risk: "low" | "medium" | "high"
  icon: React.ElementType
}

const investments: Investment[] = [
  {
    id: "1",
    name: "Reksa Dana Pasar Uang",
    type: "reksadana",
    value: 15500000,
    invested: 15000000,
    returns: 500000,
    returnPercentage: 3.33,
    risk: "low",
    icon: PieChart,
  },
  {
    id: "2",
    name: "Saham Blue Chip IDX30",
    type: "saham",
    value: 28750000,
    invested: 25000000,
    returns: 3750000,
    returnPercentage: 15,
    risk: "high",
    icon: LineChart,
  },
  {
    id: "3",
    name: "Obligasi Pemerintah FR",
    type: "obligasi",
    value: 10200000,
    invested: 10000000,
    returns: 200000,
    returnPercentage: 2,
    risk: "low",
    icon: Landmark,
  },
  {
    id: "4",
    name: "Emas Digital",
    type: "emas",
    value: 8650000,
    invested: 8000000,
    returns: 650000,
    returnPercentage: 8.13,
    risk: "medium",
    icon: Coins,
  },
]

const investmentProducts = [
  {
    id: "p1",
    name: "Reksa Dana Saham Unggulan",
    type: "reksadana",
    minInvest: 100000,
    returns: "12-18%",
    risk: "high",
    rating: 4.5,
  },
  {
    id: "p2",
    name: "Obligasi Korporasi AAA",
    type: "obligasi",
    minInvest: 1000000,
    returns: "6-8%",
    risk: "low",
    rating: 4.8,
  },
  {
    id: "p3",
    name: "Emas Batangan ANTAM",
    type: "emas",
    minInvest: 500000,
    returns: "5-10%",
    risk: "medium",
    rating: 4.7,
  },
]

export default function InvestmentPage() {
  const { user, balance } = useAppStore()
  const [selectedInvestment, setSelectedInvestment] = React.useState<Investment | null>(null)
  const [showBuyDialog, setShowBuyDialog] = React.useState(false)
  const [buyAmount, setBuyAmount] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0)
  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0)
  const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0)
  const overallReturnPercentage = ((totalReturns / totalInvested) * 100).toFixed(2)

  const handleBuy = async () => {
    if (!buyAmount || Number(buyAmount) < 100000) {
      toast.error("Minimum investasi Rp 100.000")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowBuyDialog(false)
    setBuyAmount("")
    toast.success("Investasi berhasil!")
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
            Rendah
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
            Sedang
          </Badge>
        )
      case "high":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-500">
            Tinggi
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Investasi</h1>
          <p className="text-muted-foreground">Kelola portfolio investasi Anda</p>
        </div>
        <Button onClick={() => setShowBuyDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Investasi Baru
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="sm:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wallet className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+{formatCurrency(totalReturns)}</span>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                +{overallReturnPercentage}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Investasi</p>
            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
            <p className="text-xs text-muted-foreground mt-1">Modal awal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Keuntungan</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalReturns)}</p>
            <p className="text-xs text-green-500 mt-1">+{overallReturnPercentage}% return</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="portfolio">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="portfolio">Portfolio Saya</TabsTrigger>
          <TabsTrigger value="products">Produk Investasi</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-6 space-y-4">
          {investments.map((investment) => (
            <Card
              key={investment.id}
              className="cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setSelectedInvestment(investment)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      investment.type === "reksadana"
                        ? "bg-blue-500/10"
                        : investment.type === "saham"
                          ? "bg-purple-500/10"
                          : investment.type === "obligasi"
                            ? "bg-green-500/10"
                            : "bg-yellow-500/10",
                    )}
                  >
                    <investment.icon
                      className={cn(
                        "h-6 w-6",
                        investment.type === "reksadana"
                          ? "text-blue-500"
                          : investment.type === "saham"
                            ? "text-purple-500"
                            : investment.type === "obligasi"
                              ? "text-green-500"
                              : "text-yellow-500",
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{investment.name}</h4>
                      {getRiskBadge(investment.risk)}
                    </div>
                    <p className="text-sm text-muted-foreground">Modal: {formatCurrency(investment.invested)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatCurrency(investment.value)}</p>
                    <div
                      className={cn(
                        "flex items-center justify-end gap-1 text-sm",
                        investment.returns >= 0 ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {investment.returns >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>+{investment.returnPercentage}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="products" className="mt-6 space-y-4">
          {investmentProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">{product.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Min: {formatCurrency(product.minInvest)}</span>
                      <span>Return: {product.returns}/tahun</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getRiskBadge(product.risk)}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setShowBuyDialog(true)}>Beli</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Investasi Baru</DialogTitle>
            <DialogDescription>Masukkan jumlah yang ingin diinvestasikan</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Jumlah Investasi</label>
              <Input
                type="number"
                placeholder="Minimum Rp 100.000"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[100000, 500000, 1000000, 5000000].map((amount) => (
                <Button key={amount} variant="outline" size="sm" onClick={() => setBuyAmount(String(amount))}>
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Saldo tersedia: {formatCurrency(balance)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleBuy} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Investasi Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
