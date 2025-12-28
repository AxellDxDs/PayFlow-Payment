"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, CreditCard, Search } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Indonesian E-Money Cards
const emoneycards = [
  { id: "emoney", name: "e-money Mandiri", color: "bg-blue-700", type: "NFC Card" },
  { id: "flazz", name: "Flazz BCA", color: "bg-blue-600", type: "NFC Card" },
  { id: "tapcash", name: "TapCash BNI", color: "bg-orange-500", type: "NFC Card" },
  { id: "brizzi", name: "Brizzi BRI", color: "bg-blue-800", type: "NFC Card" },
  { id: "jakcard", name: "JakCard", color: "bg-red-600", type: "NFC Card" },
  { id: "megacash", name: "Mega Cash", color: "bg-blue-500", type: "NFC Card" },
  { id: "nobu", name: "NOBU e-Money", color: "bg-purple-600", type: "NFC Card" },
  { id: "skybiz", name: "SkyBiz", color: "bg-green-600", type: "NFC Card" },
]

// Toll cards
const tollCards = [
  { id: "etoll-mandiri", name: "E-Toll Mandiri", color: "bg-yellow-600", type: "Toll Card" },
  { id: "etoll-bca", name: "E-Toll BCA", color: "bg-blue-600", type: "Toll Card" },
  { id: "etoll-bni", name: "E-Toll BNI", color: "bg-orange-500", type: "Toll Card" },
  { id: "etoll-bri", name: "E-Toll BRI", color: "bg-blue-700", type: "Toll Card" },
]

// Transportation cards
const transportCards = [
  { id: "krl", name: "KMT KRL", color: "bg-red-500", type: "Commuter Line" },
  { id: "mrt", name: "MRT Jakarta", color: "bg-blue-600", type: "MRT" },
  { id: "lrt", name: "LRT Jakarta", color: "bg-red-600", type: "LRT" },
  { id: "transjakarta", name: "Transjakarta", color: "bg-blue-500", type: "Bus" },
]

const allCards = [...emoneycards, ...tollCards, ...transportCards]
const quickAmounts = [25000, 50000, 100000, 200000, 500000, 1000000]

type TopupStep = "select-card" | "input-details" | "confirm" | "processing" | "success"

export default function TopUpCardPage() {
  const router = useRouter()
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [step, setStep] = React.useState<TopupStep>("select-card")
  const [selectedCard, setSelectedCard] = React.useState<string>("")
  const [cardNumber, setCardNumber] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [searchCard, setSearchCard] = React.useState("")
  const [activeTab, setActiveTab] = React.useState<"emoney" | "toll" | "transport">("emoney")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const getCardsByTab = () => {
    switch (activeTab) {
      case "emoney":
        return emoneycards
      case "toll":
        return tollCards
      case "transport":
        return transportCards
      default:
        return emoneycards
    }
  }

  const filteredCards = getCardsByTab().filter((c) => c.name.toLowerCase().includes(searchCard.toLowerCase()))

  const selectedCardData = allCards.find((c) => c.id === selectedCard)

  const handleConfirmTopup = async () => {
    if (!amount || Number.parseInt(amount) < 20000) {
      toast.error("Minimum top up Rp20.000")
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
      description: `Top Up ${selectedCardData?.name} - ${cardNumber}`,
      createdAt: new Date(),
    })

    setIsProcessing(false)
    setStep("success")
    toast.success("Top up kartu berhasil!")
  }

  const resetForm = () => {
    setStep("select-card")
    setSelectedCard("")
    setCardNumber("")
    setAmount("")
    setSearchCard("")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === "select-card" ? router.back() : resetForm())}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Top Up Kartu</h1>
          <p className="text-muted-foreground text-sm">E-Money, E-Toll & Kartu Transportasi</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-amber-600 to-orange-500 border-0 text-white">
        <CardContent className="p-6">
          <p className="text-sm text-white/80">Saldo PayFlow</p>
          <p className="text-3xl font-bold">{formatCurrency(wallet?.balanceMain || 0)}</p>
        </CardContent>
      </Card>

      {/* Step: Select Card */}
      {step === "select-card" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pilih Jenis Kartu
            </CardTitle>
            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              <Button
                variant={activeTab === "emoney" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("emoney")}
                className="flex-1"
              >
                E-Money
              </Button>
              <Button
                variant={activeTab === "toll" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("toll")}
                className="flex-1"
              >
                E-Toll
              </Button>
              <Button
                variant={activeTab === "transport" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("transport")}
                className="flex-1"
              >
                Transport
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kartu..."
                value={searchCard}
                onChange={(e) => setSearchCard(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredCards.map((card) => (
                <Button
                  key={card.id}
                  variant="outline"
                  className={cn(
                    "h-auto py-4 flex-col gap-2 transition-all hover:scale-105",
                    selectedCard === card.id && "border-primary bg-primary/5",
                  )}
                  onClick={() => {
                    setSelectedCard(card.id)
                    setStep("input-details")
                  }}
                >
                  <div
                    className={cn(
                      "w-12 h-8 rounded flex items-center justify-center text-white text-[8px] font-bold",
                      card.color,
                    )}
                  >
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{card.name}</span>
                  <span className="text-[10px] text-muted-foreground">{card.type}</span>
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
              <div
                className={cn("w-8 h-6 rounded flex items-center justify-center text-white", selectedCardData?.color)}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              {selectedCardData?.name}
            </CardTitle>
            <CardDescription>{selectedCardData?.type}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nomor Kartu (16 digit)</Label>
              <Input
                type="text"
                placeholder="Contoh: 1234567890123456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                maxLength={16}
              />
              <p className="text-xs text-muted-foreground">Masukkan 16 digit nomor yang tertera di kartu Anda</p>
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

            <div className="p-4 bg-amber-500/10 rounded-xl">
              <p className="text-sm text-amber-600">
                Pastikan kartu Anda dalam jangkauan NFC handphone atau gunakan fitur top up di mesin EDC terdekat
                setelah pembayaran.
              </p>
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

            <Button
              className="w-full h-12"
              onClick={handleConfirmTopup}
              disabled={!cardNumber || cardNumber.length < 16 || !amount}
            >
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
                <span className="text-sm text-muted-foreground">Jenis Kartu</span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-4 rounded flex items-center justify-center text-white",
                      selectedCardData?.color,
                    )}
                  >
                    <CreditCard className="h-3 w-3" />
                  </div>
                  <span className="font-medium">{selectedCardData?.name}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nomor Kartu</span>
                <span className="font-medium font-mono">{cardNumber.replace(/(.{4})/g, "$1 ").trim()}</span>
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
                className={cn("w-6 h-4 rounded flex items-center justify-center text-white", selectedCardData?.color)}
              >
                <CreditCard className="h-3 w-3" />
              </div>
              <span className="font-medium">{selectedCardData?.name}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Tempelkan kartu ke handphone untuk update saldo atau kunjungi mesin EDC terdekat
            </p>
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
