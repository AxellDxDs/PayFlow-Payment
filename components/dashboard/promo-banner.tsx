"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockPromos } from "@/lib/mock-data"
import { ChevronLeft, ChevronRight, Clock, Gift, Smartphone, Zap, Bitcoin } from "@/components/icons"
import { cn } from "@/lib/utils"

const categoryHrefMap: Record<string, string> = {
  topup: "/dashboard/wallet",
  food: "/dashboard/food",
  crypto: "/dashboard/crypto",
  pulsa: "/dashboard/pulsa",
  bills: "/dashboard/bills",
}

const categoryIconMap: Record<string, React.ElementType> = {
  topup: Gift,
  food: Gift,
  crypto: Bitcoin,
  pulsa: Smartphone,
  bills: Zap,
}

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mockPromos.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mockPromos.length) % mockPromos.length)
  }

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentPromo = mockPromos[currentIndex]
  const daysLeft = Math.ceil((currentPromo.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const promoHref = categoryHrefMap[currentPromo.category[0]] || "/dashboard/promo"
  const PromoIcon = categoryIconMap[currentPromo.category[0]] || Gift

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary to-primary/60">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft} hari lagi
            </Badge>
            <h3 className="text-lg sm:text-2xl font-bold text-white line-clamp-2">{currentPromo.title}</h3>
            <p className="text-white/80 text-sm line-clamp-2 hidden sm:block">{currentPromo.description}</p>
            {currentPromo.code && (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-white/70">Kode:</span>
                <Badge variant="secondary" className="bg-white/20 text-white font-mono text-xs sm:text-sm">
                  {currentPromo.code}
                </Badge>
              </div>
            )}
            <Link href={promoHref}>
              <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
                Gunakan Sekarang
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center h-24 w-24 lg:h-32 lg:w-32 rounded-2xl bg-white/10">
            <PromoIcon className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {mockPromos.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 sm:h-2 rounded-full transition-all",
                index === currentIndex ? "bg-white w-4 sm:w-6" : "bg-white/50 w-1.5 sm:w-2",
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
