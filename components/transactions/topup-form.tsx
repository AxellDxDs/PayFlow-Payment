"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { ArrowUpRight, Building2, CreditCard, Wallet, Loader2, Check, Copy } from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const paymentMethods = [
  { id: "va-bca", name: "BCA Virtual Account", icon: Building2, fee: 0 },
  { id: "va-mandiri", name: "Mandiri Virtual Account", icon: Building2, fee: 0 },
  { id: "va-bni", name: "BNI Virtual Account", icon: Building2, fee: 0 },
  { id: "cc", name: "Kartu Kredit/Debit", icon: CreditCard, fee: 2500 },
  { id: "gopay", name: "GoPay", icon: Wallet, fee: 0 },
  { id: "ovo", name: "OVO", icon: Wallet, fee: 0 },
]

const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

export function TopupForm() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [amount, setAmount] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [showPayment, setShowPayment] = React.useState(false)
  const [vaNumber, setVaNumber] = React.useState("")

  const numericAmount = Number.parseFloat(amount) || 0
  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod)
  const fee = selectedMethod?.fee || 0
  const total = numericAmount + fee

  const handleTopup = async () => {
    if (numericAmount < 10000) {
      toast.error("Minimal top up Rp10.000")
      return
    }

    if (!paymentMethod) {
      toast.error("Pilih metode pembayaran")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setVaNumber(`8888${Math.random().toString().slice(2, 14)}`)
    setShowPayment(true)
    setIsProcessing(false)
  }

  const handleConfirmPayment = async () => {
    if (!wallet) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain + numericAmount })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "topup",
      amount: numericAmount,
      fee,
      status: "success",
      description: `Top Up via ${selectedMethod?.name}`,
      createdAt: new Date(),
    })

    toast.success(`Top up ${formatCurrency(numericAmount)} berhasil!`)
    setIsProcessing(false)
    setShowPayment(false)
    setAmount("")
    setPaymentMethod("")
    setVaNumber("")
  }

  const copyVaNumber = () => {
    navigator.clipboard.writeText(vaNumber)
    toast.success("Nomor VA disalin!")
  }

  if (showPayment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Selesaikan Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Total Pembayaran</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Transfer ke:</p>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">{selectedMethod?.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-mono font-bold">{vaNumber}</p>
                <Button variant="ghost" size="sm" onClick={copyVaNumber}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium">Petunjuk Pembayaran:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Buka aplikasi mobile banking atau ATM</li>
              <li>Pilih menu Transfer ke Virtual Account</li>
              <li>Masukkan nomor VA di atas</li>
              <li>Konfirmasi jumlah pembayaran</li>
              <li>Selesaikan pembayaran</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowPayment(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={handleConfirmPayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengecek...
                </>
              ) : (
                "Saya Sudah Bayar"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5" />
          Top Up Saldo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <p className="text-sm text-muted-foreground">Saldo Saat Ini</p>
          <p className="text-2xl font-bold">{formatCurrency(wallet?.balanceMain || 0)}</p>
        </div>

        <div className="space-y-2">
          <Label>Jumlah Top Up</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
            <Input
              type="number"
              placeholder="0"
              className="pl-10 text-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((amt) => (
            <Button
              key={amt}
              variant={numericAmount === amt ? "default" : "outline"}
              size="sm"
              className={cn(numericAmount !== amt && "bg-transparent")}
              onClick={() => setAmount(amt.toString())}
            >
              {formatCurrency(amt)}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <Label>Metode Pembayaran</Label>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                  )}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === method.id ? "border-primary" : "border-muted-foreground",
                    )}
                  >
                    {paymentMethod === method.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{method.name}</p>
                    {method.fee > 0 && (
                      <p className="text-xs text-muted-foreground">Biaya admin {formatCurrency(method.fee)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {numericAmount > 0 && paymentMethod && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jumlah Top Up</span>
              <span>{formatCurrency(numericAmount)}</span>
            </div>
            {fee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span>{formatCurrency(fee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total Bayar</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        <Button className="w-full" size="lg" onClick={handleTopup} disabled={isProcessing || numericAmount < 10000}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Lanjut Bayar"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
