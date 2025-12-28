"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  HelpCircle,
  CreditCard,
  Shield,
  Smartphone,
  Send,
  Coffee,
  TrendingUp,
  Gift,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
} from "@/components/icons"

const faqCategories = [
  { id: "all", label: "Semua", icon: HelpCircle },
  { id: "account", label: "Akun", icon: Shield },
  { id: "transaction", label: "Transaksi", icon: CreditCard },
  { id: "topup", label: "Top Up", icon: Smartphone },
  { id: "crypto", label: "Crypto", icon: TrendingUp },
  { id: "food", label: "Makanan", icon: Coffee },
]

const faqs = [
  {
    id: "faq-1",
    category: "account",
    question: "Bagaimana cara mendaftar akun baru?",
    answer:
      "Untuk mendaftar akun baru:\n1. Buka aplikasi DigiBank\n2. Klik 'Daftar' pada halaman login\n3. Masukkan email atau nomor HP\n4. Verifikasi dengan OTP yang dikirim\n5. Lengkapi data diri Anda\n6. Buat PIN keamanan 6 digit\n7. Akun Anda siap digunakan!",
  },
  {
    id: "faq-2",
    category: "account",
    question: "Bagaimana cara verifikasi KYC?",
    answer:
      "Verifikasi KYC diperlukan untuk mengakses semua fitur. Caranya:\n1. Buka menu Pengaturan > Profil\n2. Klik 'Verifikasi KYC'\n3. Siapkan KTP asli Anda\n4. Foto KTP dengan jelas (pastikan tidak blur)\n5. Ambil foto selfie sambil memegang KTP\n6. Tunggu proses verifikasi (maksimal 1x24 jam)\n\nPastikan foto jelas dan data terlihat dengan baik.",
  },
  {
    id: "faq-3",
    category: "account",
    question: "Lupa PIN transaksi, bagaimana mengatasinya?",
    answer:
      "Jika Anda lupa PIN transaksi:\n1. Buka menu Pengaturan > Keamanan\n2. Pilih 'Lupa PIN'\n3. Verifikasi identitas melalui OTP ke nomor HP terdaftar\n4. Buat PIN baru 6 digit\n5. Konfirmasi PIN baru\n\nJika masih mengalami kendala, hubungi Customer Service kami.",
  },
  {
    id: "faq-4",
    category: "transaction",
    question: "Berapa limit transfer harian?",
    answer:
      "Limit transfer harian tergantung pada level akun Anda:\n- Bronze: Rp5.000.000/hari\n- Silver: Rp10.000.000/hari\n- Gold: Rp25.000.000/hari\n- Platinum: Rp50.000.000/hari\n- Diamond: Unlimited\n\nAnda dapat meningkatkan level dengan mengumpulkan poin dari transaksi.",
  },
  {
    id: "faq-5",
    category: "transaction",
    question: "Bagaimana cara transfer ke bank lain?",
    answer:
      "Untuk transfer ke bank lain:\n1. Buka menu Transfer\n2. Pilih tab 'Bank'\n3. Pilih bank tujuan\n4. Masukkan nomor rekening\n5. Sistem akan menampilkan nama pemilik rekening\n6. Masukkan jumlah transfer\n7. Review dan konfirmasi dengan PIN\n\nBiaya admin: Rp2.500 per transaksi",
  },
  {
    id: "faq-6",
    category: "topup",
    question: "Metode top up apa saja yang tersedia?",
    answer:
      "Metode top up yang tersedia:\n- Virtual Account (BCA, Mandiri, BNI, BRI)\n- Transfer Bank Manual\n- Kartu Kredit/Debit (biaya admin 2.5%)\n- E-Wallet (GoPay, OVO, Dana, LinkAja)\n- Minimarket (Alfamart, Indomaret)\n- Bank Transfer RTGS/LLG\n\nMinimal top up: Rp10.000",
  },
  {
    id: "faq-7",
    category: "topup",
    question: "Berapa lama saldo masuk setelah top up?",
    answer:
      "Waktu masuk saldo tergantung metode:\n- Virtual Account: Instan (1-5 menit)\n- E-Wallet: Instan (1-5 menit)\n- Kartu Kredit: Instan (1-5 menit)\n- Transfer Bank: 1-15 menit (jam kerja)\n- Minimarket: 1-15 menit\n\nJika lebih dari 1 jam belum masuk, silakan hubungi CS.",
  },
  {
    id: "faq-8",
    category: "crypto",
    question: "Bagaimana cara beli crypto?",
    answer:
      "Untuk membeli crypto:\n1. Buka menu Crypto\n2. Pilih koin yang ingin dibeli\n3. Klik 'Beli'\n4. Masukkan jumlah dalam Rupiah atau jumlah koin\n5. Review harga dan biaya\n6. Konfirmasi dengan PIN\n7. Crypto akan masuk ke wallet Anda\n\nMinimal pembelian: Rp10.000",
  },
  {
    id: "faq-9",
    category: "crypto",
    question: "Apakah crypto saya aman?",
    answer:
      "Keamanan crypto Anda adalah prioritas kami:\n- Cold storage untuk mayoritas aset\n- Enkripsi end-to-end\n- 2FA untuk transaksi\n- Insurance coverage\n- Regular security audit\n- Whitelist address feature\n\nKami merekomendasikan mengaktifkan 2FA untuk keamanan tambahan.",
  },
  {
    id: "faq-10",
    category: "food",
    question: "Bagaimana cara melacak pesanan makanan?",
    answer:
      "Untuk melacak pesanan:\n1. Buka menu Makanan\n2. Klik ikon keranjang atau 'Pesanan Saya'\n3. Pilih pesanan aktif\n4. Anda dapat melihat:\n   - Status pesanan (Diproses/Diantar)\n   - Lokasi driver real-time\n   - Estimasi waktu tiba\n5. Hubungi driver jika diperlukan",
  },
  {
    id: "faq-11",
    category: "food",
    question: "Bagaimana jika pesanan tidak sesuai?",
    answer:
      "Jika pesanan tidak sesuai:\n1. Jangan terima pesanan jika belum dibuka\n2. Foto bukti ketidaksesuaian\n3. Buka menu 'Bantuan' di detail pesanan\n4. Pilih 'Laporkan Masalah'\n5. Upload foto dan jelaskan masalah\n6. Tim kami akan review dalam 1x24 jam\n\nRefund akan diproses ke saldo jika klaim valid.",
  },
]

const helpTopics = [
  {
    title: "Panduan Pemula",
    description: "Cara memulai menggunakan DigiBank",
    icon: HelpCircle,
    articles: 12,
  },
  {
    title: "Keamanan Akun",
    description: "Tips menjaga keamanan akun Anda",
    icon: Shield,
    articles: 8,
  },
  {
    title: "Transaksi & Transfer",
    description: "Semua tentang transfer dan pembayaran",
    icon: Send,
    articles: 15,
  },
  {
    title: "Trading Crypto",
    description: "Panduan lengkap trading crypto",
    icon: TrendingUp,
    articles: 10,
  },
  {
    title: "Promo & Rewards",
    description: "Cara mendapatkan cashback dan poin",
    icon: Gift,
    articles: 6,
  },
]

export function HelpContent() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pusat Bantuan</h1>
        <p className="text-muted-foreground">Temukan jawaban untuk pertanyaan Anda</p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
        <CardContent className="py-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Ada yang bisa kami bantu?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari pertanyaan atau topik..."
                className="pl-12 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Topik Bantuan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpTopics.map((topic) => {
            const Icon = topic.icon
            return (
              <Card key={topic.title} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                      <p className="text-xs text-primary mt-1">{topic.articles} artikel</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Pertanyaan yang Sering Diajukan</h2>

        <div className="flex gap-2 overflow-x-auto pb-4">
          {faqCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                className={selectedCategory !== cat.id ? "bg-transparent" : ""}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {cat.label}
              </Button>
            )
          })}
        </div>

        <Card>
          <CardContent className="p-0">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="px-4">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {faqCategories.find((c) => c.id === faq.category)?.label}
                        </Badge>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="whitespace-pre-line text-muted-foreground pl-[70px]">{faq.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Tidak ada hasil ditemukan</p>
                <p className="text-sm text-muted-foreground">Coba kata kunci lain</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Masih butuh bantuan?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Live Chat</p>
                <p className="text-sm text-muted-foreground">Tersedia 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Call Center</p>
                <p className="text-sm text-muted-foreground">1500-XXX (24 jam)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">support@digibank.id</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
