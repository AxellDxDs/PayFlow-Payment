"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { Send, User, Building2, QrCode, Loader2, Check } from "@/components/icons"
import { toast } from "sonner"

export function TransferForm() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [transferType, setTransferType] = React.useState<"user" | "bank">("user")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    recipient: "",
    amount: "",
    note: "",
    bank: "",
    accountNumber: "",
    accountName: "",
  })

  const numericAmount = Number.parseFloat(formData.amount) || 0
  const fee = transferType === "bank" ? 2500 : 0
  const total = numericAmount + fee

  const handleTransfer = async () => {
    if (!wallet) return

    if (!formData.recipient && !formData.accountNumber) {
      toast.error("Masukkan tujuan transfer")
      return
    }

    if (numericAmount <= 0) {
      toast.error("Masukkan jumlah yang valid")
      return
    }

    if (total > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update wallet
    updateWallet({ balanceMain: wallet.balanceMain - total })

    // Add transaction
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "transfer",
      amount: -numericAmount,
      fee,
      status: "success",
      description:
        transferType === "user" ? `Transfer ke @${formData.recipient}` : `Transfer ke ${formData.accountName}`,
      recipient: transferType === "user" ? formData.recipient : formData.accountNumber,
      createdAt: new Date(),
    })

    setIsProcessing(false)
    setIsSuccess(true)

    toast.success("Transfer berhasil!")

    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        recipient: "",
        amount: "",
        note: "",
        bank: "",
        accountNumber: "",
        accountName: "",
      })
    }, 3000)
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-4">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Transfer Berhasil!</h3>
          <p className="text-muted-foreground mb-4">
            {formatCurrency(numericAmount)} telah dikirim ke{" "}
            {transferType === "user" ? `@${formData.recipient}` : formData.accountName}
          </p>
          <Button onClick={() => setIsSuccess(false)}>Transfer Lagi</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Transfer Dana
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={transferType} onValueChange={(v) => setTransferType(v as "user" | "bank")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">
              <User className="h-4 w-4 mr-2" />
              Sesama User
            </TabsTrigger>
            <TabsTrigger value="bank">
              <Building2 className="h-4 w-4 mr-2" />
              Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4 mt-4">
            {/* Recipient */}
            <div className="space-y-2">
              <Label>Username / Email / No. HP</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Masukkan username, email, atau nomor HP"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                />
                <Button variant="outline" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Jumlah Transfer</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-10"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Saldo tersedia: {formatCurrency(wallet?.balanceMain || 0)}
              </p>
            </div>

            {/* Quick Amount */}
            <div className="flex gap-2">
              {[50000, 100000, 250000, 500000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setFormData({ ...formData, amount: amt.toString() })}
                >
                  {formatCurrency(amt)}
                </Button>
              ))}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label>Catatan (opsional)</Label>
              <Textarea
                placeholder="Tambahkan catatan..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 mt-4">
            {/* Bank Selection */}
            <div className="space-y-2">
              <Label>Bank Tujuan</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.bank}
                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              >
                <option value="">Pilih Bank</option>
                <option value="bca">BCA</option>
                <option value="mandiri">Mandiri</option>
                <option value="bni">BNI</option>
                <option value="bri">BRI</option>
                <option value="cimb">CIMB Niaga</option>
                <option value="permata">Permata</option>
              </select>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              <Input
                type="number"
                placeholder="Masukkan nomor rekening"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label>Nama Penerima</Label>
              <Input
                placeholder="Nama sesuai rekening"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Jumlah Transfer</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-10"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Saldo tersedia: {formatCurrency(wallet?.balanceMain || 0)}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary */}
        {numericAmount > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jumlah Transfer</span>
              <span>{formatCurrency(numericAmount)}</span>
            </div>
            {fee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span>{formatCurrency(fee)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        <Button
          className="w-full mt-4"
          size="lg"
          onClick={handleTransfer}
          disabled={isProcessing || numericAmount <= 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Transfer Sekarang
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
