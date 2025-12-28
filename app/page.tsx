"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Shield,
  Bitcoin,
  UtensilsCrossed,
  QrCode,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  Globe,
  Smartphone,
  ChevronRight,
  Gift,
  Lock,
  Sparkles,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const Snowflake = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path
      d="M12 0L12 24M0 12L24 12M3.5 3.5L20.5 20.5M20.5 3.5L3.5 20.5M12 2L10 5L12 8L14 5L12 2M12 16L10 19L12 22L14 19L12 16M2 12L5 10L8 12L5 14L2 12M16 12L19 10L22 12L19 14L16 12"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
)

const features = [
  {
    icon: Wallet,
    title: "Dompet Digital",
    description: "Kelola keuangan Anda dengan mudah. Top up, transfer, dan tarik dana kapan saja.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Bitcoin,
    title: "Trading Crypto",
    description: "Beli, jual, dan pantau investasi cryptocurrency Anda dalam satu aplikasi.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Pesan Makanan",
    description: "Pesan makanan favorit dari ribuan restoran dengan pengiriman cepat.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: QrCode,
    title: "Pembayaran QRIS",
    description: "Bayar di jutaan merchant dengan scan QR code. Cepat dan aman.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Smartphone,
    title: "Pulsa & Tagihan",
    description: "Beli pulsa, paket data, bayar listrik, PDAM, dan tagihan lainnya.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Gift,
    title: "Rewards & Promo",
    description: "Dapatkan cashback, voucher, dan berbagai hadiah menarik setiap transaksi.",
    color: "bg-pink-500/10 text-pink-500",
  },
]

const stats = [
  { value: "10M+", label: "Pengguna Aktif" },
  { value: "500K+", label: "Merchant Partner" },
  { value: "99.9%", label: "Uptime" },
  { value: "Rp50T+", label: "Transaksi/Bulan" },
]

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Pengusaha",
    content: "PayFlow memudahkan saya mengelola keuangan bisnis. Fitur QRIS sangat membantu!",
    rating: 5,
  },
  {
    name: "Siti Rahayu",
    role: "Mahasiswa",
    content: "Aplikasi yang sangat lengkap. Bisa bayar kuliah, beli pulsa, dan pesan makanan.",
    rating: 5,
  },
  {
    name: "Ahmad Hidayat",
    role: "Karyawan",
    content: "Trading crypto di PayFlow sangat mudah. Interface-nya user friendly banget.",
    rating: 5,
  },
]

const securityFeatures = [
  { icon: Shield, label: "Enkripsi End-to-End" },
  { icon: Lock, label: "Autentikasi 2 Faktor" },
  { icon: CheckCircle2, label: "Sertifikasi PCI DSS" },
  { icon: Globe, label: "Diawasi OJK & BI" },
]

function useInView(options?: IntersectionObserverInit) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, ...options },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

function AnimatedSection({
  children,
  className,
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView()

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-500",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
              )}
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PayFlow
              </span>
              <Badge className="bg-red-500 text-white border-0 animate-pulse">
                <Gift className="h-3 w-3 mr-1" />
                Natal
              </Badge>
            </div>

            <div
              className={cn(
                "hidden md:flex items-center gap-8 transition-all duration-500 delay-100",
                mounted ? "opacity-100" : "opacity-0",
              )}
            >
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Fitur
              </a>
              <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Keamanan
              </a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimoni
              </a>
            </div>

            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-500 delay-200",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
              )}
            >
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/login">
                <Button>
                  Daftar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects with animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={cn(
              "absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl transition-all duration-1000",
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
          />
          <div
            className={cn(
              "absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl transition-all duration-1000 delay-300",
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

          {mounted &&
            [...Array(15)].map((_, i) => (
              <Snowflake
                key={i}
                className="absolute text-primary/10 animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                  fontSize: `${12 + Math.random() * 16}px`,
                }}
              />
            ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div
              className={cn(
                "transition-all duration-700 ease-out",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              <Badge
                variant="secondary"
                className="mb-6 bg-gradient-to-r from-red-500/20 to-green-500/20 border-red-500/30"
              >
                <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
                Promo Natal & Tahun Baru - Cashback 50%!
              </Badge>
            </div>

            <h1
              className={cn(
                "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance transition-all duration-700 delay-100",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              Semua Kebutuhan Keuangan dalam{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Satu Aplikasi
              </span>
            </h1>

            <p
              className={cn(
                "text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty transition-all duration-700 delay-200",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              Transfer uang, trading crypto, pesan makanan, bayar tagihan, dan dapatkan rewards menarik. Semua bisa
              dilakukan dengan PayFlow.
            </p>

            <div
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              )}
            >
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 group">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 bg-transparent">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>

            {/* Stats with scroll animation */}
            <AnimatedSection
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border"
              delay={400}
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "text-center transition-all duration-500",
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section with scroll animations */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Fitur Unggulan
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Semua yang Anda Butuhkan, dalam Satu Genggaman
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              PayFlow menyediakan berbagai fitur untuk memudahkan transaksi keuangan sehari-hari Anda
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 100}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 h-full hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                        feature.color,
                      )}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section with scroll animations */}
      <section id="security" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Badge variant="outline" className="mb-4">
                <Shield className="h-3 w-3 mr-1" />
                Keamanan Terjamin
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance">
                Keamanan Anda adalah Prioritas Utama Kami
              </h2>
              <p className="text-muted-foreground mb-8">
                PayFlow menggunakan teknologi keamanan terbaik untuk melindungi setiap transaksi dan data pribadi Anda.
                Kami telah mendapatkan berbagai sertifikasi keamanan internasional.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((item, index) => (
                  <AnimatedSection key={item.label} delay={index * 100}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <Shield className="h-32 w-32 text-primary relative z-10" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section with scroll animations */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              Testimoni
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Apa Kata Pengguna Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ribuan pengguna telah merasakan kemudahan bertransaksi dengan PayFlow
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.name} delay={index * 150}>
                <Card className="border-border/50 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{`"${testimonial.content}"`}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Christmas theme */}
      <AnimatedSection>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-br from-red-600 via-red-500 to-green-600 border-0 overflow-hidden">
              <CardContent className="p-8 sm:p-12 relative">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                {/* Snowflakes */}
                {[...Array(10)].map((_, i) => (
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

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                  <Badge className="mb-4 bg-yellow-500 text-yellow-950">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Promo Spesial Natal
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                    Rayakan Natal Bersama PayFlow!
                  </h2>
                  <p className="text-primary-foreground/80 mb-8">
                    Daftar sekarang dan dapatkan bonus saldo Rp50.000 + cashback 50% untuk transaksi pertama Anda!
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/login">
                      <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                        <Gift className="h-5 w-5 mr-2" />
                        Daftar & Klaim Bonus
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">P</span>
                </div>
                <span className="text-xl font-bold">PayFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Super App pembayaran digital terpercaya untuk semua kebutuhan finansial Anda.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Dompet Digital
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Trading Crypto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pesan Makanan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pembayaran QRIS
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Karir
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2025 PayFlow. Terdaftar dan diawasi oleh Bank Indonesia & OJK.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                PCI DSS Certified
              </Badge>
              <Badge variant="outline" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                ISO 27001
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
