"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Gift, X, Sparkles, ChevronRight, Clock, Star, Snowflake } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChristmasFloatingButtonProps {
  className?: string
}

export function ChristmasFloatingButton({ className }: ChristmasFloatingButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [countdown, setCountdown] = React.useState({ days: 0, hours: 0, minutes: 0 })

  React.useEffect(() => {
    const calculateCountdown = () => {
      const christmas = new Date("2024-12-25T00:00:00")
      const now = new Date()
      const diff = christmas.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setCountdown({ days, hours, minutes })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 60000)
    return () => clearInterval(timer)
  }, [])

  if (isDismissed) return null

  return (
    <div className={cn("fixed bottom-20 right-4 z-50", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
              "bg-gradient-to-br from-red-500 to-green-600 hover:from-red-600 hover:to-green-700",
              "animate-bounce hover:animate-none",
            )}
            size="icon"
          >
            <Gift className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-400 items-center justify-center text-[10px] font-bold text-yellow-900">
                !
              </span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-72 p-0 overflow-hidden border-0 shadow-xl" sideOffset={12}>
          <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-green-600 p-4 text-white">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-400 text-[10px]">LIMITED EVENT</Badge>
                <p className="font-bold text-sm mt-1">Christmas Event 2024</p>
              </div>
            </div>

            {/* Mini Countdown */}
            <div className="flex gap-2 mb-3">
              {[
                { value: countdown.days, label: "Hari" },
                { value: countdown.hours, label: "Jam" },
                { value: countdown.minutes, label: "Min" },
              ].map((item, i) => (
                <div key={i} className="bg-white/20 rounded-md px-2 py-1 text-center flex-1">
                  <p className="text-lg font-bold">{String(item.value).padStart(2, "0")}</p>
                  <p className="text-[9px] text-white/80">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Decorative snowflakes */}
            <div className="absolute top-0 right-0 opacity-20">
              <Snowflake className="h-16 w-16 -mr-4 -mt-4" />
            </div>
          </div>

          <div className="p-3 bg-background space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span>Cashback hingga 50%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Gift className="h-3 w-3 text-red-500" />
              <span>Grand Prize Rp100 Juta</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-green-500" />
              <span>Berlaku hingga 1 Januari 2025</span>
            </div>

            <Link href="/dashboard/christmas" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-2 bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700">
                Lihat Event
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
