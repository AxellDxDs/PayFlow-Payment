"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import type { CryptoAsset } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { formatCurrency, formatNumber } from "@/lib/utils/format"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "@/components/icons"
import { toast } from "sonner"

interface TradePanelProps {
  asset: CryptoAsset
}

export function TradePanel({ asset }: TradePanelProps) {
  const { wallet, cryptoWallets, updateWallet } = useAppStore()
  const [tradeType, setTradeType] = React.useState<"buy" | "sell">("buy")
  const [amount, setAmount] = React.useState("")
  const [percentage, setPercentage] = React.useState([0])
  const [isProcessing, setIsProcessing] = React.useState(false)

  const cryptoWallet = cryptoWallets.find((w) => w.coinType === asset.symbol)
  const cryptoBalance = cryptoWallet?.balance || 0

  const numericAmount = Number.parseFloat(amount) || 0
  const totalCost = numericAmount * asset.price
  const fee = totalCost * 0.001 // 0.1% fee
  const totalWithFee = tradeType === "buy" ? totalCost + fee : totalCost - fee

  const maxBuyAmount = wallet ? (wallet.balanceMain / asset.price) * 0.999 : 0 // Account for fees
  const maxSellAmount = cryptoBalance

  const handlePercentageChange = (value: number[]) => {
    setPercentage(value)
    const maxAmount = tradeType === "buy" ? maxBuyAmount : maxSellAmount
    const newAmount = (value[0] / 100) * maxAmount
    setAmount(newAmount > 0 ? newAmount.toFixed(8) : "")
  }

  const handleTrade = async () => {
    if (!wallet) return

    if (numericAmount <= 0) {
      toast.error("Masukkan jumlah yang valid")
      return
    }

    if (tradeType === "buy" && totalWithFee > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    if (tradeType === "sell" && numericAmount > cryptoBalance) {
      toast.error("Saldo crypto tidak mencukupi")
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (tradeType === "buy") {
      updateWallet({ balanceMain: wallet.balanceMain - totalWithFee })
      toast.success(`Berhasil membeli ${formatNumber(numericAmount)} ${asset.symbol}`)
    } else {
      updateWallet({ balanceMain: wallet.balanceMain + totalWithFee })
      toast.success(`Berhasil menjual ${formatNumber(numericAmount)} ${asset.symbol}`)
    }

    setAmount("")
    setPercentage([0])
    setIsProcessing(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Trade {asset.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as "buy" | "sell")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Beli
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Jual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            {/* Balance Info */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saldo Tersedia</span>
                <span className="font-medium">{formatCurrency(wallet?.balanceMain || 0)}</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Jumlah {asset.symbol}</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    const val = Number.parseFloat(e.target.value) || 0
                    setPercentage([(val / maxBuyAmount) * 100])
                  }}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {asset.symbol}
                </span>
              </div>
            </div>

            {/* Percentage Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Persentase Saldo</Label>
                <span className="text-xs font-medium">{percentage[0].toFixed(0)}%</span>
              </div>
              <Slider value={percentage} onValueChange={handlePercentageChange} max={100} step={1} />
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((p) => (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-transparent"
                    onClick={() => handlePercentageChange([p])}
                  >
                    {p}%
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga per {asset.symbol}</span>
                <span>{formatCurrency(asset.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya (0.1%)</span>
                <span>{formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-green-500">{formatCurrency(totalWithFee)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              size="lg"
              onClick={handleTrade}
              disabled={isProcessing || numericAmount <= 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Beli {asset.symbol}
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            {/* Crypto Balance Info */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Saldo {asset.symbol}</span>
                <span className="font-medium">
                  {formatNumber(cryptoBalance)} {asset.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>Estimasi nilai</span>
                <span>{formatCurrency(cryptoBalance * asset.price)}</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Jumlah {asset.symbol}</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    const val = Number.parseFloat(e.target.value) || 0
                    setPercentage([(val / maxSellAmount) * 100])
                  }}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {asset.symbol}
                </span>
              </div>
            </div>

            {/* Percentage Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Persentase Saldo</Label>
                <span className="text-xs font-medium">{percentage[0].toFixed(0)}%</span>
              </div>
              <Slider value={percentage} onValueChange={handlePercentageChange} max={100} step={1} />
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((p) => (
                  <Button
                    key={p}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-transparent"
                    onClick={() => handlePercentageChange([p])}
                  >
                    {p}%
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga per {asset.symbol}</span>
                <span>{formatCurrency(asset.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya (0.1%)</span>
                <span>-{formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Yang Diterima</span>
                <span className="text-red-500">{formatCurrency(totalWithFee)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-red-500 hover:bg-red-600"
              size="lg"
              onClick={handleTrade}
              disabled={isProcessing || numericAmount <= 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Jual {asset.symbol}
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
