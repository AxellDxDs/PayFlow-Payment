"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Coins,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  QrCode,
  Gift,
} from "@/components/icons"
import { cn } from "@/lib/utils"

interface BalanceData {
  title: string
  balance: number
  icon: React.ReactNode
  gradient: string
  trend?: number
  quickActions: {
    icon: React.ElementType
    label: string
    href: string
  }[]
}

export function BalanceCards() {
  const { wallet, hasHydrated } = useAppStore()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [showBalance, setShowBalance] = React.useState(true)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [translateX, setTranslateX] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  if (!hasHydrated) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <CardContent className="p-5 sm:p-8">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const safeWallet = wallet || {
    balanceMain: 0,
    balanceMarket: 0,
    balanceSavings: 0,
    balancePoints: 0,
  }

  const balances: BalanceData[] = [
    {
      title: "Saldo Utama",
      balance: safeWallet.balanceMain,
      icon: <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
      gradient: "from-blue-600 via-blue-500 to-indigo-600",
      trend: 12.5,
      quickActions: [
        { icon: ArrowUpRight, label: "Top Up", href: "/dashboard/topup" },
        { icon: Send, label: "Transfer", href: "/dashboard/transfer" },
        { icon: QrCode, label: "QRIS", href: "/dashboard/qris" },
        { icon: ArrowDownLeft, label: "Tarik", href: "/dashboard/withdraw" },
      ],
    },
    {
      title: "Saldo Market",
      balance: safeWallet.balanceMarket,
      icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
      gradient: "from-emerald-600 via-emerald-500 to-teal-600",
      trend: 8.3,
      quickActions: [
        { icon: ArrowUpRight, label: "Deposit", href: "/dashboard/crypto" },
        { icon: TrendingUp, label: "Trade", href: "/dashboard/crypto" },
        { icon: ArrowDownLeft, label: "Withdraw", href: "/dashboard/crypto" },
      ],
    },
    {
      title: "Tabungan",
      balance: safeWallet.balanceSavings,
      icon: <PiggyBank className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
      gradient: "from-amber-600 via-amber-500 to-orange-600",
      trend: 5.2,
      quickActions: [
        { icon: ArrowUpRight, label: "Setor", href: "/dashboard/savings" },
        { icon: ArrowDownLeft, label: "Ambil", href: "/dashboard/savings" },
        { icon: TrendingUp, label: "Riwayat", href: "/dashboard/transactions" },
      ],
    },
    {
      title: "Poin Rewards",
      balance: safeWallet.balancePoints,
      icon: <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
      gradient: "from-pink-600 via-pink-500 to-rose-600",
      quickActions: [
        { icon: Gift, label: "Tukar", href: "/dashboard/exchange-points" },
        { icon: TrendingUp, label: "Riwayat", href: "/dashboard/rewards" },
        { icon: Coins, label: "Misi", href: "/dashboard/rewards" },
      ],
    },
  ]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? balances.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === balances.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - startX
    setTranslateX(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (translateX > 50) {
      handlePrev()
    } else if (translateX < -50) {
      handleNext()
    }
    setTranslateX(0)
  }

  const currentBalance = balances[currentIndex]

  return (
    <div className="relative">
      {/* Main Balance Card - Swipeable */}
      <div
        ref={containerRef}
        className="relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <Card
          className={cn(
            "relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-500 ease-out cursor-grab active:cursor-grabbing",
            currentBalance.gradient,
          )}
          style={{
            transform: isDragging ? `translateX(${translateX}px)` : "translateX(0)",
          }}
        >
          <CardContent className="p-5 sm:p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                {/* Card Type Label */}
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                    {currentBalance.title}
                  </span>
                  <div className="flex gap-1.5 ml-2">
                    {balances.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentIndex(idx)
                        }}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          idx === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60",
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Balance Amount */}
                <div className="flex items-center gap-3">
                  <p className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    {showBalance
                      ? currentBalance.title === "Poin Rewards"
                        ? `${currentBalance.balance.toLocaleString("id-ID")} Poin`
                        : formatCurrency(currentBalance.balance)
                      : currentBalance.title === "Poin Rewards"
                        ? "*** Poin"
                        : "Rp ******"}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowBalance(!showBalance)
                    }}
                  >
                    {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Trend Indicator */}
                {currentBalance.trend !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full",
                        currentBalance.trend >= 0 ? "bg-green-500/20" : "bg-red-500/20",
                      )}
                    >
                      {currentBalance.trend >= 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-green-300" />
                      ) : (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-red-300" />
                      )}
                      <span
                        className={cn("font-medium", currentBalance.trend >= 0 ? "text-green-300" : "text-red-300")}
                      >
                        {Math.abs(currentBalance.trend)}%
                      </span>
                    </div>
                    <span className="text-white/60 text-xs sm:text-sm">dari bulan lalu</span>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {currentBalance.quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto flex-col gap-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-[10px] font-medium">{action.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* Swipe Hint */}
                <p className="text-white/50 text-xs mt-2 flex items-center gap-1">
                  <ChevronLeft className="h-3 w-3" />
                  Geser untuk melihat saldo lainnya
                  <ChevronRight className="h-3 w-3" />
                </p>
              </div>

              {/* Icon */}
              <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
                {currentBalance.icon}
              </div>
            </div>
          </CardContent>

          {/* Decorative Elements */}
          <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/5" />
        </Card>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all z-10"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all z-10"
        onClick={handleNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
