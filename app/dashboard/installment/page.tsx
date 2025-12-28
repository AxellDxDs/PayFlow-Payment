"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Home,
  Car,
  Smartphone,
  Laptop,
  Search,
  Loader2,
  Check,
  Clock,
  Calculator,
  CheckCircle2,
  History,
  TrendingUp,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const installmentTypes = [
  { id: "home", name: "KPR", icon: Home, color: "bg-blue-500/10 text-blue-500" },
  { id: "vehicle", name: "Kendaraan", icon: Car, color: "bg-green-500/10 text-green-500" },
  { id: "electronics", name: "Elektronik", icon: Laptop, color: "bg-purple-500/10 text-purple-500" },
  { id: "phone", name: "Handphone", icon: Smartphone, color: "bg-orange-500/10 text-orange-500" },
]

const financialPartners = [
  { id: "bca", name: "BCA Finance", logo: "BCA" },
  { id: "mandiri", name: "Mandiri Tunas Finance", logo: "MTF" },
  { id: "adira", name: "Adira Finance", logo: "ADF" },
  { id: "bfi", name: "BFI Finance", logo: "BFI" },
  { id: "wom", name: "WOM Finance", logo: "WOM" },
  { id: "fif", name: "FIF Group", logo: "FIF" },
]

export default function InstallmentPage() {
  const { wallet, installments, payInstallment } = useAppStore()
  const [selectedType, setSelectedType] = React.useState<string | null>(null)
  const [partner, setPartner] = React.useState("")
  const [contractNumber, setContractNumber] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [selectedInstallment, setSelectedInstallment] = React.useState<(typeof installments)[0] | null>(null)
  const [processingId, setProcessingId] = React.useState<string | null>(null)

  const activeInstallments = installments.filter((i) => i.status === "active")
  const completedInstallments = installments.filter((i) => i.status === "completed")

  const handleSearch = async () => {
    if (!partner || !contractNumber) {
      toast.error("Pilih lembaga pembiayaan dan masukkan nomor kontrak")
      return
    }

    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const found = activeInstallments.find((i) => i.partner.toLowerCase().includes(partner.toLowerCase()))
    if (found) {
      setSelectedInstallment({ ...found, contractNumber })
    } else {
      toast.error("Data cicilan tidak ditemukan")
    }
    setIsSearching(false)
  }

  const handlePayInstallment = async (installmentId: string) => {
    const installment = installments.find((i) => i.id === installmentId)
    if (!installment || !wallet) return

    if (installment.monthlyPayment > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setProcessingId(installmentId)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    payInstallment(installmentId)

    const updatedInstallment = installments.find((i) => i.id === installmentId)
    if (updatedInstallment?.paidTenure === updatedInstallment?.tenure) {
      toast.success("Selamat! Cicilan Anda telah lunas!")
    } else {
      toast.success("Pembayaran cicilan berhasil! Poin telah ditambahkan.")
    }

    setProcessingId(null)
    setSelectedInstallment(null)
    setContractNumber("")
  }

  const getTypeIcon = (type: string) => {
    const found = installmentTypes.find((t) => t.id === type)
    return found?.icon || Calculator
  }

  const getTypeColor = (type: string) => {
    const found = installmentTypes.find((t) => t.id === type)
    return found?.color || "bg-gray-500/10 text-gray-500"
  }

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Cicilan</h1>
          <p className="text-muted-foreground">Bayar cicilan multifinance dengan mudah dan cepat</p>
        </div>
      </ScrollAnimation>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />
            Aktif ({activeInstallments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Lunas ({completedInstallments.length})
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Cari Cicilan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeInstallments.length > 0 ? (
            <ScrollAnimation animation="fade-up" delay={100}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Cicilan Aktif Anda
                    </CardTitle>
                    <Badge variant="secondary">{activeInstallments.length} cicilan</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeInstallments.map((installment, index) => {
                    const Icon = getTypeIcon(installment.type)
                    const progress = (installment.paidTenure / installment.tenure) * 100
                    const nextDueDate = new Date(installment.nextDueDate)
                    const daysUntilDue = Math.ceil((nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                    return (
                      <ScrollAnimation key={installment.id} animation="fade-up" delay={index * 100}>
                        <div className="p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center",
                                getTypeColor(installment.type),
                              )}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold">{installment.name}</h3>
                                  <p className="text-sm text-muted-foreground">{installment.partner}</p>
                                  <p className="text-xs text-muted-foreground">No. {installment.contractNumber}</p>
                                </div>
                                {daysUntilDue <= 7 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {daysUntilDue <= 0 ? "Jatuh Tempo!" : `${daysUntilDue} hari lagi`}
                                  </Badge>
                                )}
                              </div>

                              <div className="mt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Progress Pembayaran</span>
                                  <span className="font-medium">
                                    {installment.paidTenure}/{installment.tenure} bulan
                                  </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Terbayar: {formatCurrency(installment.paidAmount)}</span>
                                  <span>Total: {formatCurrency(installment.totalAmount)}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                                <div>
                                  <p className="text-xs text-muted-foreground">Tagihan Bulan Ini</p>
                                  <p className="font-bold text-primary">{formatCurrency(installment.monthlyPayment)}</p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handlePayInstallment(installment.id)}
                                  disabled={
                                    processingId === installment.id ||
                                    (wallet?.balanceMain || 0) < installment.monthlyPayment
                                  }
                                >
                                  {processingId === installment.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Bayar Sekarang"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollAnimation>
                    )
                  })}
                </CardContent>
              </Card>
            </ScrollAnimation>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Tidak ada cicilan aktif</p>
                  <p className="text-sm">Semua cicilan sudah lunas</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedInstallments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-green-500" />
                  Cicilan Lunas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedInstallments.map((installment) => {
                  const Icon = getTypeIcon(installment.type)

                  return (
                    <div key={installment.id} className="p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center",
                            getTypeColor(installment.type),
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{installment.name}</h3>
                              <p className="text-sm text-muted-foreground">{installment.partner}</p>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Lunas
                            </Badge>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Pembayaran</span>
                            <span className="font-bold">{formatCurrency(installment.totalAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tenor</span>
                            <span>{installment.tenure} bulan</span>
                          </div>
                        </div>
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
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Belum ada cicilan lunas</p>
                  <p className="text-sm">Cicilan yang sudah lunas akan muncul di sini</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {/* Search Form */}
          <ScrollAnimation animation="fade-up" delay={200}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Cari Data Cicilan
                </CardTitle>
                <CardDescription>Masukkan informasi cicilan untuk pembayaran</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label>Jenis Cicilan</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {installmentTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={selectedType === type.id ? "default" : "outline"}
                        className={cn("h-auto flex-col gap-2 p-3", selectedType !== type.id && "bg-transparent")}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <type.icon className="h-5 w-5" />
                        <span className="text-xs">{type.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lembaga Pembiayaan</Label>
                    <Select value={partner} onValueChange={setPartner}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih lembaga" />
                      </SelectTrigger>
                      <SelectContent>
                        {financialPartners.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-10 rounded bg-muted flex items-center justify-center text-xs font-bold">
                                {p.logo}
                              </div>
                              {p.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Kontrak / Perjanjian</Label>
                    <Input
                      placeholder="Masukkan nomor kontrak"
                      value={contractNumber}
                      onChange={(e) => setContractNumber(e.target.value)}
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mencari data cicilan...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cek Data Cicilan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Search Result */}
          {selectedInstallment && (
            <ScrollAnimation animation="fade-up">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">Data Cicilan Ditemukan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nama Produk</span>
                        <span className="font-medium">{selectedInstallment.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lembaga</span>
                        <span className="font-medium">{selectedInstallment.partner}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">No. Kontrak</span>
                        <span className="font-medium">{selectedInstallment.contractNumber}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tenor</span>
                        <span className="font-medium">{selectedInstallment.tenure} bulan</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sudah Dibayar</span>
                        <span className="font-medium">{selectedInstallment.paidTenure} bulan</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Jatuh Tempo</span>
                        <span className="font-medium">
                          {new Date(selectedInstallment.nextDueDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
                    <span className="text-muted-foreground">Tagihan Bulan Ini</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedInstallment.monthlyPayment)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">Saldo Anda</span>
                    <span className="font-semibold">{formatCurrency(wallet?.balanceMain || 0)}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handlePayInstallment(selectedInstallment.id)}
                    disabled={
                      processingId === selectedInstallment.id ||
                      (wallet?.balanceMain || 0) < selectedInstallment.monthlyPayment
                    }
                  >
                    {processingId === selectedInstallment.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses pembayaran...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Bayar Cicilan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
