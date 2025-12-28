"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Zap, ChevronRight, Clock, Gamepad2 } from "@/components/icons"
import { cn } from "@/lib/utils"

const promoAds = [
  {
    id: "kuota",
    title: "Paket Data Super Hemat",
    description: "Kuota 25GB hanya Rp 65.000",
    discount: "40%",
    icon: Wifi,
    color: "from-blue-500 to-cyan-500",
    href: "/dashboard/pulsa",
    badge: "Best Seller",
    expiry: "2 hari lagi",
  },
  {
    id: "pulsa",
    title: "Promo Pulsa All Operator",
    description: "Cashback hingga Rp 10.000",
    discount: "15%",
    icon: Smartphone,
    color: "from-red-500 to-orange-500",
    href: "/dashboard/pulsa",
    badge: "Hot",
    expiry: "Hari ini",
  },
  {
    id: "listrik",
    title: "Token Listrik Gratis Admin",
    description: "Bebas biaya admin untuk semua nominal",
    discount: "FREE",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
    href: "/dashboard/bills",
    badge: "Promo",
    expiry: "3 hari lagi",
  },
  {
    id: "game",
    title: "Top Up Game Double Bonus",
    description: "Bonus diamond & voucher game",
    discount: "2x",
    icon: Gamepad2,
    color: "from-purple-500 to-pink-500",
    href: "/dashboard/pulsa",
    badge: "New",
    expiry: "5 hari lagi",
  },
]

export function PromoAds() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Promo Spesial</h2>
          <p className="text-sm text-muted-foreground">Penawaran terbatas untuk Anda</p>
        </div>
        <Link href="/dashboard/promo">
          <Button variant="ghost" size="sm" className="gap-1">
            Lihat Semua
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {promoAds.map((ad) => (
          <Link key={ad.id} href={ad.href}>
            <Card className="group relative overflow-hidden border-0 hover:shadow-lg transition-all cursor-pointer h-full">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", ad.color)} />
              <CardContent className="relative p-4 text-white h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <ad.icon className="h-5 w-5" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0 text-xs">{ad.badge}</Badge>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">{ad.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-2">{ad.description}</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {ad.expiry}
                  </div>
                  <Badge className="bg-white text-foreground font-bold">{ad.discount} OFF</Badge>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white border-0 group-hover:bg-white group-hover:text-foreground transition-all"
                >
                  Gunakan Sekarang
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
