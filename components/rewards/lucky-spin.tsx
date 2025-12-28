"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Gift, Loader2 } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const prizes = [
  { id: 1, label: "100 Poin", value: 100, color: "#3b82f6" },
  { id: 2, label: "250 Poin", value: 250, color: "#22c55e" },
  { id: 3, label: "500 Poin", value: 500, color: "#f59e0b" },
  { id: 4, label: "Voucher 10K", value: 10000, color: "#ec4899" },
  { id: 5, label: "50 Poin", value: 50, color: "#6366f1" },
  { id: 6, label: "1000 Poin", value: 1000, color: "#ef4444" },
  { id: 7, label: "Coba Lagi", value: 0, color: "#64748b" },
  { id: 8, label: "200 Poin", value: 200, color: "#8b5cf6" },
]

export function LuckySpin() {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [rotation, setRotation] = React.useState(0)
  const [showResult, setShowResult] = React.useState(false)
  const [prize, setPrize] = React.useState<(typeof prizes)[0] | null>(null)
  const [spinsLeft, setSpinsLeft] = React.useState(3)

  const handleSpin = async () => {
    if (spinsLeft <= 0) {
      toast.error("Kesempatan spin habis! Kembali besok.")
      return
    }

    setIsSpinning(true)

    // Random prize
    const randomIndex = Math.floor(Math.random() * prizes.length)
    const selectedPrize = prizes[randomIndex]

    // Calculate rotation (5 full spins + offset to land on prize)
    const segmentAngle = 360 / prizes.length
    const prizeAngle = segmentAngle * randomIndex
    const newRotation = rotation + 1800 + (360 - prizeAngle) + segmentAngle / 2

    setRotation(newRotation)

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 4000))

    setPrize(selectedPrize)
    setIsSpinning(false)
    setSpinsLeft((prev) => prev - 1)
    setShowResult(true)

    if (selectedPrize.value > 0) {
      toast.success(`Selamat! Anda mendapat ${selectedPrize.label}!`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Lucky Spin
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* Wheel */}
          <div className="relative w-64 h-64">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary" />
            </div>

            {/* Wheel */}
            <div
              className="w-full h-full rounded-full border-4 border-primary shadow-lg overflow-hidden transition-transform duration-[4000ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {prizes.map((p, i) => {
                  const angle = (360 / prizes.length) * i
                  const startAngle = (angle * Math.PI) / 180
                  const endAngle = ((angle + 360 / prizes.length) * Math.PI) / 180
                  const x1 = 50 + 50 * Math.cos(startAngle)
                  const y1 = 50 + 50 * Math.sin(startAngle)
                  const x2 = 50 + 50 * Math.cos(endAngle)
                  const y2 = 50 + 50 * Math.sin(endAngle)
                  const largeArc = 360 / prizes.length > 180 ? 1 : 0

                  // Text position
                  const midAngle = startAngle + (endAngle - startAngle) / 2
                  const textX = 50 + 35 * Math.cos(midAngle)
                  const textY = 50 + 35 * Math.sin(midAngle)

                  return (
                    <g key={p.id}>
                      <path d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={p.color} />
                      <text
                        x={textX}
                        y={textY}
                        fontSize="4"
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${angle + 360 / prizes.length / 2 + 90}, ${textX}, ${textY})`}
                        className="font-semibold"
                      >
                        {p.label}
                      </text>
                    </g>
                  )
                })}
                <circle cx="50" cy="50" r="8" fill="white" stroke="hsl(var(--primary))" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Spin Button */}
          <div className="mt-6 text-center">
            <Button size="lg" onClick={handleSpin} disabled={isSpinning || spinsLeft <= 0} className="gap-2">
              {isSpinning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memutar...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Putar Sekarang!
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">{spinsLeft} kesempatan tersisa hari ini</p>
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>{prize?.value ? "Selamat!" : "Coba Lagi!"}</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div
              className={cn(
                "h-24 w-24 rounded-full mx-auto flex items-center justify-center text-4xl mb-4",
                prize?.value ? "bg-green-500/20" : "bg-muted",
              )}
            >
              {prize?.value ? <Gift className="h-12 w-12 text-green-500" /> : "😢"}
            </div>
            <p className="text-2xl font-bold">{prize?.label}</p>
            {prize?.value ? (
              <p className="text-muted-foreground mt-2">Hadiah sudah ditambahkan ke akun Anda!</p>
            ) : (
              <p className="text-muted-foreground mt-2">Jangan menyerah, coba lagi!</p>
            )}
          </div>
          <Button onClick={() => setShowResult(false)} className="w-full">
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
