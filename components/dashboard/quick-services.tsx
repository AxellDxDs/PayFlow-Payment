"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import {
  Zap,
  Droplets,
  Tv,
  Wifi,
  Phone,
  CreditCard,
  Building2,
  GraduationCap,
  ChevronRight,
  Smartphone,
  Gamepad2,
  Car,
  Plane,
  Train,
  Shield,
  Heart,
  Home,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

const services = [
  {
    icon: Zap,
    label: "PLN",
    href: "/dashboard/bills?type=pln",
    color: "bg-yellow-500/10 text-yellow-600",
    badge: null,
  },
  {
    icon: Droplets,
    label: "PDAM",
    href: "/dashboard/bills?type=pdam",
    color: "bg-blue-500/10 text-blue-600",
    badge: null,
  },
  {
    icon: Wifi,
    label: "Internet",
    href: "/dashboard/bills?type=internet",
    color: "bg-cyan-500/10 text-cyan-600",
    badge: "Promo",
  },
  {
    icon: Tv,
    label: "TV Kabel",
    href: "/dashboard/bills?type=tv",
    color: "bg-purple-500/10 text-purple-600",
    badge: null,
  },
  {
    icon: Phone,
    label: "Telepon",
    href: "/dashboard/bills?type=telepon",
    color: "bg-green-500/10 text-green-600",
    badge: null,
  },
  {
    icon: CreditCard,
    label: "Kartu Kredit",
    href: "/dashboard/bills?type=cc",
    color: "bg-red-500/10 text-red-600",
    badge: null,
  },
  {
    icon: Building2,
    label: "BPJS",
    href: "/dashboard/bills?type=bpjs",
    color: "bg-emerald-500/10 text-emerald-600",
    badge: null,
  },
  {
    icon: GraduationCap,
    label: "Pendidikan",
    href: "/dashboard/bills?type=pendidikan",
    color: "bg-indigo-500/10 text-indigo-600",
    badge: "New",
  },
  {
    icon: Smartphone,
    label: "Pascabayar",
    href: "/dashboard/pulsa?type=pascabayar",
    color: "bg-orange-500/10 text-orange-600",
    badge: null,
  },
  {
    icon: Gamepad2,
    label: "Game",
    href: "/dashboard/pulsa?type=game",
    color: "bg-pink-500/10 text-pink-600",
    badge: "Hot",
  },
]

const additionalServices = [
  {
    icon: Car,
    label: "Pajak Kendaraan",
    href: "/dashboard/vehicle-tax",
    color: "bg-slate-500/10 text-slate-600",
    badge: null,
  },
  {
    icon: Plane,
    label: "Tiket Pesawat",
    href: "/dashboard/travel",
    color: "bg-sky-500/10 text-sky-600",
    badge: "Promo",
  },
  {
    icon: Train,
    label: "Tiket Kereta",
    href: "/dashboard/travel",
    color: "bg-amber-500/10 text-amber-600",
    badge: null,
  },
  {
    icon: Shield,
    label: "Asuransi",
    href: "/dashboard/insurance",
    color: "bg-teal-500/10 text-teal-600",
    badge: "New",
  },
  {
    icon: Heart,
    label: "Donasi",
    href: "/dashboard/donation",
    color: "bg-rose-500/10 text-rose-600",
    badge: null,
  },
  {
    icon: Home,
    label: "Cicilan",
    href: "/dashboard/installment",
    color: "bg-violet-500/10 text-violet-600",
    badge: null,
  },
]

export function QuickServices() {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bayar Tagihan</CardTitle>
          <Link href="/dashboard/bills">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              {t.dashboard.viewAll}
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main services */}
        <div className="grid grid-cols-5 gap-2">
          {services.map((service, index) => (
            <ScrollAnimation key={service.label} animation="zoom-in" delay={index * 30}>
              <Link href={service.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto flex-col gap-1.5 p-2 w-full transition-all hover:scale-105 relative",
                    service.color,
                  )}
                >
                  {service.badge && (
                    <Badge
                      className="absolute -top-1 -right-1 text-[8px] px-1 py-0 h-4"
                      variant={service.badge === "Hot" ? "destructive" : "default"}
                    >
                      {service.badge}
                    </Badge>
                  )}
                  <service.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{service.label}</span>
                </Button>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">Layanan Lainnya</span>
          </div>
        </div>

        {/* Additional services - Fixed grid layout */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {additionalServices.map((service, index) => (
            <ScrollAnimation key={service.label} animation="zoom-in" delay={index * 30}>
              <Link href={service.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto flex-col gap-1.5 p-2 w-full transition-all hover:scale-105 relative",
                    service.color,
                  )}
                >
                  {service.badge && (
                    <Badge
                      className="absolute -top-1 -right-1 text-[8px] px-1 py-0 h-4"
                      variant={
                        service.badge === "Hot" ? "destructive" : service.badge === "New" ? "default" : "secondary"
                      }
                    >
                      {service.badge}
                    </Badge>
                  )}
                  <service.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium text-center">{service.label}</span>
                </Button>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
