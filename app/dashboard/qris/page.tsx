"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { QrCode, Camera, Download, Share2, Loader2, Check, Copy } from "@/components/icons"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"

export default function QRISPage() {
  const { user, wallet, updateWallet, addTransaction } = useAppStore()
  const [amount, setAmount] = React.useState("")
  const [note, setNote] = React.useState("")
  const [isScanning, setIsScanning] = React.useState(false)
  const [scannedData, setScannedData] = React.useState<{
    merchant: string
    amount: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const qrValue = JSON.stringify({
    type: "QRIS",
    userId: user?.id,
    username: user?.username,
    amount: amount ? Number(amount) : null,
    note,
  })

  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning
    setTimeout(() => {
      setScannedData({
        merchant: "Warung Makan Padang Bu Ani",
        amount: 35000,
      })
      setIsScanning(false)
    }, 2000)
  }

  const handlePayQRIS = async () => {
    if (!wallet || !scannedData) return

    if (scannedData.amount > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain - scannedData.amount })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "payment",
      amount: -scannedData.amount,
      fee: 0,
      status: "success",
      description: `Pembayaran QRIS - ${scannedData.merchant}`,
      createdAt: new Date(),
    })

    toast.success("Pembayaran berhasil!")
    setIsProcessing(false)
    setScannedData(null)
  }

  const copyQRLink = () => {
    navigator.clipboard.writeText(`https://pay.digibank.id/qris/${user?.username}`)
    toast.success("Link pembayaran disalin!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QRIS</h1>
        <p className="text-muted-foreground">Scan atau tampilkan QR untuk pembayaran</p>
      </div>

      <Tabs defaultValue="show" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="show">
            <QrCode className="h-4 w-4 mr-2" />
            Tampilkan QR
          </TabsTrigger>
          <TabsTrigger value="scan">
            <Camera className="h-4 w-4 mr-2" />
            Scan QR
          </TabsTrigger>
        </TabsList>

        {/* Show QR Tab */}
        <TabsContent value="show">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 bg-white rounded-xl">
                    <QRCodeSVG
                      value={qrValue}
                      size={200}
                      level="H"
                      includeMargin
                      imageSettings={{
                        src: "/logo.png",
                        height: 40,
                        width: 40,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg">{user?.name}</p>
                  <p className="text-muted-foreground">@{user?.username}</p>
                  {amount && <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(Number(amount))}</p>}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={copyQRLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Salin Link
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Unduh
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atur Nominal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nominal (Opsional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      type="number"
                      placeholder="Kosongkan untuk nominal bebas"
                      className="pl-10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[10000, 25000, 50000, 100000, 250000, 500000].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => setAmount(amt.toString())}
                    >
                      {formatCurrency(amt)}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Catatan (Opsional)</Label>
                  <Input
                    placeholder="Contoh: Bayar makan siang"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setAmount("")
                    setNote("")
                  }}
                >
                  Reset
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scan QR Tab */}
        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle>Scan QRIS</CardTitle>
            </CardHeader>
            <CardContent>
              {scannedData ? (
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-lg bg-green-500/10">
                    <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold">QR Berhasil Discan</p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merchant</span>
                      <span className="font-medium">{scannedData.merchant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nominal</span>
                      <span className="font-bold text-lg">{formatCurrency(scannedData.amount)}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo Anda</span>
                      <span className="font-medium">{formatCurrency(wallet?.balanceMain || 0)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setScannedData(null)}>
                      Batal
                    </Button>
                    <Button className="flex-1" onClick={handlePayQRIS} disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Bayar Sekarang"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div
                    className="aspect-square max-w-sm mx-auto rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={handleScan}
                  >
                    {isScanning ? (
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
                        <p className="text-muted-foreground">Memindai QR Code...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-3" />
                        <p className="font-medium">Klik untuk Scan QR</p>
                        <p className="text-sm text-muted-foreground">Arahkan kamera ke QR code</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Pastikan QR code terlihat jelas dan berada dalam frame</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleScan}
                    disabled={isScanning}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {isScanning ? "Memindai..." : "Mulai Scan"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
