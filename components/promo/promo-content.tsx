"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { mockPromos } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { Gift, Percent, Clock, Tag, Search, Copy, Check, Ticket, Sparkles } from "@/components/icons"
import { toast } from "sonner"

const promoCategories = [
  { id: "all", label: "Semua Promo" },
  { id: "topup", label: "Top Up" },
  { id: "food", label: "Makanan" },
  { id: "crypto", label: "Crypto" },
  { id: "transfer", label: "Transfer" },
  { id: "bills", label: "Tagihan" },
]

const vouchers = [
  {
    id: "voucher-1",
    code: "NEWYEAR2025",
    title: "Tahun Baru 2025",
    discount: 25,
    discountType: "percentage",
    maxDiscount: 50000,
    minTransaction: 100000,
    validUntil: new Date("2025-01-31"),
    usedCount: 0,
    maxUse: 1,
  },
  {
    id: "voucher-2",
    code: "CASHBACK20K",
    title: "Cashback Spesial",
    discount: 20000,
    discountType: "fixed",
    minTransaction: 50000,
    validUntil: new Date("2025-01-15"),
    usedCount: 1,
    maxUse: 3,
  },
  {
    id: "voucher-3",
    code: "FREEONGKIR",
    title: "Gratis Ongkir",
    discount: 15000,
    discountType: "fixed",
    minTransaction: 30000,
    validUntil: new Date("2025-02-28"),
    usedCount: 0,
    maxUse: 5,
  },
]

export function PromoContent() {
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  const filteredPromos = mockPromos.filter((promo) => {
    const matchesSearch = promo.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || promo.category.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Kode voucher disalin!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Promo & Voucher</h1>
        <p className="text-muted-foreground">Dapatkan penawaran terbaik untuk transaksi Anda</p>
      </div>

      <Tabs defaultValue="promo" className="space-y-6">
        <TabsList>
          <TabsTrigger value="promo">
            <Sparkles className="h-4 w-4 mr-2" />
            Promo Aktif
          </TabsTrigger>
          <TabsTrigger value="voucher">
            <Ticket className="h-4 w-4 mr-2" />
            Voucher Saya
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promo" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari promo..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {promoCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory !== cat.id ? "bg-transparent" : ""}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary to-accent border-0 text-primary-foreground overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="relative z-10">
                <Badge variant="secondary" className="mb-3">
                  Promo Terbatas
                </Badge>
                <h3 className="text-2xl font-bold mb-2">Cashback 50% untuk Pengguna Baru!</h3>
                <p className="text-primary-foreground/80 mb-4">
                  Dapatkan cashback hingga Rp100.000 untuk transaksi pertama Anda
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="secondary">Klaim Sekarang</Button>
                  <span className="text-sm text-primary-foreground/60">Berakhir dalam 3 hari</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPromos.map((promo) => (
              <Card key={promo.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    {promo.discountType === "percentage" ? (
                      <>
                        <Percent className="h-10 w-10 mx-auto text-primary mb-2" />
                        <p className="text-3xl font-bold text-primary">{promo.discount}%</p>
                      </>
                    ) : (
                      <>
                        <Gift className="h-10 w-10 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-bold text-primary">{formatCurrency(promo.discount)}</p>
                      </>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex gap-2 mb-2">
                    {promo.category.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold mb-1">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Clock className="h-3 w-3" />
                    <span>Berlaku hingga {formatDate(promo.validUntil)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Tag className="h-3 w-3" />
                    <span>Min. transaksi {formatCurrency(promo.minTransaction)}</span>
                  </div>
                  <Button className="w-full" size="sm">
                    Gunakan Promo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="voucher" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redeem Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Masukkan kode voucher" className="flex-1" />
                <Button>Redeem</Button>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-semibold">Voucher Tersedia</h3>
          <div className="space-y-3">
            {vouchers.map((voucher) => (
              <Card key={voucher.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Ticket className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{voucher.title}</h4>
                        <Badge variant="secondary">
                          {voucher.discountType === "percentage"
                            ? `${voucher.discount}%`
                            : formatCurrency(voucher.discount)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Min. transaksi {formatCurrency(voucher.minTransaction)}
                        {voucher.maxDiscount && ` - Max. ${formatCurrency(voucher.maxDiscount)}`}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Berlaku hingga {formatDate(voucher.validUntil)}
                        </span>
                        <span>
                          Digunakan {voucher.usedCount}/{voucher.maxUse}x
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1.5 rounded bg-muted font-mono text-sm font-medium mb-2">
                        {voucher.code}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => copyVoucherCode(voucher.code)}
                      >
                        {copiedCode === voucher.code ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Disalin
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Salin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
