"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { Car, Bike, Search, Loader2, Check, AlertCircle, FileText, MapPin } from "@/components/icons"
import { toast } from "sonner"

const vehicleTypes = [
  { id: "car", name: "Mobil", icon: Car, color: "bg-blue-500/10 text-blue-500" },
  { id: "motorcycle", name: "Sepeda Motor", icon: Bike, color: "bg-green-500/10 text-green-500" },
]

const provinces = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Banten",
  "DIY Yogyakarta",
  "Bali",
  "Sumatera Utara",
  "Sumatera Selatan",
  "Sulawesi Selatan",
  "Kalimantan Timur",
  "Kalimantan Selatan",
]

// Mock vehicle data
const mockVehicleData = {
  plateNumber: "B 1234 ABC",
  vehicleType: "Mobil",
  brand: "Toyota",
  model: "Avanza 1.5 G MT",
  year: 2020,
  color: "Hitam",
  ownerName: "Ahmad Santoso",
  taxAmount: 2850000,
  stnkFee: 200000,
  swdkllj: 143000,
  adminFee: 50000,
  dueDate: new Date("2025-02-15"),
  status: "active",
}

export default function VehicleTaxPage() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [vehicleType, setVehicleType] = React.useState("car")
  const [plateNumber, setPlateNumber] = React.useState("")
  const [province, setProvince] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [vehicleData, setVehicleData] = React.useState<typeof mockVehicleData | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSearch = async () => {
    if (!plateNumber || !province) {
      toast.error("Masukkan nomor polisi dan pilih provinsi")
      return
    }

    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setVehicleData({ ...mockVehicleData, plateNumber: plateNumber.toUpperCase() })
    setIsSearching(false)
  }

  const handlePayTax = async () => {
    if (!vehicleData || !wallet) return

    const totalAmount = vehicleData.taxAmount + vehicleData.stnkFee + vehicleData.swdkllj + vehicleData.adminFee
    if (totalAmount > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain - totalAmount })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "payment",
      amount: -totalAmount,
      fee: vehicleData.adminFee,
      status: "success",
      description: `Pajak Kendaraan - ${vehicleData.plateNumber}`,
      createdAt: new Date(),
    })

    toast.success("Pembayaran pajak berhasil!")
    setIsProcessing(false)
    setVehicleData(null)
    setPlateNumber("")
    setProvince("")
  }

  const totalAmount = vehicleData
    ? vehicleData.taxAmount + vehicleData.stnkFee + vehicleData.swdkllj + vehicleData.adminFee
    : 0

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Pajak Kendaraan</h1>
          <p className="text-muted-foreground">Bayar pajak kendaraan bermotor (PKB) dengan mudah</p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fade-up" delay={100}>
        <Tabs value={vehicleType} onValueChange={setVehicleType}>
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            {vehicleTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="gap-2">
                <type.icon className="h-4 w-4" />
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </ScrollAnimation>

      {/* Search Form */}
      <ScrollAnimation animation="fade-up" delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Cari Data Kendaraan
            </CardTitle>
            <CardDescription>Masukkan nomor polisi dan pilih provinsi kendaraan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nomor Polisi</Label>
                <Input
                  placeholder="Contoh: B 1234 ABC"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>Provinsi</Label>
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {prov}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mencari data kendaraan...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Cek Data Kendaraan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Vehicle Data Result */}
      {vehicleData && (
        <ScrollAnimation animation="fade-up" delay={100}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Data Kendaraan Ditemukan
                </CardTitle>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  {vehicleData.status === "active" ? "STNK Aktif" : "STNK Mati"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nomor Polisi</span>
                    <span className="font-bold">{vehicleData.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Merk/Type</span>
                    <span className="font-medium">
                      {vehicleData.brand} {vehicleData.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tahun</span>
                    <span className="font-medium">{vehicleData.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warna</span>
                    <span className="font-medium">{vehicleData.color}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama Pemilik</span>
                    <span className="font-medium">{vehicleData.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis Kendaraan</span>
                    <span className="font-medium">{vehicleData.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jatuh Tempo</span>
                    <span className="font-medium text-warning">
                      {vehicleData.dueDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <h3 className="font-semibold">Rincian Pembayaran</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PKB (Pajak Kendaraan Bermotor)</span>
                    <span>{formatCurrency(vehicleData.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SWDKLLJ (Sumbangan Wajib)</span>
                    <span>{formatCurrency(vehicleData.swdkllj)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Pengesahan STNK</span>
                    <span>{formatCurrency(vehicleData.stnkFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span>{formatCurrency(vehicleData.adminFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t border-border">
                    <span>Total Pembayaran</span>
                    <span className="text-xl text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Balance Info */}
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Saldo Anda</span>
                <span className="font-semibold">{formatCurrency(wallet?.balanceMain || 0)}</span>
              </div>

              {/* Pay Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayTax}
                disabled={isProcessing || (wallet?.balanceMain || 0) < totalAmount}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses pembayaran...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Bayar Pajak Sekarang
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </ScrollAnimation>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScrollAnimation animation="fade-left" delay={300}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Dokumen Digital</h3>
                  <p className="text-sm text-muted-foreground">
                    Bukti pembayaran digital yang sah dan dapat digunakan untuk perpanjangan STNK
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-right" delay={300}>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ingat Jatuh Tempo</h3>
                  <p className="text-sm text-muted-foreground">
                    Hindari denda dengan membayar pajak sebelum tanggal jatuh tempo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  )
}
