"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { CryptoAsset } from "@/lib/types"
import { formatCurrency } from "@/lib/utils/format"
import { Bell, TrendingUp, TrendingDown, Loader2 } from "@/components/icons"
import { toast } from "sonner"

interface PriceAlertDialogProps {
  asset: CryptoAsset
  children: React.ReactNode
}

export function PriceAlertDialog({ asset, children }: PriceAlertDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [alertType, setAlertType] = React.useState<"above" | "below">("above")
  const [targetPrice, setTargetPrice] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async () => {
    if (!targetPrice) {
      toast.error("Masukkan target harga")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success(
      `Alert berhasil dibuat! Anda akan dinotifikasi saat ${asset.symbol} ${alertType === "above" ? "di atas" : "di bawah"} ${formatCurrency(Number.parseFloat(targetPrice))}`,
    )

    setOpen(false)
    setTargetPrice("")
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alert {asset.symbol}
          </DialogTitle>
          <DialogDescription>
            Atur notifikasi saat harga {asset.name} mencapai target yang Anda inginkan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Price */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">Harga Saat Ini</p>
            <p className="text-xl font-bold">{formatCurrency(asset.price)}</p>
          </div>

          {/* Alert Type */}
          <div className="space-y-2">
            <Label>Tipe Alert</Label>
            <RadioGroup value={alertType} onValueChange={(v) => setAlertType(v as "above" | "below")}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="above" id="above" />
                <Label htmlFor="above" className="flex items-center gap-2 cursor-pointer flex-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Harga di atas target
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="below" id="below" />
                <Label htmlFor="below" className="flex items-center gap-2 cursor-pointer flex-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Harga di bawah target
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Target Price */}
          <div className="space-y-2">
            <Label>Target Harga (IDR)</Label>
            <Input
              type="number"
              placeholder="Masukkan target harga"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>

          {/* Quick Percentage Buttons */}
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((pct) => (
              <Button
                key={pct}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => {
                  const multiplier = alertType === "above" ? 1 + pct / 100 : 1 - pct / 100
                  setTargetPrice((asset.price * multiplier).toFixed(0))
                }}
              >
                {alertType === "above" ? "+" : "-"}
                {pct}%
              </Button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Buat Alert
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
