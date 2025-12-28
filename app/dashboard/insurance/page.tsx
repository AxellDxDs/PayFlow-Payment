"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Shield,
  Car,
  Heart,
  Stethoscope,
  Plane,
  Home,
  Baby,
  ChevronRight,
  Check,
  Loader2,
  Star,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const insuranceCategories = [
  {
    id: "health",
    name: "Asuransi Kesehatan",
    icon: Stethoscope,
    color: "bg-red-500/10 text-red-500",
    description: "Perlindungan biaya kesehatan dan rumah sakit",
  },
  {
    id: "life",
    name: "Asuransi Jiwa",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-500",
    description: "Perlindungan finansial untuk keluarga",
  },
  {
    id: "vehicle",
    name: "Asuransi Kendaraan",
    icon: Car,
    color: "bg-blue-500/10 text-blue-500",
    description: "Perlindungan mobil dan motor dari risiko",
  },
  {
    id: "travel",
    name: "Asuransi Perjalanan",
    icon: Plane,
    color: "bg-sky-500/10 text-sky-500",
    description: "Perlindungan saat bepergian domestik & internasional",
  },
  {
    id: "property",
    name: "Asuransi Properti",
    icon: Home,
    color: "bg-amber-500/10 text-amber-500",
    description: "Perlindungan rumah dan isi rumah",
  },
  {
    id: "education",
    name: "Asuransi Pendidikan",
    icon: Baby,
    color: "bg-purple-500/10 text-purple-500",
    description: "Jaminan biaya pendidikan anak",
  },
]

const insuranceProducts = [
  {
    id: "health-1",
    category: "health",
    name: "PayFlow Health Plus",
    provider: "Prudential",
    description: "Asuransi kesehatan premium dengan coverage luas",
    coverage: 500000000,
    premium: 450000,
    period: "bulanan",
    benefits: [
      "Rawat inap hingga Rp500 juta/tahun",
      "Rawat jalan unlimited",
      "Melahirkan hingga Rp50 juta",
      "Perawatan gigi hingga Rp10 juta",
    ],
    rating: 4.8,
    users: "50K+",
  },
  {
    id: "health-2",
    category: "health",
    name: "PayFlow Health Basic",
    provider: "AXA Mandiri",
    description: "Asuransi kesehatan terjangkau untuk semua",
    coverage: 100000000,
    premium: 150000,
    period: "bulanan",
    benefits: ["Rawat inap hingga Rp100 juta/tahun", "Rawat jalan Rp5 juta/tahun", "ICU & Operasi covered"],
    rating: 4.5,
    users: "100K+",
  },
  {
    id: "vehicle-1",
    category: "vehicle",
    name: "PayFlow Auto Care",
    provider: "Allianz",
    description: "Proteksi lengkap untuk kendaraan Anda",
    coverage: 300000000,
    premium: 250000,
    period: "bulanan",
    benefits: [
      "All Risk Coverage",
      "TLO (Total Loss Only)",
      "Kecelakaan penumpang",
      "Third Party Liability",
      "Emergency Roadside Assistance",
    ],
    rating: 4.7,
    users: "25K+",
  },
  {
    id: "travel-1",
    category: "travel",
    name: "PayFlow Travel Guard",
    provider: "AIG",
    description: "Perjalanan aman tanpa khawatir",
    coverage: 1000000000,
    premium: 75000,
    period: "per trip",
    benefits: [
      "Medical coverage hingga Rp1 Miliar",
      "Flight delay compensation",
      "Lost baggage protection",
      "Trip cancellation",
    ],
    rating: 4.6,
    users: "30K+",
  },
  {
    id: "life-1",
    category: "life",
    name: "PayFlow Life Secure",
    provider: "Manulife",
    description: "Lindungi masa depan keluarga Anda",
    coverage: 1000000000,
    premium: 500000,
    period: "bulanan",
    benefits: [
      "Santunan meninggal dunia Rp1 Miliar",
      "Cacat tetap total Rp500 juta",
      "Perlindungan penyakit kritis",
      "Cash value building",
    ],
    rating: 4.9,
    users: "40K+",
  },
  {
    id: "property-1",
    category: "property",
    name: "PayFlow Home Shield",
    provider: "Sinarmas",
    description: "Rumah aman, hati tenang",
    coverage: 500000000,
    premium: 200000,
    period: "bulanan",
    benefits: ["Kebakaran & petir", "Banjir & gempa bumi", "Pencurian dengan kekerasan", "Kerusakan akibat kendaraan"],
    rating: 4.4,
    users: "15K+",
  },
]

export default function InsurancePage() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = React.useState<(typeof insuranceProducts)[0] | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false)

  const filteredProducts = selectedCategory
    ? insuranceProducts.filter((p) => p.category === selectedCategory)
    : insuranceProducts

  const handlePurchase = async () => {
    if (!selectedProduct || !wallet) return

    if (selectedProduct.premium > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain - selectedProduct.premium })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "payment",
      amount: -selectedProduct.premium,
      fee: 0,
      status: "success",
      description: `Asuransi - ${selectedProduct.name}`,
      createdAt: new Date(),
    })

    toast.success("Pembelian asuransi berhasil! Polis akan dikirim ke email Anda")
    setIsProcessing(false)
    setPurchaseDialogOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Asuransi</h1>
          <p className="text-muted-foreground">Lindungi diri dan keluarga dengan asuransi terbaik</p>
        </div>
      </ScrollAnimation>

      {/* Categories */}
      <ScrollAnimation animation="fade-up" delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kategori Asuransi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {insuranceCategories.map((cat, index) => (
                <ScrollAnimation key={cat.id} animation="zoom-in" delay={index * 50}>
                  <Button
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    className={cn(
                      "h-auto flex-col gap-2 p-4 w-full",
                      selectedCategory !== cat.id && "bg-transparent hover:bg-muted/50",
                    )}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  >
                    <cat.icon className="h-6 w-6" />
                    <span className="text-xs font-medium text-center">{cat.name}</span>
                  </Button>
                </ScrollAnimation>
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Featured Banner */}
      <ScrollAnimation animation="fade-up" delay={200}>
        <Card className="bg-gradient-to-r from-teal-500 to-emerald-600 border-0 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">Promo Khusus</Badge>
                <h3 className="text-xl font-bold">Diskon 20% Premi Pertama!</h3>
                <p className="text-white/80 text-sm">Untuk pembelian asuransi kesehatan dan jiwa</p>
              </div>
              <Button variant="secondary" size="sm">
                Lihat Promo
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedCategory
              ? insuranceCategories.find((c) => c.id === selectedCategory)?.name
              : "Semua Produk Asuransi"}
          </h2>
          <Badge variant="secondary">{filteredProducts.length} produk</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => {
            const category = insuranceCategories.find((c) => c.id === product.category)
            return (
              <ScrollAnimation key={product.id} animation="fade-up" delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", category?.color)}>
                        {category && <category.icon className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.provider}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{product.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.benefits.slice(0, 2).map((benefit, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {product.benefits.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.benefits.length - 2} lainnya
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Coverage</p>
                            <p className="font-semibold text-primary">{formatCurrency(product.coverage)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Premi {product.period}</p>
                            <p className="font-bold">{formatCurrency(product.premium)}</p>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-3"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product)
                            setPurchaseDialogOpen(true)
                          }}
                        >
                          Beli Sekarang
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            )
          })}
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembelian Asuransi</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.provider}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Manfaat Perlindungan:</h4>
                <ul className="space-y-1">
                  {selectedProduct.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium">{formatCurrency(selectedProduct.coverage)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premi ({selectedProduct.period})</span>
                  <span className="font-bold text-primary">{formatCurrency(selectedProduct.premium)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Saldo Anda</span>
                <span className="font-semibold">{formatCurrency(wallet?.balanceMain || 0)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)} className="bg-transparent">
              Batal
            </Button>
            <Button onClick={handlePurchase} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Beli Asuransi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
