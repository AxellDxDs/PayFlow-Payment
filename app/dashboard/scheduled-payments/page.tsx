"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Clock,
  Plus,
  Trash2,
  Repeat,
  Zap,
  Droplets,
  Wifi,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  Loader2,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ScheduledPayment {
  id: string
  name: string
  type: "pln" | "pdam" | "internet" | "cc" | "bpjs" | "pulsa"
  amount: number
  frequency: "weekly" | "monthly" | "yearly"
  nextDate: Date
  accountNumber: string
  isActive: boolean
  icon: React.ElementType
}

const scheduledPayments: ScheduledPayment[] = [
  {
    id: "1",
    name: "Token Listrik Rumah",
    type: "pln",
    amount: 500000,
    frequency: "monthly",
    nextDate: new Date(2025, 0, 5),
    accountNumber: "532100001234",
    isActive: true,
    icon: Zap,
  },
  {
    id: "2",
    name: "Tagihan Air PDAM",
    type: "pdam",
    amount: 150000,
    frequency: "monthly",
    nextDate: new Date(2025, 0, 10),
    accountNumber: "PAM-123456",
    isActive: true,
    icon: Droplets,
  },
  {
    id: "3",
    name: "Internet IndiHome",
    type: "internet",
    amount: 450000,
    frequency: "monthly",
    nextDate: new Date(2025, 0, 15),
    accountNumber: "122001234567",
    isActive: true,
    icon: Wifi,
  },
  {
    id: "4",
    name: "Kartu Kredit BCA",
    type: "cc",
    amount: 2500000,
    frequency: "monthly",
    nextDate: new Date(2025, 0, 20),
    accountNumber: "4532-XXXX-XXXX-1234",
    isActive: false,
    icon: CreditCard,
  },
  {
    id: "5",
    name: "BPJS Kesehatan",
    type: "bpjs",
    amount: 320000,
    frequency: "monthly",
    nextDate: new Date(2025, 0, 1),
    accountNumber: "0001234567890",
    isActive: true,
    icon: Building2,
  },
]

const paymentTypes = [
  { value: "pln", label: "PLN", icon: Zap },
  { value: "pdam", label: "PDAM", icon: Droplets },
  { value: "internet", label: "Internet", icon: Wifi },
  { value: "cc", label: "Kartu Kredit", icon: CreditCard },
  { value: "bpjs", label: "BPJS", icon: Building2 },
  { value: "pulsa", label: "Pulsa", icon: Smartphone },
]

export default function ScheduledPaymentsPage() {
  const { user } = useAppStore()
  const [payments, setPayments] = React.useState(scheduledPayments)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [editingPayment, setEditingPayment] = React.useState<ScheduledPayment | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const [formData, setFormData] = React.useState({
    name: "",
    type: "pln",
    amount: "",
    frequency: "monthly",
    accountNumber: "",
    nextDate: "",
  })

  const handleToggleActive = (id: string) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
    toast.success("Status pembayaran berhasil diubah")
  }

  const handleDelete = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id))
    toast.success("Pembayaran terjadwal berhasil dihapus")
  }

  const handleSave = async () => {
    if (!formData.name || !formData.amount || !formData.accountNumber) {
      toast.error("Mohon lengkapi semua data")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const typeInfo = paymentTypes.find((t) => t.value === formData.type)
    const newPayment: ScheduledPayment = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as ScheduledPayment["type"],
      amount: Number(formData.amount),
      frequency: formData.frequency as ScheduledPayment["frequency"],
      nextDate: formData.nextDate ? new Date(formData.nextDate) : new Date(),
      accountNumber: formData.accountNumber,
      isActive: true,
      icon: typeInfo?.icon || Zap,
    }

    setPayments((prev) => [...prev, newPayment])
    setIsProcessing(false)
    setShowAddDialog(false)
    setFormData({
      name: "",
      type: "pln",
      amount: "",
      frequency: "monthly",
      accountNumber: "",
      nextDate: "",
    })
    toast.success("Pembayaran terjadwal berhasil ditambahkan")
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return "Mingguan"
      case "monthly":
        return "Bulanan"
      case "yearly":
        return "Tahunan"
      default:
        return frequency
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const totalMonthly = payments.filter((p) => p.isActive).reduce((sum, p) => sum + p.amount, 0)

  const activeCount = payments.filter((p) => p.isActive).length
  const upcomingPayments = payments
    .filter((p) => p.isActive)
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pembayaran Terjadwal</h1>
          <p className="text-muted-foreground">Kelola pembayaran otomatis Anda</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Jadwal
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bulanan</p>
                <p className="text-2xl font-bold">{formatCurrency(totalMonthly)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Repeat className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jadwal Aktif</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Akan Datang</p>
                <p className="text-2xl font-bold">{upcomingPayments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Pembayaran Mendatang</CardTitle>
          <CardDescription>3 pembayaran yang akan diproses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div
                key={payment.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg",
                  index === 0 ? "bg-primary/5 border border-primary/20" : "bg-secondary/50",
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    index === 0 ? "bg-primary/10" : "bg-secondary",
                  )}
                >
                  <payment.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(payment.nextDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                  {index === 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      Terdekat
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Scheduled Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Pembayaran Terjadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                  payment.isActive ? "bg-card" : "bg-secondary/30 opacity-60",
                )}
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center",
                    payment.type === "pln"
                      ? "bg-yellow-500/10"
                      : payment.type === "pdam"
                        ? "bg-blue-500/10"
                        : payment.type === "internet"
                          ? "bg-cyan-500/10"
                          : payment.type === "cc"
                            ? "bg-red-500/10"
                            : "bg-green-500/10",
                  )}
                >
                  <payment.icon
                    className={cn(
                      "h-6 w-6",
                      payment.type === "pln"
                        ? "text-yellow-500"
                        : payment.type === "pdam"
                          ? "text-blue-500"
                          : payment.type === "internet"
                            ? "text-cyan-500"
                            : payment.type === "cc"
                              ? "text-red-500"
                              : "text-green-500",
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{payment.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getFrequencyLabel(payment.frequency)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{payment.accountNumber}</p>
                  <p className="text-xs text-muted-foreground mt-1">Berikutnya: {formatDate(payment.nextDate)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={payment.isActive} onCheckedChange={() => handleToggleActive(payment.id)} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pembayaran Terjadwal</DialogTitle>
            <DialogDescription>Atur pembayaran otomatis untuk tagihan Anda</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nama Pembayaran</Label>
              <Input
                placeholder="contoh: Token Listrik Rumah"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Jenis Tagihan</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Frekuensi</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Nomor Pelanggan / ID</Label>
              <Input
                placeholder="Masukkan nomor pelanggan"
                value={formData.accountNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
              />
            </div>

            <div>
              <Label>Jumlah Pembayaran</Label>
              <Input
                type="number"
                placeholder="Rp 0"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div>
              <Label>Tanggal Pembayaran Pertama</Label>
              <Input
                type="date"
                value={formData.nextDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, nextDate: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
