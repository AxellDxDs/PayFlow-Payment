"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Sparkles, X, ChevronRight, Star, Snowflake } from "lucide-react"
import Link from "next/link"

interface ChristmasBannerProps {
  onClose?: () => void
  variant?: "full" | "compact"
}

export function ChristmasBanner({ onClose, variant = "full" }: ChristmasBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  if (variant === "compact") {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-red-600 via-red-500 to-green-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Promo Natal & Tahun Baru!</p>
                <p className="text-white/80 text-xs">Cashback hingga 50% untuk semua transaksi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/promo">
                <Button size="sm" variant="secondary" className="h-8">
                  Lihat <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => {
                  setIsVisible(false)
                  onClose?.()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Snowflakes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <Snowflake
                key={i}
                className="absolute text-white/20 animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  fontSize: `${8 + Math.random() * 8}px`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-600 via-red-500 to-green-600">
      <CardContent className="p-6 sm:p-8">
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/20 z-10"
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Left side - Icon and decoration */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <Gift className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-300 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Star className="h-6 w-6 text-yellow-300 fill-yellow-300" />
            </div>
          </div>

          {/* Center - Content */}
          <div className="flex-1 text-center md:text-left">
            <Badge className="mb-3 bg-yellow-500 text-yellow-950 hover:bg-yellow-400">
              <Sparkles className="h-3 w-3 mr-1" />
              Event Natal 2024
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Merry Christmas & Happy New Year!</h3>
            <p className="text-white/90 mb-4 max-w-md">
              Rayakan Natal bersama PayFlow! Dapatkan cashback hingga 50%, voucher gratis, dan kesempatan menang hadiah
              spesial senilai Rp100 Juta!
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/dashboard/promo">
                <Button variant="secondary" size="lg" className="font-semibold">
                  <Gift className="h-5 w-5 mr-2" />
                  Lihat Semua Promo
                </Button>
              </Link>
              <Link href="/dashboard/points">
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

          {/* Right side - Stats */}
          <div className="hidden lg:grid grid-cols-1 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">50%</p>
              <p className="text-xs text-white/80">Cashback</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">2x</p>
              <p className="text-xs text-white/80">Poin Rewards</p>
            </div>
          </div>
        </div>

        {/* Decorative snowflakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <Snowflake
              key={i}
              className="absolute text-white/10 animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                fontSize: `${10 + Math.random() * 12}px`,
              }}
            />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/20 blur-2xl" />
      </CardContent>
    </Card>
  )
}
