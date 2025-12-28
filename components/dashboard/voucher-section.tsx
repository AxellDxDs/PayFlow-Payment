"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Gift,
  Coffee,
  ShoppingBag,
  UtensilsCrossed,
  Ticket,
  ChevronRight,
  Clock,
  CheckCircle2,
  Copy,
  Sparkles,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"

const vouchers = [
  {
    id: "v1",
    title: "Diskon 20% Starbucks",
    description: "Min. belanja Rp 50.000",
    points: 5000,
    icon: Coffee,
    color: "bg-green-500/10 text-green-600",
    borderColor: "border-green-500/30",
    expiry: "31 Des 2024",
    category: "F&B",
    code: "SBUX20DEC",
    terms: [
      "Berlaku untuk semua menu",
      "Maksimal diskon Rp 25.000",
      "Tidak dapat digabung dengan promo lain",
      "Berlaku di seluruh outlet Starbucks Indonesia",
    ],
  },
  {
    id: "v2",
    title: "Cashback 15% Tokopedia",
    description: "Maks. cashback Rp 30.000",
    points: 3000,
    icon: ShoppingBag,
    color: "bg-emerald-500/10 text-emerald-600",
    borderColor: "border-emerald-500/30",
    expiry: "30 Des 2024",
    category: "Shopping",
    code: "TOPED15CB",
    terms: [
      "Min. transaksi Rp 100.000",
      "Cashback berupa PayFlow coins",
      "Berlaku 1x per user",
      "Tidak berlaku untuk produk digital",
    ],
  },
  {
    id: "v3",
    title: "Free Delivery GoFood",
    description: "Untuk 3x order",
    points: 2500,
    icon: UtensilsCrossed,
    color: "bg-red-500/10 text-red-600",
    borderColor: "border-red-500/30",
    expiry: "29 Des 2024",
    category: "Food",
    code: "GOFREE3X",
    terms: [
      "Berlaku untuk jarak maks. 10km",
      "Min. order Rp 25.000",
      "Berlaku di area terpilih",
      "Dapat digunakan 3x dalam 7 hari",
    ],
  },
  {
    id: "v4",
    title: "Diskon 50% Cinema XXI",
    description: "1 tiket reguler",
    points: 7500,
    icon: Ticket,
    color: "bg-purple-500/10 text-purple-600",
    borderColor: "border-purple-500/30",
    expiry: "31 Des 2024",
    category: "Entertainment",
    code: "XXI50OFF",
    terms: [
      "Berlaku untuk tiket reguler 2D",
      "Tidak berlaku weekend & hari libur",
      "Maks. 2 tiket per transaksi",
      "Berlaku di seluruh Cinema XXI",
    ],
  },
]

export function VoucherSection() {
  const { t } = useLanguage()
  const { wallet, updateWallet } = useAppStore()
  const [claimedVouchers, setClaimedVouchers] = React.useState<string[]>([])
  const [selectedVoucher, setSelectedVoucher] = React.useState<(typeof vouchers)[0] | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false)
  const [claimedVoucherCode, setClaimedVoucherCode] = React.useState("")

  const handleClaim = (voucher: (typeof vouchers)[0]) => {
    const currentPoints = wallet?.balancePoints || 0

    if (currentPoints < voucher.points) {
      toast.error("Poin tidak cukup!", {
        description: `Anda butuh ${voucher.points - currentPoints} poin lagi`,
      })
      return
    }

    // Deduct points
    updateWallet({
      balancePoints: currentPoints - voucher.points,
    })

    setClaimedVouchers((prev) => [...prev, voucher.id])
    setClaimedVoucherCode(voucher.code)
    setSelectedVoucher(null)
    setShowSuccessDialog(true)

    toast.success("Voucher berhasil diklaim!")
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Kode voucher disalin!")
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Gift className="h-4 w-4 text-white" />
              </div>
              Voucher & Rewards
            </CardTitle>
            <Link href="/dashboard/rewards">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                {t.dashboard.viewAll}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-amber-500/10">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-600 font-medium">
              {(wallet?.balancePoints || 0).toLocaleString()} Poin tersedia
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {vouchers.map((voucher) => {
            const isClaimed = claimedVouchers.includes(voucher.id)
            const hasEnoughPoints = (wallet?.balancePoints || 0) >= voucher.points

            return (
              <div
                key={voucher.id}
                onClick={() => !isClaimed && setSelectedVoucher(voucher)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all cursor-pointer",
                  isClaimed ? "bg-muted/50 opacity-60 cursor-not-allowed" : "hover:shadow-md hover:scale-[1.02]",
                  voucher.borderColor,
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", voucher.color)}
                  >
                    <voucher.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{voucher.title}</h4>
                        <p className="text-xs text-muted-foreground">{voucher.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {voucher.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {voucher.expiry}
                      </div>
                      <Button
                        size="sm"
                        variant={isClaimed ? "outline" : hasEnoughPoints ? "default" : "secondary"}
                        className={cn(
                          "h-7 text-xs",
                          !isClaimed &&
                            hasEnoughPoints &&
                            "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
                        )}
                        disabled={isClaimed || !hasEnoughPoints}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isClaimed && hasEnoughPoints) {
                            handleClaim(voucher)
                          }
                        }}
                      >
                        {isClaimed ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Diklaim
                          </>
                        ) : (
                          `${voucher.points.toLocaleString()} Poin`
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Voucher Detail Dialog */}
      <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedVoucher && (
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", selectedVoucher.color)}>
                  {selectedVoucher && <selectedVoucher.icon className="h-6 w-6" />}
                </div>
              )}
              {selectedVoucher?.title}
            </DialogTitle>
            <DialogDescription>{selectedVoucher?.description}</DialogDescription>
          </DialogHeader>

          {selectedVoucher && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kategori</span>
                  <Badge variant="outline">{selectedVoucher.category}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Berlaku hingga</span>
                  <span className="font-medium">{selectedVoucher.expiry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-bold text-amber-600">{selectedVoucher.points.toLocaleString()} Poin</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Syarat & Ketentuan:</h4>
                <ul className="space-y-1">
                  {selectedVoucher.terms.map((term, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => handleClaim(selectedVoucher)}
                disabled={(wallet?.balancePoints || 0) < selectedVoucher.points}
              >
                <Gift className="h-4 w-4 mr-2" />
                Tukar {selectedVoucher.points.toLocaleString()} Poin
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Voucher Berhasil Diklaim!</h3>
            <p className="text-muted-foreground text-sm mb-4">Gunakan kode voucher di bawah ini:</p>

            <div className="w-full p-4 rounded-xl bg-muted/50 border-2 border-dashed border-primary/30 mb-4">
              <p className="text-2xl font-mono font-bold tracking-wider">{claimedVoucherCode}</p>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => copyCode(claimedVoucherCode)}>
              <Copy className="h-4 w-4 mr-2" />
              Salin Kode
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
