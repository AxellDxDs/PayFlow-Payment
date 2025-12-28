"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { ArrowLeft, Building2, CheckCircle2, ChevronRight, Loader2, Search, Star, Wallet } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// All Indonesian Banks
const allBanks = [
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
  { id: "bpd", name: "BPD", code: "110", color: "bg-indigo-600" },
  { id: "bjb", name: "BJB", code: "110", color: "bg-green-700" },
  { id: "dki", name: "Bank DKI", code: "111", color: "bg-orange-700" },
  { id: "muamalat", name: "Muamalat", code: "147", color: "bg-green-800" },
  { id: "bukopin", name: "Bukopin", code: "441", color: "bg-blue-600" },
  { id: "commonwealth", name: "Commonwealth", code: "950", color: "bg-yellow-600" },
  { id: "citibank", name: "Citibank", code: "031", color: "bg-blue-500" },
  { id: "standard", name: "Standard Chartered", code: "050", color: "bg-green-600" },
]

// Recent contacts
const recentContacts = [
  { id: 1, name: "Ahmad Fauzi", bank: "BCA", account: "1234567890", avatar: "AF", isFavorite: true },
  { id: 2, name: "Siti Rahayu", bank: "BNI", account: "0987654321", avatar: "SR", isFavorite: true },
  { id: 3, name: "Budi Santoso", bank: "Mandiri", account: "1122334455", avatar: "BS", isFavorite: false },
  { id: 4, name: "Dewi Lestari", bank: "BRI", account: "5544332211", avatar: "DL", isFavorite: false },
  { id: 5, name: "Rudi Hartono", bank: "CIMB", account: "6677889900", avatar: "RH", isFavorite: true },
]

type TransferStep = "select-type" | "select-bank" | "input-details" | "confirm" | "processing" | "success"

export default function TransferPage() {
  const router = useRouter()
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [step, setStep] = React.useState<TransferStep>("select-type")
  const [transferType, setTransferType] = React.useState<"bank" | "payflow">("bank")
  const [selectedBank, setSelectedBank] = React.useState<string>("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [accountName, setAccountName] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [searchBank, setSearchBank] = React.useState("")
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const filteredBanks = allBanks.filter((bank) => bank.name.toLowerCase().includes(searchBank.toLowerCase()))

  const selectedBankData = allBanks.find((b) => b.id === selectedBank)
  const transferFee = transferType === "payflow" ? 0 : 2500

  const handleVerifyAccount = async () => {
    if (!accountNumber || accountNumber.length < 8) {
      toast.error("Masukkan nomor rekening yang valid")
      return
    }
    setIsVerifying(true)
    // Simulate account verification
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setAccountName("JOHN DOE") // Simulated account name
    setIsVerifying(false)
    toast.success("Rekening terverifikasi!")
  }

  const handleSelectContact = (contact: (typeof recentContacts)[0]) => {
    const bank = allBanks.find((b) => b.name === contact.bank)
    if (bank) {
      setSelectedBank(bank.id)
      setAccountNumber(contact.account)
      setAccountName(contact.name.toUpperCase())
      setStep("input-details")
    }
  }

  const handleConfirmTransfer = async () => {
    if (!amount || Number.parseInt(amount) < 10000) {
      toast.error("Minimum transfer Rp10.000")
      return
    }
    if (Number.parseInt(amount) > (wallet?.balanceMain || 0)) {
      toast.error("Saldo tidak mencukupi")
      return
    }
    setStep("confirm")
  }

  const handleProcessTransfer = async () => {
    setStep("processing")
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const transferAmount = Number.parseInt(amount)
    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) - transferAmount - transferFee,
    })

    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "transfer",
      amount: -transferAmount,
      fee: transferFee,
      status: "success",
      description: `Transfer ke ${accountName} - ${selectedBankData?.name}`,
      recipient: accountNumber,
      createdAt: new Date(),
    })

    setIsProcessing(false)
    setStep("success")
    toast.success("Transfer berhasil!")
  }

  const resetForm = () => {
    setStep("select-type")
    setSelectedBank("")
    setAccountNumber("")
    setAccountName("")
    setAmount("")
    setNotes("")
    setSearchBank("")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === "select-type" ? router.back() : resetForm())}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Transfer</h1>
          <p className="text-muted-foreground text-sm">Kirim uang ke mana saja</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 text-white">
        <CardContent className="p-6">
          <p className="text-sm text-white/80">Saldo Tersedia</p>
          <p className="text-3xl font-bold">{formatCurrency(wallet?.balanceMain || 0)}</p>
        </CardContent>
      </Card>

      {/* Step: Select Transfer Type */}
      {step === "select-type" && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <Tabs defaultValue="bank" onValueChange={(v) => setTransferType(v as typeof transferType)}>
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger
                value="bank"
                className="flex gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Building2 className="h-4 w-4" />
                <span>Transfer Bank</span>
              </TabsTrigger>
              <TabsTrigger
                value="payflow"
                className="flex gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Wallet className="h-4 w-4" />
                <span>Sesama PayFlow</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="mt-6 space-y-6">
              {/* Recent & Favorites */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Transfer Terakhir & Favorit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {recentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => handleSelectContact(contact)}
                        className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{contact.avatar}</span>
                          </div>
                          {contact.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-center truncate w-full">
                          {contact.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{contact.bank}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Select Bank */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pilih Bank Tujuan</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari bank..."
                      value={searchBank}
                      onChange={(e) => setSearchBank(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-[300px] overflow-y-auto">
                    {filteredBanks.map((bank) => (
                      <Button
                        key={bank.id}
                        variant="outline"
                        className={cn(
                          "h-auto py-3 flex-col gap-1.5 transition-all",
                          selectedBank === bank.id && "border-primary bg-primary/5",
                        )}
                        onClick={() => {
                          setSelectedBank(bank.id)
                          setStep("input-details")
                        }}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                            bank.color,
                          )}
                        >
                          {bank.name.slice(0, 2)}
                        </div>
                        <span className="text-[10px] font-medium text-center leading-tight">{bank.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payflow" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Transfer ke Pengguna PayFlow</CardTitle>
                  <CardDescription>Gratis biaya admin untuk sesama pengguna</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nomor HP / Username</Label>
                    <Input
                      placeholder="Contoh: 081234567890 atau @username"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (accountNumber) {
                        setAccountName("USER PAYFLOW")
                        setStep("input-details")
                      }
                    }}
                    disabled={!accountNumber}
                  >
                    Cari Pengguna
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Step: Input Details */}
      {step === "input-details" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedBankData && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    selectedBankData.color,
                  )}
                >
                  {selectedBankData.name.slice(0, 2)}
                </div>
              )}
              {selectedBankData?.name || "PayFlow"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Masukkan nomor rekening"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value)
                    setAccountName("")
                  }}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleVerifyAccount} disabled={isVerifying || !accountNumber}>
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cek"}
                </Button>
              </div>
              {accountName && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{accountName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Jumlah Transfer</Label>
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

            <div className="space-y-2">
              <Label>Catatan (opsional)</Label>
              <Input placeholder="Tambahkan catatan..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nominal</span>
                <span>{amount ? formatCurrency(Number.parseInt(amount)) : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span>{transferType === "payflow" ? "GRATIS" : formatCurrency(transferFee)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{amount ? formatCurrency(Number.parseInt(amount) + transferFee) : "-"}</span>
                </div>
              </div>
            </div>

            <Button className="w-full h-12" onClick={handleConfirmTransfer} disabled={!accountName || !amount}>
              Lanjutkan
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Konfirmasi Transfer</CardTitle>
            <CardDescription>Periksa detail transfer Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-xl space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bank Tujuan</span>
                <span className="font-medium">{selectedBankData?.name || "PayFlow"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">No. Rekening</span>
                <span className="font-medium font-mono">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nama Penerima</span>
                <span className="font-medium">{accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Jumlah</span>
                <span className="font-bold text-lg">{formatCurrency(Number.parseInt(amount))}</span>
              </div>
              {notes && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Catatan</span>
                  <span className="text-sm">{notes}</span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total + Biaya</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(Number.parseInt(amount) + transferFee)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("input-details")}>
                Ubah
              </Button>
              <Button className="flex-1" onClick={handleProcessTransfer}>
                Konfirmasi Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <Card className="animate-in fade-in duration-300">
          <CardContent className="py-16 flex flex-col items-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Memproses Transfer...</p>
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
            <p className="text-xl font-bold mb-2">Transfer Berhasil!</p>
            <p className="text-muted-foreground text-center mb-2">
              {formatCurrency(Number.parseInt(amount))} telah dikirim ke
            </p>
            <p className="font-medium text-center mb-6">{accountName}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>
                Transfer Lagi
              </Button>
              <Button onClick={() => router.push("/dashboard")}>Ke Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
