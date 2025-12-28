"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Bell,
  Plus,
  Calendar,
  Zap,
  Droplets,
  Wifi,
  CreditCard,
  Trash2,
  Clock,
  CheckCircle2,
  BellRing,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface BillReminder {
  id: string
  name: string
  type: string
  amount: number
  dueDay: number
  reminderDays: number
  isActive: boolean
  lastPaid?: Date
}

const billTypes = [
  { id: "listrik", name: "Listrik PLN", icon: Zap, color: "text-yellow-500 bg-yellow-500/10" },
  { id: "air", name: "PDAM", icon: Droplets, color: "text-cyan-500 bg-cyan-500/10" },
  { id: "internet", name: "Internet", icon: Wifi, color: "text-blue-500 bg-blue-500/10" },
  { id: "kartu-kredit", name: "Kartu Kredit", icon: CreditCard, color: "text-red-500 bg-red-500/10" },
]

export default function BillReminderPage() {
  const { addPoints } = useAppStore()
  const [reminders, setReminders] = React.useState<BillReminder[]>([
    { id: "1", name: "Listrik PLN", type: "listrik", amount: 400000, dueDay: 20, reminderDays: 3, isActive: true },
    { id: "2", name: "PDAM Jakarta", type: "air", amount: 150000, dueDay: 15, reminderDays: 5, isActive: true },
    { id: "3", name: "IndiHome", type: "internet", amount: 450000, dueDay: 25, reminderDays: 3, isActive: true },
    {
      id: "4",
      name: "BCA Credit Card",
      type: "kartu-kredit",
      amount: 2500000,
      dueDay: 10,
      reminderDays: 7,
      isActive: false,
    },
  ])
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [editingReminder, setEditingReminder] = React.useState<BillReminder | null>(null)
  const [newReminder, setNewReminder] = React.useState({
    name: "",
    type: "",
    amount: "",
    dueDay: "20",
    reminderDays: "3",
  })

  const today = new Date().getDate()

  const getUpcomingReminders = () => {
    return reminders
      .filter((r) => r.isActive)
      .map((r) => {
        const daysUntilDue = r.dueDay >= today ? r.dueDay - today : 30 - today + r.dueDay
        return { ...r, daysUntilDue }
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
  }

  const upcomingReminders = getUpcomingReminders()

  const handleAddReminder = () => {
    if (!newReminder.name || !newReminder.type || !newReminder.amount) {
      toast.error("Lengkapi semua data")
      return
    }

    const reminder: BillReminder = {
      id: `rem-${Date.now()}`,
      name: newReminder.name,
      type: newReminder.type,
      amount: Number.parseFloat(newReminder.amount),
      dueDay: Number.parseInt(newReminder.dueDay),
      reminderDays: Number.parseInt(newReminder.reminderDays),
      isActive: true,
    }

    setReminders([...reminders, reminder])
    addPoints(20)
    toast.success("Pengingat ditambahkan! +20 poin")
    setShowAddDialog(false)
    setNewReminder({ name: "", type: "", amount: "", dueDay: "20", reminderDays: "3" })
  }

  const handleToggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
  }

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
    toast.success("Pengingat dihapus")
  }

  const getTypeConfig = (type: string) => {
    return billTypes.find((t) => t.id === type) || { icon: Bell, color: "text-gray-500 bg-gray-500/10" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengingat Tagihan</h1>
          <p className="text-muted-foreground">Atur pengingat agar tidak telat bayar</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengingat
        </Button>
      </div>

      {/* Upcoming Bills */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BellRing className="h-5 w-5 text-amber-500" />
            Tagihan Segera Jatuh Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingReminders.filter((r) => r.daysUntilDue <= 7).length > 0 ? (
            <div className="space-y-3">
              {upcomingReminders
                .filter((r) => r.daysUntilDue <= 7)
                .map((reminder) => {
                  const typeConfig = getTypeConfig(reminder.type)
                  const Icon = typeConfig.icon

                  return (
                    <div
                      key={reminder.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border",
                        reminder.daysUntilDue <= 3
                          ? "bg-red-500/5 border-red-500/30"
                          : "bg-amber-500/5 border-amber-500/30",
                      )}
                    >
                      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", typeConfig.color)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{reminder.name}</p>
                        <p className="text-sm text-muted-foreground">Jatuh tempo tanggal {reminder.dueDay}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(reminder.amount)}</p>
                        <Badge variant={reminder.daysUntilDue <= 3 ? "destructive" : "secondary"}>
                          {reminder.daysUntilDue === 0 ? "Hari ini!" : `${reminder.daysUntilDue} hari lagi`}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Tidak ada tagihan yang segera jatuh tempo</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Semua Pengingat
          </CardTitle>
          <CardDescription>Kelola pengingat tagihan bulanan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((reminder) => {
            const typeConfig = getTypeConfig(reminder.type)
            const Icon = typeConfig.icon

            return (
              <div
                key={reminder.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                  reminder.isActive ? "bg-card" : "bg-muted/30 opacity-60",
                )}
              >
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", typeConfig.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{reminder.name}</p>
                    {!reminder.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Nonaktif
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Tanggal {reminder.dueDay}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Ingatkan {reminder.reminderDays} hari sebelum
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(reminder.amount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={reminder.isActive} onCheckedChange={() => handleToggleReminder(reminder.id)} />
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Add Reminder Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pengingat Tagihan</DialogTitle>
            <DialogDescription>Atur pengingat agar tidak lupa bayar tagihan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Jenis Tagihan</Label>
              <Select value={newReminder.type} onValueChange={(v) => setNewReminder({ ...newReminder, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {billTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Tagihan</Label>
              <Input
                placeholder="Contoh: Listrik Rumah"
                value={newReminder.name}
                onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Perkiraan Tagihan</Label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={newReminder.amount}
                onChange={(e) => setNewReminder({ ...newReminder, amount: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Jatuh Tempo</Label>
                <Select value={newReminder.dueDay} onValueChange={(v) => setNewReminder({ ...newReminder, dueDay: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        Tanggal {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ingatkan Sebelum</Label>
                <Select
                  value={newReminder.reminderDays}
                  onValueChange={(v) => setNewReminder({ ...newReminder, reminderDays: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 3, 5, 7].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} hari sebelum
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleAddReminder}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
