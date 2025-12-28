"use client"
import Link from "next/link"
import type React from "react"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import {
  LayoutDashboard,
  Wallet,
  Bitcoin,
  UtensilsCrossed,
  Smartphone,
  Receipt,
  Gift,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
  Users,
  Bell,
  History,
  QrCode,
  CreditCard,
  ArrowUpRight,
  Send,
  ArrowDownLeft,
  Plane,
  Car,
  Shield,
  Heart,
  Home,
  Sparkles,
  Calculator,
  Camera,
  BellRing,
  Target,
  PieChart,
  LineChart,
  Repeat,
  Coins,
} from "@/components/icons"

const menuItems = [
  {
    title: "Menu Utama",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Wallet, label: "Dompet", href: "/dashboard/wallet" },
      { icon: CreditCard, label: "Kartu Saya", href: "/dashboard/cards" },
      { icon: Bitcoin, label: "Crypto", href: "/dashboard/crypto" },
      { icon: UtensilsCrossed, label: "Pesan Makanan", href: "/dashboard/food" },
    ],
  },
  {
    title: "Transaksi",
    items: [
      { icon: ArrowUpRight, label: "Top Up", href: "/dashboard/topup" },
      { icon: Send, label: "Transfer", href: "/dashboard/transfer" },
      { icon: ArrowDownLeft, label: "Tarik Dana", href: "/dashboard/withdraw" },
      { icon: Smartphone, label: "E-Wallet", href: "/dashboard/ewallet" },
      { icon: CreditCard, label: "Top Up Kartu", href: "/dashboard/topup-card" },
    ],
  },
  {
    title: "Layanan",
    items: [
      { icon: Smartphone, label: "Pulsa & Paket", href: "/dashboard/pulsa" },
      { icon: Receipt, label: "Tagihan", href: "/dashboard/bills" },
      { icon: QrCode, label: "QRIS", href: "/dashboard/qris" },
      { icon: PiggyBank, label: "Tabungan", href: "/dashboard/savings" },
      { icon: Plane, label: "Tiket Travel", href: "/dashboard/travel" },
      { icon: Car, label: "Pajak Kendaraan", href: "/dashboard/vehicle-tax" },
      { icon: Shield, label: "Asuransi", href: "/dashboard/insurance" },
      { icon: Heart, label: "Donasi", href: "/dashboard/donation" },
      { icon: Home, label: "Cicilan", href: "/dashboard/installment" },
    ],
  },
  {
    title: "Fitur Baru",
    items: [
      { icon: Users, label: "Split Bill", href: "/dashboard/split-bill", isNew: true },
      { icon: Calculator, label: "Budget Planner", href: "/dashboard/budget", isNew: true },
      { icon: Camera, label: "Scan Struk", href: "/dashboard/scan-receipt", isNew: true },
      { icon: BellRing, label: "Pengingat Tagihan", href: "/dashboard/bill-reminder", isNew: true },
      { icon: Target, label: "Target Tabungan", href: "/dashboard/money-goals", isNew: true },
      { icon: PieChart, label: "Analisis Keuangan", href: "/dashboard/analytics", isNew: true },
      { icon: LineChart, label: "Investasi", href: "/dashboard/investment", isNew: true },
      { icon: Repeat, label: "Pembayaran Terjadwal", href: "/dashboard/scheduled-payments", isNew: true },
      { icon: Coins, label: "Pencatat Pengeluaran", href: "/dashboard/expense-tracker", isNew: true },
      { icon: CreditCard, label: "Kartu Virtual", href: "/dashboard/virtual-card", isNew: true },
    ],
  },
  {
    title: "Rewards",
    items: [
      { icon: Gift, label: "Promo", href: "/dashboard/promo" },
      { icon: Trophy, label: "Rewards", href: "/dashboard/rewards" },
      { icon: Sparkles, label: "Christmas Event", href: "/dashboard/christmas", isNew: true, isChristmas: true },
      { icon: Users, label: "Referral", href: "/dashboard/referral" },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { icon: History, label: "Riwayat", href: "/dashboard/history" },
      { icon: Bell, label: "Notifikasi", href: "/dashboard/notifications" },
      { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
      { icon: HelpCircle, label: "Bantuan", href: "/dashboard/help" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, logout, user } = useAppStore()

  const handleNavClick = (e: React.MouseEvent) => {
    // Only toggle sidebar on mobile, don't stop propagation
    if (window.innerWidth < 1024) {
      toggleSidebar()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-out",
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
              <span className="text-xl font-bold text-primary-foreground">P</span>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-left-2 duration-200">
                PayFlow
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-transform hover:scale-110"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className={cn("p-4 border-b border-border", !sidebarOpen && "flex justify-center")}>
            {sidebarOpen ? (
              <div className="flex items-center gap-3 animate-in fade-in duration-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-transform hover:scale-110">
                <Users className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
          <nav className="p-4 space-y-6">
            {menuItems.map((group) => (
              <div key={group.title}>
                {sidebarOpen && (
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                    {group.title}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                    const isChristmas = "isChristmas" in item && item.isChristmas
                    const isNew = "isNew" in item && item.isNew
                    return (
                      <Link key={item.href} href={item.href} onClick={handleNavClick}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 transition-all duration-200 relative",
                            !sidebarOpen && "justify-center px-2",
                            isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                            !isActive && "hover:translate-x-1",
                            isChristmas && !isActive && "text-red-500 hover:text-red-600 hover:bg-red-500/10",
                            isChristmas && isActive && "bg-gradient-to-r from-red-500/20 to-green-500/20 text-red-500",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive && "text-primary",
                              isChristmas && "text-red-500",
                            )}
                          />
                          {sidebarOpen && (
                            <>
                              <span>{item.label}</span>
                              {isNew && (
                                <Badge className="ml-auto h-5 px-1.5 text-[10px] bg-gradient-to-r from-red-500 to-green-500 text-white border-0">
                                  NEW
                                </Badge>
                              )}
                            </>
                          )}
                          {!sidebarOpen && isNew && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
              !sidebarOpen && "justify-center px-2",
            )}
            onClick={() => {
              logout()
              window.location.href = "/"
            }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Keluar</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
