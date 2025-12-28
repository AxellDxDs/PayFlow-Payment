"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Smartphone,
  Zap,
  Receipt,
  Bitcoin,
  UtensilsCrossed,
  CreditCard,
  Send,
  Wallet,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const quickActions = [
  {
    icon: ArrowUpRight,
    label: "Top Up",
    href: "/dashboard/topup",
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  },
  {
    icon: Send,
    label: "Transfer",
    href: "/dashboard/transfer",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
  {
    icon: ArrowDownLeft,
    label: "Tarik Dana",
    href: "/dashboard/withdraw",
    color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  },
  {
    icon: QrCode,
    label: "QRIS",
    href: "/dashboard/qris",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  },
  {
    icon: Smartphone,
    label: "Pulsa",
    href: "/dashboard/pulsa",
    color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
  {
    icon: Wallet,
    label: "E-Wallet",
    href: "/dashboard/ewallet",
    color: "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20",
  },
  {
    icon: CreditCard,
    label: "Top Up Kartu",
    href: "/dashboard/topup-card",
    color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  },
  {
    icon: Zap,
    label: "Listrik",
    href: "/dashboard/bills",
    color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  },
  {
    icon: Bitcoin,
    label: "Crypto",
    href: "/dashboard/crypto",
    color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  },
  {
    icon: UtensilsCrossed,
    label: "Makanan",
    href: "/dashboard/food",
    color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  },
  {
    icon: CreditCard,
    label: "Kartu",
    href: "/dashboard/cards",
    color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
  },
  {
    icon: Receipt,
    label: "Tagihan",
    href: "/dashboard/bills",
    color: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto flex-col gap-1.5 sm:gap-2 p-2 sm:p-3 md:p-4 w-full transition-all duration-200 hover:scale-105",
                  action.color,
                )}
              >
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[10px] sm:text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
