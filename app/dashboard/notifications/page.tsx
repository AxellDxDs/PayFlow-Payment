"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { formatRelativeTime } from "@/lib/utils/format"
import {
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  Trash2,
  Settings,
  Gift,
  CreditCard,
  Shield,
  TrendingUp,
  AlertTriangle,
  Info,
  Wallet,
  Clock,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const notificationCategories = [
  { id: "all", label: "Semua", icon: Bell },
  { id: "transaction", label: "Transaksi", icon: CreditCard },
  { id: "promo", label: "Promo", icon: Gift },
  { id: "security", label: "Keamanan", icon: Shield },
  { id: "info", label: "Info", icon: Info },
]

const mockNotifications = [
  {
    id: "1",
    title: "Transaksi Berhasil",
    message: "Pembayaran PLN sebesar Rp 350.000 berhasil diproses. Token: 1234-5678-9012-3456",
    type: "transaction",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    icon: CheckCircle2,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
  },
  {
    id: "2",
    title: "Flash Sale! Cashback 50%",
    message: "Dapatkan cashback hingga 50% untuk semua pembayaran tagihan. Berlaku hari ini saja!",
    type: "promo",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    icon: Gift,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    id: "3",
    title: "Login Baru Terdeteksi",
    message: "Akun Anda login dari perangkat baru di Jakarta. Jika bukan Anda, segera hubungi kami.",
    type: "security",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    icon: Shield,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  {
    id: "4",
    title: "Top Up Berhasil",
    message: "Saldo Anda telah ditambah sebesar Rp 500.000 melalui transfer bank BCA.",
    type: "transaction",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    icon: Wallet,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: "5",
    title: "Crypto Alert: BTC Naik 5%",
    message: "Bitcoin naik 5% dalam 24 jam terakhir. Cek portofolio crypto Anda sekarang!",
    type: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    icon: TrendingUp,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
  },
  {
    id: "6",
    title: "Tagihan Jatuh Tempo",
    message: "Tagihan internet Anda akan jatuh tempo dalam 3 hari. Bayar sekarang untuk menghindari denda.",
    type: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
  },
  {
    id: "7",
    title: "Referral Berhasil",
    message: "Selamat! Teman Anda Andi Pratama sudah terverifikasi. Bonus Rp 25.000 sudah masuk ke saldo Anda.",
    type: "promo",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    icon: Gift,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications)
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [showSettings, setShowSettings] = React.useState(false)

  const filteredNotifications =
    selectedCategory === "all" ? notifications : notifications.filter((n) => n.type === selectedCategory)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleDeleteAll = () => {
    setNotifications([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifikasi</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pengaturan Notifikasi</CardTitle>
            <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Push</Label>
                <p className="text-xs text-muted-foreground">Terima notifikasi di perangkat Anda</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Email</Label>
                <p className="text-xs text-muted-foreground">Terima update penting via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Promo</Label>
                <p className="text-xs text-muted-foreground">Dapatkan info promo dan penawaran</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi Transaksi</Label>
                <p className="text-xs text-muted-foreground">Update status setiap transaksi</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alert Keamanan</Label>
                <p className="text-xs text-muted-foreground">Peringatan aktivitas mencurigakan</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {notificationCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
              <cat.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{cat.label}</span>
              {cat.id === "all" && unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    !notification.isRead && "border-primary/50 bg-primary/5",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn("h-10 w-10 rounded-full flex items-center justify-center", notification.iconBg)}
                      >
                        <notification.icon className={cn("h-5 w-5", notification.iconColor)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{notification.title}</h4>
                              {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatRelativeTime(notification.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {notifications.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive bg-transparent"
                    onClick={handleDeleteAll}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Semua Notifikasi
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BellOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Tidak Ada Notifikasi</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === "all"
                    ? "Anda tidak memiliki notifikasi saat ini"
                    : `Tidak ada notifikasi ${notificationCategories.find((c) => c.id === selectedCategory)?.label.toLowerCase()}`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
