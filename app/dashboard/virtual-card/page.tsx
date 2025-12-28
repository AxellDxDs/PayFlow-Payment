"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
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
  CreditCard,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Lock,
  Unlock,
  Trash2,
  Shield,
  Globe,
  Loader2,
  Sparkles,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface VirtualCard {
  id: string
  name: string
  cardNumber: string
  cvv: string
  expiryDate: string
  balance: number
  limit: number
  isLocked: boolean
  isOnlineOnly: boolean
  color: string
  lastUsed?: Date
}

const sampleCards: VirtualCard[] = [
  {
    id: "1",
    name: "Shopping Card",
    cardNumber: "4532 8901 2345 6789",
    cvv: "123",
    expiryDate: "12/27",
    balance: 2500000,
    limit: 5000000,
    isLocked: false,
    isOnlineOnly: true,
    color: "from-violet-600 to-indigo-600",
    lastUsed: new Date(),
  },
  {
    id: "2",
    name: "Subscription Card",
    cardNumber: "4532 1234 5678 9012",
    cvv: "456",
    expiryDate: "06/28",
    balance: 1000000,
    limit: 2000000,
    isLocked: false,
    isOnlineOnly: true,
    color: "from-emerald-600 to-teal-600",
    lastUsed: new Date(2025, 0, 25),
  },
  {
    id: "3",
    name: "Travel Card",
    cardNumber: "4532 5678 9012 3456",
    cvv: "789",
    expiryDate: "03/29",
    balance: 5000000,
    limit: 10000000,
    isLocked: true,
    isOnlineOnly: false,
    color: "from-orange-600 to-red-600",
  },
]

export default function VirtualCardPage() {
  const { balance } = useAppStore()
  const [cards, setCards] = React.useState<VirtualCard[]>(sampleCards)
  const [selectedCard, setSelectedCard] = React.useState<VirtualCard | null>(null)
  const [showCardNumber, setShowCardNumber] = React.useState<Record<string, boolean>>({})
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [showTopupDialog, setShowTopupDialog] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [topupAmount, setTopupAmount] = React.useState("")

  const [newCardData, setNewCardData] = React.useState({
    name: "",
    limit: "1000000",
    isOnlineOnly: true,
  })

  const generateCardNumber = () => {
    const segments = []
    for (let i = 0; i < 4; i++) {
      segments.push(String(Math.floor(1000 + Math.random() * 9000)))
    }
    return segments.join(" ")
  }

  const handleCreateCard = async () => {
    if (!newCardData.name) {
      toast.error("Mohon masukkan nama kartu")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const colors = [
      "from-violet-600 to-indigo-600",
      "from-emerald-600 to-teal-600",
      "from-orange-600 to-red-600",
      "from-pink-600 to-rose-600",
      "from-cyan-600 to-blue-600",
    ]

    const newCard: VirtualCard = {
      id: Date.now().toString(),
      name: newCardData.name,
      cardNumber: generateCardNumber(),
      cvv: String(Math.floor(100 + Math.random() * 900)),
      expiryDate: "12/28",
      balance: 0,
      limit: Number(newCardData.limit),
      isLocked: false,
      isOnlineOnly: newCardData.isOnlineOnly,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setCards((prev) => [...prev, newCard])
    setIsProcessing(false)
    setShowCreateDialog(false)
    setNewCardData({ name: "", limit: "1000000", isOnlineOnly: true })
    toast.success("Kartu virtual berhasil dibuat!")
  }

  const handleTopup = async () => {
    if (!selectedCard || !topupAmount || Number(topupAmount) < 10000) {
      toast.error("Minimum top up Rp 10.000")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setCards((prev) =>
      prev.map((card) =>
        card.id === selectedCard.id ? { ...card, balance: card.balance + Number(topupAmount) } : card,
      ),
    )

    setIsProcessing(false)
    setShowTopupDialog(false)
    setTopupAmount("")
    toast.success("Top up berhasil!")
  }

  const toggleCardLock = (cardId: string) => {
    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isLocked: !card.isLocked } : card)))
    const card = cards.find((c) => c.id === cardId)
    toast.success(card?.isLocked ? "Kartu berhasil diaktifkan" : "Kartu berhasil dikunci")
  }

  const handleCopyNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ""))
    toast.success("Nomor kartu disalin!")
  }

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId))
    toast.success("Kartu berhasil dihapus")
  }

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0)

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kartu Virtual</h1>
          <p className="text-muted-foreground">Kelola kartu virtual untuk belanja online</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Kartu Baru
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Kartu</p>
                <p className="text-2xl font-bold">{cards.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saldo</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kartu Aktif</p>
                <p className="text-2xl font-bold">{cards.filter((c) => !c.isLocked).length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className={cn("overflow-hidden", card.isLocked && "opacity-60")}>
            {/* Card Visual */}
            <div className={cn("relative h-48 p-6 bg-gradient-to-br text-white", card.color)}>
              {card.isLocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Kartu Terkunci</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs opacity-80">Virtual Card</p>
                  <p className="font-semibold">{card.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {card.isOnlineOnly && (
                    <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  )}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-lg font-mono tracking-wider">
                    {showCardNumber[card.id] ? card.cardNumber : "•••• •••• •••• " + card.cardNumber.slice(-4)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20"
                    onClick={() => setShowCardNumber((prev) => ({ ...prev, [card.id]: !prev[card.id] }))}
                  >
                    {showCardNumber[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20"
                    onClick={() => handleCopyNumber(card.cardNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-xs opacity-80">CVV</p>
                    <p className="font-mono">{showCardNumber[card.id] ? card.cvv : "•••"}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Exp</p>
                    <p className="font-mono">{card.expiryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Saldo</span>
                    <span>
                      {formatCurrency(card.balance)} / {formatCurrency(card.limit)}
                    </span>
                  </div>
                  <Progress value={(card.balance / card.limit) * 100} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCard(card)
                        setShowTopupDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Top Up
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleCardLock(card.id)}>
                      {card.isLocked ? (
                        <>
                          <Unlock className="h-4 w-4 mr-1" />
                          Aktifkan
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-1" />
                          Kunci
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Card Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kartu Virtual Baru</DialogTitle>
            <DialogDescription>Kartu virtual untuk belanja online yang aman</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nama Kartu</Label>
              <Input
                placeholder="contoh: Shopping Card"
                value={newCardData.name}
                onChange={(e) => setNewCardData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Limit Kartu</Label>
              <Input
                type="number"
                placeholder="Rp 1.000.000"
                value={newCardData.limit}
                onChange={(e) => setNewCardData((prev) => ({ ...prev, limit: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Maksimal: {formatCurrency(balance)}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Hanya untuk Online</Label>
                <p className="text-xs text-muted-foreground">Kartu hanya dapat digunakan untuk transaksi online</p>
              </div>
              <Switch
                checked={newCardData.isOnlineOnly}
                onCheckedChange={(checked) => setNewCardData((prev) => ({ ...prev, isOnlineOnly: checked }))}
              />
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Keamanan Kartu Virtual</p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• Nomor kartu unik untuk setiap transaksi</li>
                    <li>• Dapat dikunci kapan saja</li>
                    <li>• Limit dapat diatur sesuai kebutuhan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateCard} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Membuat...
                </>
              ) : (
                "Buat Kartu"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Top Up Dialog */}
      <Dialog open={showTopupDialog} onOpenChange={setShowTopupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Kartu Virtual</DialogTitle>
            <DialogDescription>{selectedCard?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Jumlah Top Up</Label>
              <Input
                type="number"
                placeholder="Minimum Rp 10.000"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[50000, 100000, 500000, 1000000].map((amount) => (
                <Button key={amount} variant="outline" size="sm" onClick={() => setTopupAmount(String(amount))}>
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            <div className="bg-secondary/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Saldo saat ini</span>
                <span>{formatCurrency(selectedCard?.balance || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Limit kartu</span>
                <span>{formatCurrency(selectedCard?.limit || 0)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTopupDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleTopup} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Top Up Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
