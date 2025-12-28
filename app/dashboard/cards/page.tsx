"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  CreditCard,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Settings,
  Trash2,
  Wifi,
  Shield,
  ArrowLeft,
  Copy,
  Loader2,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Mock cards data
const initialCards = [
  {
    id: "card-1",
    type: "virtual",
    name: "PayFlow Virtual Card",
    number: "4532 **** **** 7890",
    fullNumber: "4532 1234 5678 7890",
    expiry: "12/27",
    cvv: "123",
    balance: 5000000,
    isActive: true,
    isLocked: false,
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "card-2",
    type: "debit",
    name: "PayFlow Debit",
    number: "5412 **** **** 3456",
    fullNumber: "5412 9876 5432 3456",
    expiry: "08/26",
    cvv: "456",
    balance: 12500000,
    isActive: true,
    isLocked: false,
    color: "from-emerald-600 to-teal-600",
  },
]

type CardType = (typeof initialCards)[0]

export default function CardsPage() {
  const router = useRouter()
  const { wallet } = useAppStore()
  const [cards, setCards] = React.useState(initialCards)
  const [selectedCard, setSelectedCard] = React.useState<CardType | null>(null)
  const [showCardDetails, setShowCardDetails] = React.useState<Record<string, boolean>>({})
  const [isAddingCard, setIsAddingCard] = React.useState(false)
  const [newCardType, setNewCardType] = React.useState<"virtual" | "physical">("virtual")
  const [isCreatingCard, setIsCreatingCard] = React.useState(false)

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  const toggleCardLock = (cardId: string) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isLocked: !card.isLocked } : card)))
    const card = cards.find((c) => c.id === cardId)
    toast.success(card?.isLocked ? "Kartu berhasil dibuka" : "Kartu berhasil dikunci")
  }

  const deleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId))
    toast.success("Kartu berhasil dihapus")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""))
    toast.success("Berhasil disalin!")
  }

  const handleCreateCard = async () => {
    setIsCreatingCard(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newCard: CardType = {
      id: `card-${Date.now()}`,
      type: newCardType,
      name: newCardType === "virtual" ? "PayFlow Virtual Card" : "PayFlow Physical Card",
      number: `${Math.floor(Math.random() * 9000) + 1000} **** **** ${Math.floor(Math.random() * 9000) + 1000}`,
      fullNumber: `${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
      expiry: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/${Math.floor(Math.random() * 5) + 26}`,
      cvv: String(Math.floor(Math.random() * 900) + 100),
      balance: 0,
      isActive: true,
      isLocked: false,
      color: newCardType === "virtual" ? "from-purple-600 to-pink-600" : "from-gray-700 to-gray-900",
    }

    setCards((prev) => [...prev, newCard])
    setIsCreatingCard(false)
    setIsAddingCard(false)
    toast.success("Kartu baru berhasil dibuat!")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Kartu Saya</h1>
            <p className="text-muted-foreground text-sm">Kelola kartu virtual dan fisik</p>
          </div>
        </div>
        <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kartu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Kartu Baru</DialogTitle>
              <DialogDescription>Pilih jenis kartu yang ingin Anda buat</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto py-6 flex-col gap-3 transition-all",
                    newCardType === "virtual" && "border-primary bg-primary/5",
                  )}
                  onClick={() => setNewCardType("virtual")}
                >
                  <div className="h-12 w-16 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Virtual Card</p>
                    <p className="text-xs text-muted-foreground">Untuk transaksi online</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto py-6 flex-col gap-3 transition-all",
                    newCardType === "physical" && "border-primary bg-primary/5",
                  )}
                  onClick={() => setNewCardType("physical")}
                >
                  <div className="h-12 w-16 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Physical Card</p>
                    <p className="text-xs text-muted-foreground">Kartu fisik dikirim</p>
                  </div>
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Pembuatan</span>
                  <span className={newCardType === "virtual" ? "text-green-600" : ""}>
                    {newCardType === "virtual" ? "GRATIS" : formatCurrency(50000)}
                  </span>
                </div>
                {newCardType === "physical" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimasi Pengiriman</span>
                    <span>3-5 hari kerja</span>
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={handleCreateCard} disabled={isCreatingCard}>
                {isCreatingCard ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Membuat Kartu...
                  </>
                ) : (
                  "Buat Kartu"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {cards.map((card) => (
          <Card key={card.id} className="overflow-hidden">
            {/* Card Visual */}
            <div
              className={cn(
                "relative p-6 bg-gradient-to-br text-white transition-all duration-300",
                card.color,
                card.isLocked && "opacity-60 grayscale",
              )}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wider">{card.type} Card</p>
                  <p className="font-medium">{card.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 rotate-90" />
                  {card.isLocked && <Lock className="h-4 w-4" />}
                </div>
              </div>

              {/* Card Number */}
              <div className="mb-6">
                <p className="text-xl font-mono tracking-widest">
                  {showCardDetails[card.id] ? card.fullNumber : card.number}
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/60 uppercase">Valid Thru</p>
                  <p className="font-mono">{card.expiry}</p>
                </div>
                {showCardDetails[card.id] && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/60 uppercase">CVV</p>
                    <p className="font-mono">{card.cvv}</p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-[10px] text-white/60 uppercase">Balance</p>
                  <p className="font-semibold">{formatCurrency(card.balance)}</p>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/10" />
            </div>

            {/* Card Actions */}
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => toggleCardDetails(card.id)}
                >
                  {showCardDetails[card.id] ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Sembunyikan
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Lihat Detail
                    </>
                  )}
                </Button>

                {showCardDetails[card.id] && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => copyToClipboard(card.fullNumber)}
                  >
                    <Copy className="h-4 w-4" />
                    Salin Nomor
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className={cn("gap-2", card.isLocked && "border-red-500 text-red-500 hover:bg-red-500/10")}
                  onClick={() => toggleCardLock(card.id)}
                >
                  <Lock className="h-4 w-4" />
                  {card.isLocked ? "Buka Kunci" : "Kunci"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 bg-transparent"
                  onClick={() => deleteCard(card.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && (
        <Card>
          <CardContent className="py-16 flex flex-col items-center">
            <CreditCard className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium mb-2">Belum Ada Kartu</p>
            <p className="text-muted-foreground text-sm text-center mb-4">
              Buat kartu virtual untuk mulai bertransaksi online
            </p>
            <Button onClick={() => setIsAddingCard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Kartu Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Card Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fitur Kartu PayFlow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Keamanan 3D Secure</p>
                <p className="text-xs text-muted-foreground">Verifikasi OTP untuk setiap transaksi</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Wifi className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Contactless Payment</p>
                <p className="text-xs text-muted-foreground">Tap untuk bayar di merchant NFC</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Lock className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Kunci Instan</p>
                <p className="text-xs text-muted-foreground">Kunci kartu kapan saja dari aplikasi</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Settings className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Kontrol Penuh</p>
                <p className="text-xs text-muted-foreground">Atur limit dan notifikasi transaksi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
