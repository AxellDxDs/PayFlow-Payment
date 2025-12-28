"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Search, Smartphone } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Indonesian E-Wallets
const ewallets = [
  { id: "gopay", name: "GoPay", color: "bg-green-500", provider: "Gojek" },
  { id: "ovo", name: "OVO", color: "bg-purple-600", provider: "Grab" },
  { id: "dana", name: "DANA", color: "bg-blue-500", provider: "DANA Indonesia" },
  { id: "shopeepay", name: "ShopeePay", color: "bg-orange-500", provider: "Shopee" },
  { id: "linkaja", name: "LinkAja", color: "bg-red-500", provider: "Telkomsel" },
  { id: "isaku", name: "iSaku", color: "bg-blue-600", provider: "Indomaret" },
  { id: "sakuku", name: "Sakuku", color: "bg-blue-700", provider: "BCA" },
  { id: "jenius", name: "Jenius Pay", color: "bg-cyan-500", provider: "BTPN" },
  { id: "doku", name: "DOKU", color: "bg-red-600", provider: "DOKU" },
  { id: "kredivo", name: "Kredivo", color: "bg-teal-500", provider: "Kredivo" },
  { id: "akulaku", name: "Akulaku", color: "bg-pink-500", provider: "Akulaku" },
  { id: "blu", name: "blu", color: "bg-blue-600", provider: "BCA Digital" },
  { id: "livin", name: "Livin Mandiri", color: "bg-blue-700", provider: "Mandiri" },
  { id: "brimo", name: "BRImo", color: "bg-blue-800", provider: "BRI" },
  { id: "octo", name: "OCTO Mobile", color: "bg-red-700", provider: "CIMB Niaga" },
  { id: "mytelkomsel", name: "MyTelkomsel", color: "bg-red-500", provider: "Telkomsel" },
  { id: "byu", name: "by.U", color: "bg-purple-500", provider: "Telkomsel" },
  { id: "payfazz", name: "Payfazz", color: "bg-blue-500", provider: "Payfazz" },
  { id: "flip", name: "Flip", color: "bg-orange-600", provider: "Flip" },
  { id: "astrapay", name: "AstraPay", color: "bg-blue-500", provider: "Astra" },
]

const quickAmounts = [20000, 50000, 100000, 200000, 500000, 1000000]

type TopupStep = "select-wallet" | "input-details" | "confirm" | "processing" | "success"

export default function EWalletPage() {
  const router = useRouter()
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [step, setStep] = React.useState<TopupStep>("select-wallet")
  const [selectedWallet, setSelectedWallet] = React.useState<string>("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [searchWallet, setSearchWallet] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const filteredWallets = ewallets.filter(
    (w) =>
      w.name.toLowerCase().includes(searchWallet.toLowerCase()) ||
      w.provider.toLowerCase().includes(searchWallet.toLowerCase()),
  )

  const selectedWalletData = ewallets.find((w) => w.id === selectedWallet)

  const handleConfirmTopup = async () => {
    if (!amount || Number.parseInt(amount) < 10000) {
      toast.error("Minimum top up Rp10.000")
      return
    }
    if (Number.parseInt(amount) > (wallet?.balanceMain || 0)) {
      toast.error("Saldo tidak mencukupi")
      return
    }
    setStep("confirm")
  }

  const handleProcessTopup = async () => {
    setStep("processing")
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const topupAmount = Number.parseInt(amount)
    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) - topupAmount,
    })

    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "transfer",
      amount: -topupAmount,
      fee: 0,
      status: "success",
      description: `Top Up ${selectedWalletData?.name} - ${phoneNumber}`,
      createdAt: new Date(),
    })

    setIsProcessing(false)
    setStep("success")
    toast.success("Top up e-wallet berhasil!")
  }

  const resetForm = () => {
    setStep("select-wallet")
    setSelectedWallet("")
    setPhoneNumber("")
    setAmount("")
    setSearchWallet("")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === "select-wallet" ? router.back() : resetForm())}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Top Up E-Wallet</h1>
          <p className="text-muted-foreground text-sm">Isi saldo e-wallet dari PayFlow</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-500 border-0 text-white">
        <CardContent className="p-6">
          <p className="text-sm text-white/80">Saldo PayFlow</p>
          <p className="text-3xl font-bold">{formatCurrency(wallet?.balanceMain || 0)}</p>
        </CardContent>
      </Card>

      {/* Step: Select Wallet */}
      {step === "select-wallet" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Pilih E-Wallet
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari e-wallet..."
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredWallets.map((ew) => (
                <Button
                  key={ew.id}
                  variant="outline"
                  className={cn(
                    "h-auto py-4 flex-col gap-2 transition-all hover:scale-105",
                    selectedWallet === ew.id && "border-primary bg-primary/5",
                  )}
                  onClick={() => {
                    setSelectedWallet(ew.id)
                    setStep("input-details")
                  }}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                      ew.color,
                    )}
                  >
                    {ew.name.slice(0, 2)}
                  </div>
                  <span className="text-xs font-medium text-center">{ew.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Input Details */}
      {step === "input-details" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedWalletData && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    selectedWalletData.color,
                  )}
                >
                  {selectedWalletData.name.slice(0, 2)}
                </div>
              )}
              {selectedWalletData?.name}
            </CardTitle>
            <CardDescription>{selectedWalletData?.provider}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nomor HP Terdaftar</Label>
              <Input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Jumlah Top Up</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 text-xl h-14 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                  className={cn(
                    "text-xs transition-all",
                    amount === amt.toString() && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  {amt >= 1000000 ? `${amt / 1000000}Jt` : `${amt / 1000}Rb`}
                </Button>
              ))}
            </div>

            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="text-green-600 font-medium">GRATIS</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{amount ? formatCurrency(Number.parseInt(amount)) : "-"}</span>
              </div>
            </div>

            <Button className="w-full h-12" onClick={handleConfirmTopup} disabled={!phoneNumber || !amount}>
              Lanjutkan
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Konfirmasi Top Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-xl space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">E-Wallet</span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold",
                      selectedWalletData?.color,
                    )}
                  >
                    {selectedWalletData?.name.slice(0, 2)}
                  </div>
                  <span className="font-medium">{selectedWalletData?.name}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nomor HP</span>
                <span className="font-medium font-mono">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Jumlah</span>
                <span className="font-bold text-lg">{formatCurrency(Number.parseInt(amount))}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("input-details")}>
                Ubah
              </Button>
              <Button className="flex-1" onClick={handleProcessTopup}>
                Konfirmasi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <Card className="animate-in fade-in duration-300">
          <CardContent className="py-16 flex flex-col items-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Memproses Top Up...</p>
            <p className="text-muted-foreground text-sm">Mohon tunggu sebentar</p>
          </CardContent>
        </Card>
      )}

      {/* Step: Success */}
      {step === "success" && (
        <Card className="animate-in zoom-in duration-300">
          <CardContent className="py-12 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-xl font-bold mb-2">Top Up Berhasil!</p>
            <p className="text-muted-foreground text-center mb-2">
              {formatCurrency(Number.parseInt(amount))} telah dikirim ke
            </p>
            <div className="flex items-center gap-2 mb-6">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold",
                  selectedWalletData?.color,
                )}
              >
                {selectedWalletData?.name.slice(0, 2)}
              </div>
              <span className="font-medium">
                {selectedWalletData?.name} - {phoneNumber}
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>
                Top Up Lagi
              </Button>
              <Button onClick={() => router.push("/dashboard")}>Ke Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
