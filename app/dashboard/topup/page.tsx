"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  ArrowLeft,
  Building2,
  Store,
  CreditCard,
  CheckCircle2,
  Copy,
  Clock,
  ChevronRight,
  Loader2,
  QrCode,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Indonesian Banks
const banks = [
  { id: "bca", name: "BCA", code: "014", color: "bg-blue-600" },
  { id: "bni", name: "BNI", code: "009", color: "bg-orange-500" },
  { id: "bri", name: "BRI", code: "002", color: "bg-blue-700" },
  { id: "mandiri", name: "Mandiri", code: "008", color: "bg-blue-800" },
  { id: "cimb", name: "CIMB Niaga", code: "022", color: "bg-red-600" },
  { id: "danamon", name: "Danamon", code: "011", color: "bg-yellow-600" },
  { id: "permata", name: "Permata", code: "013", color: "bg-green-600" },
  { id: "bsi", name: "BSI", code: "451", color: "bg-emerald-600" },
  { id: "btn", name: "BTN", code: "200", color: "bg-orange-600" },
  { id: "ocbc", name: "OCBC NISP", code: "028", color: "bg-red-700" },
  { id: "mega", name: "Bank Mega", code: "426", color: "bg-blue-500" },
  { id: "panin", name: "Panin Bank", code: "019", color: "bg-blue-400" },
  { id: "maybank", name: "Maybank", code: "016", color: "bg-yellow-500" },
  { id: "uob", name: "UOB", code: "023", color: "bg-blue-900" },
  { id: "hsbc", name: "HSBC", code: "041", color: "bg-red-800" },
  { id: "dbs", name: "DBS", code: "046", color: "bg-red-600" },
  { id: "sinarmas", name: "Sinarmas", code: "153", color: "bg-yellow-700" },
  { id: "jenius", name: "Jenius/BTPN", code: "213", color: "bg-cyan-600" },
  { id: "jago", name: "Bank Jago", code: "542", color: "bg-blue-500" },
  { id: "blu", name: "blu by BCA", code: "501", color: "bg-blue-600" },
  { id: "seabank", name: "SeaBank", code: "535", color: "bg-teal-600" },
  { id: "neo", name: "Bank Neo", code: "490", color: "bg-purple-600" },
  { id: "line", name: "LINE Bank", code: "484", color: "bg-green-500" },
  { id: "allo", name: "Allo Bank", code: "567", color: "bg-purple-500" },
]

// Retail stores
const retailers = [
  { id: "indomaret", name: "Indomaret", color: "bg-red-500" },
  { id: "alfamart", name: "Alfamart", color: "bg-red-600" },
  { id: "alfamidi", name: "Alfamidi", color: "bg-yellow-500" },
  { id: "tokopedia", name: "Tokopedia", color: "bg-green-500" },
  { id: "shopee", name: "Shopee", color: "bg-orange-500" },
  { id: "pos", name: "Kantor Pos", color: "bg-orange-600" },
  { id: "pegadaian", name: "Pegadaian", color: "bg-green-600" },
  { id: "lawson", name: "Lawson", color: "bg-blue-500" },
  { id: "familymart", name: "FamilyMart", color: "bg-green-700" },
  { id: "dandan", name: "Dan+Dan", color: "bg-pink-500" },
]

// Credit cards
const creditCards = [
  { id: "visa", name: "Visa", color: "bg-blue-600" },
  { id: "mastercard", name: "Mastercard", color: "bg-red-500" },
  { id: "jcb", name: "JCB", color: "bg-green-600" },
  { id: "amex", name: "American Express", color: "bg-blue-500" },
]

const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000]

type TopupStep = "select-method" | "select-amount" | "payment-details" | "processing" | "success"

export default function TopUpPage() {
  const router = useRouter()
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [step, setStep] = React.useState<TopupStep>("select-method")
  const [method, setMethod] = React.useState<"bank" | "retail" | "card" | "qris">("bank")
  const [selectedProvider, setSelectedProvider] = React.useState<string>("")
  const [amount, setAmount] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [virtualAccount, setVirtualAccount] = React.useState("")

  const generateVA = () => {
    const prefix = method === "bank" ? banks.find((b) => b.id === selectedProvider)?.code || "000" : ""
    const random = Math.floor(Math.random() * 9000000000000) + 1000000000000
    return prefix + random.toString().slice(0, 10)
  }

  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId)
    setStep("select-amount")
  }

  const handleAmountSubmit = () => {
    if (!amount || Number.parseInt(amount) < 10000) {
      toast.error("Minimum top up Rp10.000")
      return
    }
    setVirtualAccount(generateVA())
    setStep("payment-details")
  }

  const handleConfirmPayment = async () => {
    setStep("processing")
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update wallet balance
    const topupAmount = Number.parseInt(amount)
    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) + topupAmount,
    })

    // Add transaction
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "topup",
      amount: topupAmount,
      fee: 0,
      status: "success",
      description: `Top Up via ${method === "bank" ? banks.find((b) => b.id === selectedProvider)?.name : method === "retail" ? retailers.find((r) => r.id === selectedProvider)?.name : "Credit Card"}`,
      createdAt: new Date(),
    })

    setIsProcessing(false)
    setStep("success")
    toast.success("Top up berhasil!")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Berhasil disalin!")
  }

  const resetForm = () => {
    setStep("select-method")
    setSelectedProvider("")
    setAmount("")
    setVirtualAccount("")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === "select-method" ? router.back() : resetForm())}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Top Up Saldo</h1>
          <p className="text-muted-foreground text-sm">Isi saldo PayFlow Anda</p>
        </div>
      </div>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-primary to-primary/60 border-0 text-white">
        <CardContent className="p-6">
          <p className="text-sm text-white/80">Saldo Saat Ini</p>
          <p className="text-3xl font-bold">{formatCurrency(wallet?.balanceMain || 0)}</p>
        </CardContent>
      </Card>

      {/* Step: Select Method */}
      {step === "select-method" && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <Tabs defaultValue="bank" onValueChange={(v) => setMethod(v as typeof method)}>
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              <TabsTrigger
                value="bank"
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Bank</span>
              </TabsTrigger>
              <TabsTrigger
                value="retail"
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Store className="h-5 w-5" />
                <span className="text-xs">Retail</span>
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Kartu</span>
              </TabsTrigger>
              <TabsTrigger
                value="qris"
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <QrCode className="h-5 w-5" />
                <span className="text-xs">QRIS</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transfer Bank</CardTitle>
                  <CardDescription>Pilih bank untuk top up via transfer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {banks.map((bank) => (
                      <Button
                        key={bank.id}
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all bg-transparent"
                        onClick={() => handleSelectProvider(bank.id)}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            bank.color,
                          )}
                        >
                          {bank.name.slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium">{bank.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retail" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gerai Retail</CardTitle>
                  <CardDescription>Top up di minimarket & gerai terdekat</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {retailers.map((retailer) => (
                      <Button
                        key={retailer.id}
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all bg-transparent"
                        onClick={() => handleSelectProvider(retailer.id)}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            retailer.color,
                          )}
                        >
                          {retailer.name.slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium text-center">{retailer.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="card" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kartu Kredit/Debit</CardTitle>
                  <CardDescription>Top up menggunakan kartu Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {creditCards.map((card) => (
                      <Button
                        key={card.id}
                        variant="outline"
                        className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5 transition-all bg-transparent"
                        onClick={() => handleSelectProvider(card.id)}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            card.color,
                          )}
                        >
                          {card.name.slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium">{card.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qris" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">QRIS</CardTitle>
                  <CardDescription>Scan QR untuk top up dari e-wallet manapun</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-lg mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-white" />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm text-center">
                    Scan QR code ini menggunakan aplikasi e-wallet atau mobile banking Anda
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setMethod("qris")
                      setSelectedProvider("qris")
                      setStep("select-amount")
                    }}
                  >
                    Lanjutkan dengan QRIS
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Step: Select Amount */}
      {step === "select-amount" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Jumlah Top Up</CardTitle>
            <CardDescription>Pilih atau masukkan nominal top up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Nominal</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 text-xl h-14 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                  className={cn(
                    "text-xs transition-all",
                    amount === amt.toString() && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  {amt >= 1000000 ? `${amt / 1000000}Jt` : `${amt / 1000}Rb`}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <span className="text-sm text-muted-foreground">Biaya Admin</span>
              <span className="font-medium text-green-600">GRATIS</span>
            </div>

            <Button
              className="w-full h-12"
              onClick={handleAmountSubmit}
              disabled={!amount || Number.parseInt(amount) < 10000}
            >
              Lanjutkan
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Payment Details */}
      {step === "payment-details" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Detail Pembayaran</CardTitle>
            <CardDescription>Selesaikan pembayaran dalam 24 jam</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Metode</span>
                <Badge variant="secondary">
                  {method === "bank"
                    ? banks.find((b) => b.id === selectedProvider)?.name
                    : method === "retail"
                      ? retailers.find((r) => r.id === selectedProvider)?.name
                      : method === "card"
                        ? creditCards.find((c) => c.id === selectedProvider)?.name
                        : "QRIS"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Nomor Virtual Account</span>
                <div className="flex items-center gap-2">
                  <code className="bg-background px-3 py-1 rounded font-mono text-sm">{virtualAccount}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(virtualAccount)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jumlah Transfer</span>
                <span className="font-bold text-lg">{formatCurrency(Number.parseInt(amount))}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-lg text-amber-600">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Bayar sebelum 24 jam untuk menghindari pembatalan</span>
            </div>

            <Button className="w-full h-12" onClick={handleConfirmPayment}>
              Saya Sudah Transfer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <Card className="animate-in fade-in duration-300">
          <CardContent className="py-16 flex flex-col items-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Memproses Pembayaran...</p>
            <p className="text-muted-foreground text-sm">Mohon tunggu sebentar</p>
          </CardContent>
        </Card>
      )}

      {/* Step: Success */}
      {step === "success" && (
        <Card className="animate-in zoom-in duration-300">
          <CardContent className="py-12 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-xl font-bold mb-2">Top Up Berhasil!</p>
            <p className="text-muted-foreground text-center mb-4">
              Saldo Anda telah bertambah {formatCurrency(Number.parseInt(amount))}
            </p>
            <p className="text-2xl font-bold text-primary mb-6">{formatCurrency(wallet?.balanceMain || 0)}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>
                Top Up Lagi
              </Button>
              <Button onClick={() => router.push("/dashboard")}>Ke Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
