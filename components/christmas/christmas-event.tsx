"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Gift,
  Sparkles,
  X,
  ChevronRight,
  Star,
  Trophy,
  Ticket,
  Clock,
  Percent,
  Zap,
  Crown,
  PartyPopper,
  Calendar,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Snowflake SVG Component
const Snowflake = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path
      d="M12 0L12 24M0 12L24 12M3.5 3.5L20.5 20.5M20.5 3.5L3.5 20.5M12 2L10 5L12 8L14 5L12 2M12 16L10 19L12 22L14 19L12 16M2 12L5 10L8 12L5 14L2 12M16 12L19 10L22 12L19 14L16 12"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
    />
  </svg>
)

// Christmas Tree SVG
const ChristmasTree = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4L44 20H38L48 34H40L52 52H12L24 34H16L26 20H20L32 4Z" fill="currentColor" className="text-green-500" />
    <rect x="28" y="52" width="8" height="8" fill="#8B4513" />
    <circle cx="32" cy="16" r="2" fill="#FFD700" />
    <circle cx="28" cy="26" r="2" fill="#FF0000" />
    <circle cx="36" cy="24" r="2" fill="#00BFFF" />
    <circle cx="24" cy="38" r="2" fill="#FF69B4" />
    <circle cx="40" cy="36" r="2" fill="#FFD700" />
    <circle cx="32" cy="44" r="2" fill="#FF0000" />
    <polygon points="32,0 34,6 32,4 30,6" fill="#FFD700" />
  </svg>
)

// Santa Hat SVG
const SantaHat = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 48C8 48 16 16 48 12C48 12 56 8 58 16C60 24 52 24 52 24L8 48Z" fill="#DC2626" />
    <ellipse cx="56" cy="16" rx="6" ry="6" fill="white" />
    <path d="M4 48C4 52 8 56 32 56C56 56 60 52 60 48C60 44 56 40 32 40C8 40 4 44 4 48Z" fill="white" />
  </svg>
)

interface ChristmasPromo {
  id: string
  title: string
  description: string
  discount: string
  code: string
  validUntil: Date
  category: string
  icon: React.ElementType
  color: string
  gradient: string
}

const christmasPromos: ChristmasPromo[] = [
  {
    id: "xmas-1",
    title: "Cashback Natal 50%",
    description: "Dapatkan cashback hingga 50% untuk semua transaksi top up saldo",
    discount: "50%",
    code: "NATAL50",
    validUntil: new Date("2025-12-31"),
    category: "topup",
    icon: Percent,
    color: "text-red-500",
    gradient: "from-red-500 to-red-600",
  },
  {
    id: "xmas-2",
    title: "Double Points",
    description: "Kumpulkan 2x poin rewards untuk setiap transaksi",
    discount: "2X",
    code: "XMASPOINT",
    validUntil: new Date("2025-12-31"),
    category: "rewards",
    icon: Star,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    id: "xmas-3",
    title: "Gratis Ongkir",
    description: "Nikmati gratis ongkir untuk semua pesanan makanan",
    discount: "FREE",
    code: "SANTAFOOD",
    validUntil: new Date("2025-12-25"),
    category: "food",
    icon: Gift,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "xmas-4",
    title: "Voucher Rp100K",
    description: "Dapatkan voucher belanja Rp100.000 dengan minimal transaksi Rp500.000",
    discount: "100K",
    code: "GIFT100K",
    validUntil: new Date("2026-01-01"),
    category: "voucher",
    icon: Ticket,
    color: "text-purple-500",
    gradient: "from-purple-500 to-violet-500",
  },
]

const newYear2026Promos: ChristmasPromo[] = [
  {
    id: "ny2026-1",
    title: "New Year Cashback 75%",
    description: "Spesial Tahun Baru 2026! Cashback hingga 75% untuk semua transaksi",
    discount: "75%",
    code: "NEWYEAR2026",
    validUntil: new Date("2026-01-31"),
    category: "topup",
    icon: PartyPopper,
    color: "text-amber-500",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "ny2026-2",
    title: "Triple Points 2026",
    description: "Kumpulkan 3x poin rewards selama Januari 2026",
    discount: "3X",
    code: "TRIPLE2026",
    validUntil: new Date("2026-01-31"),
    category: "rewards",
    icon: Crown,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "ny2026-3",
    title: "Voucher Rp200K",
    description: "Dapatkan voucher belanja Rp200.000 untuk transaksi pertama di 2026",
    discount: "200K",
    code: "FIRST2026",
    validUntil: new Date("2026-01-15"),
    category: "voucher",
    icon: Gift,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
  },
]

interface ChristmasMission {
  id: string
  title: string
  description: string
  progress: number
  target: number
  reward: string
  icon: React.ElementType
  completed: boolean
}

const christmasMissions: ChristmasMission[] = [
  {
    id: "mission-1",
    title: "Transaksi Pertama",
    description: "Lakukan transaksi pertama di bulan Desember",
    progress: 1,
    target: 1,
    reward: "50 Poin",
    icon: Zap,
    completed: true,
  },
  {
    id: "mission-2",
    title: "Kumpulkan Bintang",
    description: "Kumpulkan 5 bintang dari transaksi",
    progress: 3,
    target: 5,
    reward: "100 Poin",
    icon: Star,
    completed: false,
  },
  {
    id: "mission-3",
    title: "Ajak Teman",
    description: "Ajak 3 teman bergabung dengan PayFlow",
    progress: 1,
    target: 3,
    reward: "Voucher 50K",
    icon: Gift,
    completed: false,
  },
  {
    id: "mission-4",
    title: "Belanja Natal",
    description: "Belanja minimal Rp500.000",
    progress: 250000,
    target: 500000,
    reward: "Voucher 100K",
    icon: Trophy,
    completed: false,
  },
]

interface ChristmasEventProps {
  variant?: "banner" | "full" | "compact" | "mini"
  onClose?: () => void
  showMissions?: boolean
  showPromos?: boolean
  showCountdown?: boolean
}

export function ChristmasEvent({
  variant = "full",
  onClose,
  showMissions = true,
  showPromos = true,
  showCountdown = true,
}: ChristmasEventProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [selectedPromo, setSelectedPromo] = React.useState<ChristmasPromo | null>(null)
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"christmas" | "newyear">("christmas")

  const [countdown, setCountdown] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  React.useEffect(() => {
    const calculateCountdown = () => {
      const christmas = new Date("2025-12-25T00:00:00")
      const now = new Date()
      const diff = christmas.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setCountdown({ days, hours, minutes, seconds })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  // Mini variant - just a floating button
  if (variant === "mini") {
    return (
      <Link href="/dashboard/christmas">
        <Button
          className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-green-600 shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-bounce"
          size="icon"
        >
          <Gift className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900">
            !
          </span>
        </Button>
      </Link>
    )
  }

  // Compact variant - small notification bar
  if (variant === "compact") {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <Gift className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Promo Natal & Tahun Baru 2025-2026!</span>
                <span className="text-white/80 text-xs hidden sm:inline">Cashback hingga 75%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/christmas">
                <Button size="sm" variant="secondary" className="h-7 text-xs">
                  Lihat <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {/* Animated snowflakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <Snowflake
              key={i}
              className="absolute text-white/20"
              style={{
                left: `${10 + i * 12}%`,
                top: "-10px",
                animation: `fall ${4 + Math.random() * 3}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                fontSize: `${8 + Math.random() * 6}px`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Banner variant - Updated to 2025
  if (variant === "banner") {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-600 via-red-500 to-green-600">
        <CardContent className="p-6 sm:p-8">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/20 z-10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Left - Decoration */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
                <ChristmasTree className="h-16 w-16" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
              </div>
            </div>

            {/* Center - Content */}
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-3 bg-yellow-500 text-yellow-950 hover:bg-yellow-400">
                <Sparkles className="h-3 w-3 mr-1" />
                Christmas Event 2025
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Merry Christmas & Happy New Year 2026!</h3>
              <p className="text-white/90 mb-4 max-w-md">
                Rayakan Natal 2025 bersama PayFlow! Dapatkan cashback hingga 75%, voucher gratis, dan kesempatan menang
                hadiah spesial senilai Rp100 Juta!
              </p>

              {/* Countdown */}
              {showCountdown && (
                <div className="flex gap-2 mb-4 justify-center md:justify-start">
                  {[
                    { value: countdown.days, label: "Hari" },
                    { value: countdown.hours, label: "Jam" },
                    { value: countdown.minutes, label: "Menit" },
                    { value: countdown.seconds, label: "Detik" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 text-center min-w-[60px]">
                      <p className="text-xl font-bold text-white">{String(item.value).padStart(2, "0")}</p>
                      <p className="text-[10px] text-white/80">{item.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/dashboard/christmas">
                  <Button variant="secondary" size="lg" className="font-semibold">
                    <Gift className="h-5 w-5 mr-2" />
                    Lihat Semua Promo
                  </Button>
                </Link>
                <Link href="/dashboard/rewards">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Tukar Hadiah
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="hidden lg:grid grid-cols-1 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">75%</p>
                <p className="text-xs text-white/80">Cashback</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">3x</p>
                <p className="text-xs text-white/80">Poin Rewards</p>
              </div>
            </div>
          </div>

          {/* Snowflakes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <Snowflake
                key={i}
                className="absolute text-white/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-20px",
                  animation: `fall ${5 + Math.random() * 5}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${10 + Math.random() * 14}px`,
                }}
              />
            ))}
          </div>

          {/* Decorative blurs */}
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/20 blur-2xl" />
        </CardContent>
      </Card>
    )
  }

  // Full variant - Complete event page section with tabs for 2025 and 2026
  const currentPromos = activeTab === "christmas" ? christmasPromos : newYear2026Promos

  return (
    <div className="space-y-6">
      {/* Main Banner */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-600 via-red-500 to-green-600">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-yellow-500 text-yellow-950 hover:bg-yellow-400 text-sm">
                <PartyPopper className="h-4 w-4 mr-1" />
                Christmas & New Year Event 2025-2026
              </Badge>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Selamat Natal 2025 &<br />
                Tahun Baru 2026!
              </h2>

              <p className="text-white/90 text-lg mb-6 max-w-lg mx-auto lg:mx-0">
                Rayakan momen spesial bersama PayFlow dengan berbagai promo menarik, hadiah spektakuler, dan kesempatan
                menang Grand Prize!
              </p>

              {/* Countdown Timer */}
              {showCountdown && (
                <div className="mb-6">
                  <p className="text-white/80 text-sm mb-3 flex items-center justify-center lg:justify-start gap-2">
                    <Clock className="h-4 w-4" />
                    Menuju Hari Natal 2025
                  </p>
                  <div className="flex gap-3 justify-center lg:justify-start">
                    {[
                      { value: countdown.days, label: "Hari" },
                      { value: countdown.hours, label: "Jam" },
                      { value: countdown.minutes, label: "Menit" },
                      { value: countdown.seconds, label: "Detik" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[70px] border border-white/10"
                      >
                        <p className="text-2xl sm:text-3xl font-bold text-white font-mono">
                          {String(item.value).padStart(2, "0")}
                        </p>
                        <p className="text-xs text-white/70 mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link href="/dashboard/rewards">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-white/90 font-semibold">
                    <Gift className="h-5 w-5 mr-2" />
                    Klaim Hadiah
                  </Button>
                </Link>
                <Link href="/dashboard/promo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                  >
                    Lihat Promo
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-64 h-64">
                <ChristmasTree className="w-full h-full" />
                <SantaHat className="absolute -top-8 -right-4 w-20 h-20 transform rotate-12" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-10 rounded-md bg-gradient-to-b from-red-400 to-red-600 relative"
                      style={{ transform: `rotate(${(i - 1.5) * 5}deg)` }}
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-yellow-400 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating ornaments */}
              <Sparkles className="absolute top-4 right-8 h-8 w-8 text-yellow-300 animate-pulse" />
              <Star className="absolute bottom-8 left-4 h-6 w-6 text-yellow-300 fill-yellow-300 animate-bounce" />
            </div>
          </div>

          {/* Snowflakes Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <Snowflake
                key={i}
                className="absolute text-white/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-20px",
                  animation: `fall ${6 + Math.random() * 6}s linear infinite`,
                  animationDelay: `${Math.random() * 6}s`,
                  fontSize: `${8 + Math.random() * 16}px`,
                }}
              />
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-yellow-500/20 blur-3xl" />
        </CardContent>
      </Card>

      {showPromos && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant={activeTab === "christmas" ? "default" : "outline"}
              onClick={() => setActiveTab("christmas")}
              className={cn("gap-2", activeTab === "christmas" && "bg-red-500 hover:bg-red-600")}
            >
              <Gift className="h-4 w-4" />
              Natal 2025
            </Button>
            <Button
              variant={activeTab === "newyear" ? "default" : "outline"}
              onClick={() => setActiveTab("newyear")}
              className={cn("gap-2", activeTab === "newyear" && "bg-amber-500 hover:bg-amber-600")}
            >
              <PartyPopper className="h-4 w-4" />
              Tahun Baru 2026
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Gift className="h-5 w-5 text-red-500" />
              {activeTab === "christmas" ? "Promo Natal 2025" : "Promo Tahun Baru 2026"}
            </h3>
            <Link href="/dashboard/promo">
              <Button variant="ghost" size="sm" className="text-primary">
                Lihat Semua
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPromos.map((promo) => (
              <Card
                key={promo.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedPromo(promo)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-14 w-14 rounded-xl flex items-center justify-center bg-gradient-to-br",
                        promo.gradient,
                      )}
                    >
                      <promo.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">{promo.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {promo.discount}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{promo.description}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{promo.code}</code>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          s/d {promo.validUntil.toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Missions Section */}
      {showMissions && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Misi Natal
            </h3>
            <Badge variant="outline">
              {christmasMissions.filter((m) => m.completed).length}/{christmasMissions.length} Selesai
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {christmasMissions.map((mission) => (
              <Card key={mission.id} className={cn("transition-all", mission.completed && "bg-green-500/5")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center",
                        mission.completed ? "bg-green-500/20" : "bg-muted",
                      )}
                    >
                      {mission.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <mission.icon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{mission.title}</h4>
                        {mission.completed && <Badge className="bg-green-500 text-white text-xs">Selesai</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{mission.description}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {mission.id === "mission-4"
                              ? `Rp${(mission.progress / 1000).toFixed(0)}K / Rp${(mission.target / 1000).toFixed(0)}K`
                              : `${mission.progress} / ${mission.target}`}
                          </span>
                        </div>
                        <Progress
                          value={(mission.progress / mission.target) * 100}
                          className={cn("h-2", mission.completed && "bg-green-100 [&>div]:bg-green-500")}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs">
                        <Gift className="h-3 w-3 text-primary" />
                        <span className="text-primary font-medium">{mission.reward}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Promo Detail Dialog */}
      <Dialog open={!!selectedPromo} onOpenChange={() => setSelectedPromo(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedPromo && (
                <>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      selectedPromo.gradient,
                    )}
                  >
                    <selectedPromo.icon className="h-5 w-5 text-white" />
                  </div>
                  {selectedPromo.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedPromo && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedPromo.description}</p>

              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Kode Promo</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-lg">{selectedPromo.code}</code>
                    <Button variant="outline" size="sm" onClick={() => handleCopyCode(selectedPromo.code)}>
                      {copiedCode === selectedPromo.code ? "Tersalin!" : "Salin"}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Berlaku Hingga</span>
                  <span className="font-medium">{selectedPromo.validUntil.toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Diskon</span>
                  <Badge className={cn("bg-gradient-to-r text-white", selectedPromo.gradient)}>
                    {selectedPromo.discount}
                  </Badge>
                </div>
              </div>

              <Button className="w-full" onClick={() => setSelectedPromo(null)}>
                Gunakan Sekarang
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
