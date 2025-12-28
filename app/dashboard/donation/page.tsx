"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Heart,
  HandHeart,
  Users,
  Check,
  Loader2,
  Clock,
  Stethoscope,
  GraduationCap,
  Home,
  Baby,
  Leaf,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const donationCategories = [
  { id: "disaster", name: "Bencana Alam", icon: Home, color: "bg-red-500/10 text-red-500" },
  { id: "health", name: "Kesehatan", icon: Stethoscope, color: "bg-pink-500/10 text-pink-500" },
  { id: "education", name: "Pendidikan", icon: GraduationCap, color: "bg-blue-500/10 text-blue-500" },
  { id: "environment", name: "Lingkungan", icon: Leaf, color: "bg-green-500/10 text-green-500" },
  { id: "children", name: "Anak-anak", icon: Baby, color: "bg-purple-500/10 text-purple-500" },
  { id: "social", name: "Sosial", icon: Users, color: "bg-orange-500/10 text-orange-500" },
]

const donationCampaigns = [
  {
    id: "campaign-1",
    title: "Bantu Korban Banjir Kalimantan Selatan",
    category: "disaster",
    organization: "ACT Indonesia",
    description:
      "Ribuan warga terdampak banjir bandang membutuhkan bantuan makanan, pakaian, dan tempat tinggal sementara.",
    target: 500000000,
    collected: 385000000,
    donors: 2450,
    daysLeft: 15,
    image: "/flood-disaster-relief.jpg",
    verified: true,
  },
  {
    id: "campaign-2",
    title: "Operasi Jantung untuk Adik Rina",
    category: "health",
    organization: "Dompet Dhuafa",
    description:
      "Adik Rina (5 tahun) membutuhkan operasi jantung segera untuk dapat bertahan hidup dan tumbuh dengan sehat.",
    target: 150000000,
    collected: 98000000,
    donors: 892,
    daysLeft: 30,
    image: "/placeholder-pxkqv.png",
    verified: true,
  },
  {
    id: "campaign-3",
    title: "Beasiswa Anak Yatim Dhuafa",
    category: "education",
    organization: "Baznas",
    description: "Bantu 100 anak yatim melanjutkan pendidikan mereka ke jenjang yang lebih tinggi.",
    target: 200000000,
    collected: 156000000,
    donors: 1205,
    daysLeft: 45,
    image: "/children-education-scholarship.jpg",
    verified: true,
  },
  {
    id: "campaign-4",
    title: "Tanam 10.000 Pohon untuk Indonesia",
    category: "environment",
    organization: "Greenpeace Indonesia",
    description: "Program reboisasi untuk mengembalikan hutan Indonesia yang rusak akibat deforestasi.",
    target: 100000000,
    collected: 67000000,
    donors: 534,
    daysLeft: 60,
    image: "/tree-planting-reforestation.jpg",
    verified: true,
  },
  {
    id: "campaign-5",
    title: "Panti Asuhan Kasih Sayang",
    category: "children",
    organization: "UNICEF Indonesia",
    description: "Bantu kami menyediakan kebutuhan sehari-hari untuk 50 anak di panti asuhan Kasih Sayang.",
    target: 75000000,
    collected: 45000000,
    donors: 412,
    daysLeft: 20,
    image: "/orphanage-children-care.jpg",
    verified: true,
  },
  {
    id: "campaign-6",
    title: "Bantuan Lansia Terlantar",
    category: "social",
    organization: "Rumah Zakat",
    description: "Program bantuan untuk lansia terlantar yang membutuhkan kebutuhan hidup dasar dan kesehatan.",
    target: 50000000,
    collected: 32000000,
    donors: 287,
    daysLeft: 25,
    image: "/elderly-care.png",
    verified: true,
  },
]

const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000]

export default function DonationPage() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = React.useState<(typeof donationCampaigns)[0] | null>(null)
  const [donationAmount, setDonationAmount] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [donationDialogOpen, setDonationDialogOpen] = React.useState(false)

  const filteredCampaigns = selectedCategory
    ? donationCampaigns.filter((c) => c.category === selectedCategory)
    : donationCampaigns

  const handleDonate = async () => {
    if (!selectedCampaign || !wallet) return

    const amount = Number.parseInt(donationAmount)
    if (!amount || amount < 10000) {
      toast.error("Minimal donasi Rp10.000")
      return
    }

    if (amount > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain - amount })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "payment",
      amount: -amount,
      fee: 0,
      status: "success",
      description: `Donasi - ${selectedCampaign.title}`,
      createdAt: new Date(),
    })

    toast.success("Terima kasih atas donasi Anda! Semoga menjadi berkah.")
    setIsProcessing(false)
    setDonationDialogOpen(false)
    setSelectedCampaign(null)
    setDonationAmount("")
  }

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Donasi</h1>
          <p className="text-muted-foreground">Berbagi kebaikan untuk sesama yang membutuhkan</p>
        </div>
      </ScrollAnimation>

      {/* Categories */}
      <ScrollAnimation animation="fade-up" delay={100}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className={cn(selectedCategory !== null && "bg-transparent")}
            onClick={() => setSelectedCategory(null)}
          >
            Semua
          </Button>
          {donationCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              className={cn("gap-2", selectedCategory !== cat.id && "bg-transparent")}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </Button>
          ))}
        </div>
      </ScrollAnimation>

      {/* Featured Banner */}
      <ScrollAnimation animation="fade-up" delay={200}>
        <Card className="bg-gradient-to-r from-rose-500 to-pink-600 border-0 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Heart className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">Donasi Terpopuler</Badge>
                <h3 className="text-xl font-bold">Satu Kebaikan Bisa Mengubah Banyak Kehidupan</h3>
                <p className="text-white/80 text-sm">
                  Total donasi bulan ini: {formatCurrency(1250000000)} dari 15.000+ donatur
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Kampanye Donasi</h2>
          <Badge variant="secondary">{filteredCampaigns.length} kampanye</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign, index) => {
            const progress = (campaign.collected / campaign.target) * 100
            const category = donationCategories.find((c) => c.id === campaign.category)
            return (
              <ScrollAnimation key={campaign.id} animation="fade-up" delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="h-40 bg-gradient-to-br from-muted to-muted/50 relative">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    {campaign.verified && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("h-6 w-6 rounded flex items-center justify-center", category?.color)}>
                        {category && <category.icon className="h-3 w-3" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{campaign.organization}</span>
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-2">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{campaign.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Terkumpul</span>
                        <span className="font-semibold text-primary">{formatCurrency(campaign.collected)}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress.toFixed(0)}% tercapai</span>
                        <span>Target: {formatCurrency(campaign.target)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{campaign.donors} donatur</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{campaign.daysLeft} hari lagi</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-3"
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setDonationDialogOpen(true)
                      }}
                    >
                      <HandHeart className="h-4 w-4 mr-2" />
                      Donasi Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            )
          })}
        </div>
      </div>

      {/* Donation Dialog */}
      <Dialog open={donationDialogOpen} onOpenChange={setDonationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Berikan Donasi</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-semibold text-sm">{selectedCampaign.title}</p>
                <p className="text-xs text-muted-foreground">{selectedCampaign.organization}</p>
              </div>

              <div className="space-y-2">
                <Label>Pilih Nominal Donasi</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={donationAmount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      className={cn(donationAmount !== amount.toString() && "bg-transparent")}
                      onClick={() => setDonationAmount(amount.toString())}
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Atau Masukkan Nominal Lain</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <Input
                    type="number"
                    placeholder="Minimal 10.000"
                    className="pl-10"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Saldo Anda</span>
                <span className="font-semibold">{formatCurrency(wallet?.balanceMain || 0)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDonationDialogOpen(false)} className="bg-transparent">
              Batal
            </Button>
            <Button onClick={handleDonate} disabled={isProcessing || !donationAmount}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Donasi {donationAmount ? formatCurrency(Number.parseInt(donationAmount)) : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
