"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Zap,
  Droplets,
  Tv,
  Wifi,
  Phone,
  CreditCard,
  Search,
  Loader2,
  Check,
  Clock,
  Receipt,
  Building2,
  AlertCircle,
  CheckCircle2,
  History,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const billCategories = [
  { id: "pln", name: "Listrik PLN", icon: Zap, color: "text-yellow-500 bg-yellow-500/10" },
  { id: "pdam", name: "PDAM", icon: Droplets, color: "text-cyan-500 bg-cyan-500/10" },
  { id: "internet", name: "Internet", icon: Wifi, color: "text-blue-500 bg-blue-500/10" },
  { id: "tv", name: "TV Kabel", icon: Tv, color: "text-purple-500 bg-purple-500/10" },
  { id: "telepon", name: "Telepon", icon: Phone, color: "text-green-500 bg-green-500/10" },
  { id: "kartu-kredit", name: "Kartu Kredit", icon: CreditCard, color: "text-red-500 bg-red-500/10" },
  { id: "multifinance", name: "Multifinance", icon: Building2, color: "text-orange-500 bg-orange-500/10" },
  { id: "bpjs", name: "BPJS", icon: Receipt, color: "text-emerald-500 bg-emerald-500/10" },
]

export default function BillsPage() {
  const { wallet, bills, payBill, updateMissionProgress, missions } = useAppStore()
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [customerId, setCustomerId] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [processingBillId, setProcessingBillId] = React.useState<string | null>(null)
  const [foundBill, setFoundBill] = React.useState<(typeof bills)[0] | null>(null)

  const pendingBills = bills.filter((b) => b.status === "pending")
  const paidBills = bills.filter((b) => b.status === "paid")

  const handleSearch = async () => {
    if (!customerId || !selectedCategory) return

    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const bill = pendingBills.find((b) => b.type === selectedCategory)
    if (bill) {
      setFoundBill({ ...bill, customerId })
    } else {
      toast.error("Tagihan tidak ditemukan")
      setFoundBill(null)
    }
    setIsSearching(false)
  }

  const handlePayBill = async (billId: string) => {
    const bill = bills.find((b) => b.id === billId)
    if (!bill || !wallet) return

    if (bill.amount > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setProcessingBillId(billId)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    payBill(billId)

    // Update mission progress for bill payment
    const billMission = missions.find((m) => m.title.toLowerCase().includes("tagihan") && !m.isCompleted)
    if (billMission) {
      updateMissionProgress(billMission.id, billMission.progress + 1)
    }

    toast.success("Pembayaran berhasil! Poin telah ditambahkan.")
    setProcessingBillId(null)
    setFoundBill(null)
    setCustomerId("")
    setSelectedCategory(null)
  }

  const getCategoryIcon = (type: string) => {
    const category = billCategories.find((c) => c.id === type)
    return category ? category.icon : Receipt
  }

  const getCategoryColor = (type: string) => {
    const category = billCategories.find((c) => c.id === type)
    return category?.color || "text-muted-foreground bg-muted"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tagihan</h1>
        <p className="text-muted-foreground">Bayar semua tagihan Anda dengan mudah dan cepat</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Menunggu ({pendingBills.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Terbayar ({paidBills.length})
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Cari Tagihan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingBills.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Tagihan Menunggu Pembayaran
                  </CardTitle>
                  <Badge variant="secondary">{pendingBills.length} tagihan</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingBills.map((bill) => {
                  const IconComponent = getCategoryIcon(bill.type)
                  const dueDate = new Date(bill.dueDate)
                  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                  return (
                    <div key={bill.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center",
                          getCategoryColor(bill.type),
                        )}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{bill.name}</p>
                          {daysUntilDue <= 3 && daysUntilDue > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {daysUntilDue} hari lagi
                            </Badge>
                          )}
                          {daysUntilDue <= 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Jatuh Tempo!
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bill.customerName} - {bill.period}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>Jatuh tempo: {dueDate.toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(bill.amount)}</p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => handlePayBill(bill.id)}
                          disabled={processingBillId === bill.id || (wallet?.balanceMain || 0) < bill.amount}
                        >
                          {processingBillId === bill.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bayar"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Tidak ada tagihan menunggu</p>
                  <p className="text-sm">Semua tagihan sudah dibayar</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          {paidBills.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-green-500" />
                  Riwayat Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paidBills.map((bill) => {
                  const IconComponent = getCategoryIcon(bill.type)

                  return (
                    <div
                      key={bill.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center",
                          getCategoryColor(bill.type),
                        )}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{bill.name}</p>
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                            Lunas
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bill.customerName} - {bill.period}
                        </p>
                        {bill.paidAt && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Dibayar: {new Date(bill.paidAt).toLocaleDateString("id-ID")}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-muted-foreground">{formatCurrency(bill.amount)}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Belum ada riwayat pembayaran</p>
                  <p className="text-sm">Pembayaran tagihan Anda akan muncul di sini</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {/* Bill Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pilih Jenis Tagihan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {billCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "h-auto flex-col gap-2 p-4",
                      selectedCategory !== category.id && "hover:bg-muted/50 bg-transparent",
                    )}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setFoundBill(null)
                      setCustomerId("")
                    }}
                  >
                    <category.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Bill */}
          {selectedCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Cari Tagihan {billCategories.find((c) => c.id === selectedCategory)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ID Pelanggan / Nomor Meteran</Label>
                  <Input
                    placeholder="Masukkan ID pelanggan atau nomor meteran"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleSearch} disabled={isSearching || !customerId}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mencari tagihan...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cek Tagihan
                    </>
                  )}
                </Button>

                {/* Found Bill */}
                {foundBill && (
                  <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                    <div className="flex items-center gap-2 text-green-500">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Tagihan Ditemukan</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nama Pelanggan</span>
                        <span className="font-medium">{foundBill.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID Pelanggan</span>
                        <span className="font-medium">{foundBill.customerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Periode</span>
                        <span className="font-medium">{foundBill.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jatuh Tempo</span>
                        <span className="font-medium">{new Date(foundBill.dueDate).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="pt-3 border-t border-border flex justify-between items-center">
                        <span className="text-muted-foreground">Total Tagihan</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(foundBill.amount)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-muted-foreground">Saldo Anda</span>
                        <span className="font-medium">{formatCurrency(wallet?.balanceMain || 0)}</span>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => handlePayBill(foundBill.id)}
                        disabled={processingBillId === foundBill.id || (wallet?.balanceMain || 0) < foundBill.amount}
                      >
                        {processingBillId === foundBill.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses pembayaran...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Bayar Sekarang
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
