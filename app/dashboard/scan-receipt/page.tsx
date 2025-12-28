"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Camera,
  Upload,
  Receipt,
  Check,
  Loader2,
  ShoppingCart,
  Calendar,
  Store,
  Plus,
  History,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ScannedReceipt {
  id: string
  storeName: string
  date: Date
  items: { name: string; price: number; quantity: number }[]
  total: number
  category: string
  imageUrl?: string
}

export default function ScanReceiptPage() {
  const { addPoints, addTransaction, user } = useAppStore()
  const [isScanning, setIsScanning] = React.useState(false)
  const [scannedReceipt, setScannedReceipt] = React.useState<ScannedReceipt | null>(null)
  const [receipts, setReceipts] = React.useState<ScannedReceipt[]>([
    {
      id: "r1",
      storeName: "Indomaret",
      date: new Date("2024-12-27"),
      items: [
        { name: "Aqua 600ml", price: 4000, quantity: 2 },
        { name: "Indomie Goreng", price: 3500, quantity: 5 },
        { name: "Roti Tawar", price: 15000, quantity: 1 },
      ],
      total: 40500,
      category: "belanja",
    },
    {
      id: "r2",
      storeName: "McDonald's",
      date: new Date("2024-12-26"),
      items: [
        { name: "Big Mac Meal", price: 65000, quantity: 1 },
        { name: "McFlurry Oreo", price: 18000, quantity: 2 },
      ],
      total: 101000,
      category: "makanan",
    },
  ])
  const [manualEntry, setManualEntry] = React.useState({
    storeName: "",
    total: "",
    category: "belanja",
  })

  const handleScanReceipt = async () => {
    setIsScanning(true)

    // Simulate scanning process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockScannedReceipt: ScannedReceipt = {
      id: `r-${Date.now()}`,
      storeName: "Alfamart",
      date: new Date(),
      items: [
        { name: "Teh Botol Sosro", price: 5000, quantity: 3 },
        { name: "Chitato", price: 12000, quantity: 2 },
        { name: "Good Day Cappuccino", price: 8000, quantity: 2 },
      ],
      total: 55000,
      category: "belanja",
    }

    setScannedReceipt(mockScannedReceipt)
    setIsScanning(false)
    toast.success("Struk berhasil di-scan!")
  }

  const handleSaveReceipt = () => {
    if (!scannedReceipt) return

    setReceipts([scannedReceipt, ...receipts])
    addPoints(30)
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: user?.id || "",
      type: "payment",
      amount: -scannedReceipt.total,
      fee: 0,
      status: "success",
      description: `Pembelian di ${scannedReceipt.storeName}`,
      createdAt: new Date(),
    })

    toast.success("Struk disimpan! +30 poin")
    setScannedReceipt(null)
  }

  const handleManualEntry = () => {
    if (!manualEntry.storeName || !manualEntry.total) {
      toast.error("Lengkapi semua data")
      return
    }

    const newReceipt: ScannedReceipt = {
      id: `r-${Date.now()}`,
      storeName: manualEntry.storeName,
      date: new Date(),
      items: [],
      total: Number.parseFloat(manualEntry.total),
      category: manualEntry.category,
    }

    setReceipts([newReceipt, ...receipts])
    addPoints(15)
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: user?.id || "",
      type: "payment",
      amount: -newReceipt.total,
      fee: 0,
      status: "success",
      description: `Pembelian di ${newReceipt.storeName}`,
      createdAt: new Date(),
    })

    toast.success("Pengeluaran dicatat! +15 poin")
    setManualEntry({ storeName: "", total: "", category: "belanja" })
  }

  const totalThisMonth = receipts
    .filter((r) => new Date(r.date).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + r.total, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Scan Struk</h1>
        <p className="text-muted-foreground">Catat pengeluaran dengan scan struk belanja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scan Struk Belanja
              </CardTitle>
              <CardDescription>Arahkan kamera ke struk untuk membaca otomatis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                  isScanning ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                )}
              >
                {isScanning ? (
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                    <div>
                      <p className="font-medium">Memindai struk...</p>
                      <p className="text-sm text-muted-foreground">Harap tunggu sebentar</p>
                    </div>
                  </div>
                ) : scannedReceipt ? (
                  <div className="space-y-4">
                    <Check className="h-12 w-12 mx-auto text-green-500" />
                    <div>
                      <p className="font-medium">Struk Terdeteksi!</p>
                      <p className="text-sm text-muted-foreground">{scannedReceipt.storeName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Belum ada struk</p>
                      <p className="text-sm text-muted-foreground">Klik tombol di bawah untuk scan</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleScanReceipt} disabled={isScanning}>
                  <Camera className="h-4 w-4 mr-2" />
                  {isScanning ? "Memindai..." : "Scan Struk"}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" disabled={isScanning}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Foto
                </Button>
              </div>

              {/* Scanned Receipt Preview */}
              {scannedReceipt && (
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{scannedReceipt.storeName}</span>
                    </div>
                    <Badge variant="secondary">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(scannedReceipt.date).toLocaleDateString("id-ID")}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {scannedReceipt.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(scannedReceipt.total)}</span>
                  </div>

                  <Button className="w-full" onClick={handleSaveReceipt}>
                    <Check className="h-4 w-4 mr-2" />
                    Simpan Struk
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Input Manual
              </CardTitle>
              <CardDescription>Catat pengeluaran secara manual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Toko</Label>
                <Input
                  placeholder="Contoh: Indomaret, Alfamart"
                  value={manualEntry.storeName}
                  onChange={(e) => setManualEntry({ ...manualEntry, storeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Belanja</Label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={manualEntry.total}
                  onChange={(e) => setManualEntry({ ...manualEntry, total: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleManualEntry}>
                Simpan Pengeluaran
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Riwayat Struk
                </CardTitle>
                <Badge variant="secondary">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {formatCurrency(totalThisMonth)} bulan ini
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {receipts.length > 0 ? (
                receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{receipt.storeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(receipt.date).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(receipt.total)}</p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {receipt.category}
                        </Badge>
                      </div>
                    </div>
                    {receipt.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                        {receipt.items.slice(0, 3).map((item, idx) => (
                          <span key={idx}>
                            {item.name}
                            {idx < Math.min(receipt.items.length - 1, 2) ? ", " : ""}
                          </span>
                        ))}
                        {receipt.items.length > 3 && ` +${receipt.items.length - 3} lainnya`}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Belum ada struk</p>
                  <p className="text-sm">Scan struk pertama Anda!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
