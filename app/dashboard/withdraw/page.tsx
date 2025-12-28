"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Search, AlertCircle } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// All Indonesian Banks for withdrawal
const withdrawBanks = [
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
  { id: "jenius", name: "Jenius/BTPN", code: "213", color: "bg-cyan-600" },
  { id: "jago", name: "Bank Jago", code: "542", color: "bg-blue-500" },
  { id: "blu", name: "blu by BCA", code: "501", color: "bg-blue-600" },
  { id: "seabank", name: "SeaBank", code: "535", color: "bg-teal-600" },
  { id: "neo", name: "Bank Neo", code: "490", color: "bg-purple-600" },
  { id: "line", name: "LINE Bank", code: "484", color: "bg-green-500" },
  { id: "allo", name: "Allo Bank", code: "567", color: "bg-purple-500" },
]

// Saved accounts
const savedAccounts = [
  { id: 1, name: "John Doe", bank: "BCA", account: "1234567890", isDefault: true },
  { id: 2, name: "John Doe", bank: "Mandiri", account: "0987654321", isDefault: false },
]

const withdrawFee = 6500
const minWithdraw = 50000

type WithdrawStep = "select-account" | "input-amount" | "confirm" | "processing" | "success"

export default function WithdrawPage() {
  const router = useRouter()
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [step, setStep] = React.useState<WithdrawStep>("select-account")
  const [selectedBank, setSelectedBank] = React.useState<string>("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [accountName, setAccountName] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [searchBank, setSearchBank] = React.useState("")
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [showNewAccount, setShowNewAccount] = React.useState(false)

  const filteredBanks = withdrawBanks.filter((bank) => bank.name.toLowerCase().includes(searchBank.toLowerCase()))

  const selectedBankData = withdrawBanks.find((b) => b.id === selectedBank)
  const maxWithdraw = (wallet?.balanceMain || 0) - withdrawFee

  const handleSelectSavedAccount = (account: (typeof savedAccounts)[0]) => {
    const bank = withdrawBanks.find((b) => b.name === account.bank)
    if (bank) {
      setSelectedBank(bank.id)
      setAccountNumber(account.account)
      setAccountName(account.name.toUpperCase())
      setStep("input-amount")
    }
  }

  const handleVerifyAccount = async () => {
    if (!accountNumber || accountNumber.length < 8) {
      toast.error("Masukkan nomor rekening yang valid")
      return
    }
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setAccountName("JOHN DOE")
    setIsVerifying(false)
    toast.success("Rekening terverifikasi!")
  }

  const handleContinueToAmount = () => {
    if (!accountName) {
      toast.error("Verifikasi rekening terlebih dahulu")
      return
    }
    setStep("input-amount")
  }

  const handleConfirmWithdraw = () => {
    const withdrawAmount = Number.parseInt(amount)
    if (!amount || withdrawAmount < minWithdraw) {
      toast.error(`Minimum penarikan ${formatCurrency(minWithdraw)}`)
      return
    }
    if (withdrawAmount > maxWithdraw) {
      toast.error("Saldo tidak mencukupi")
      return
    }
    setStep("confirm")
  }

  const handleProcessWithdraw = async () => {
    setStep("processing")

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const withdrawAmount = Number.parseInt(amount)
    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) - withdrawAmount - withdrawFee,
    })

    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "withdraw",
      amount: -withdrawAmount,
      fee: withdrawFee,
      status: "success",
      description: `Tarik Dana ke ${selectedBankData?.name} - ${accountNumber}`,
      createdAt: new Date(),
    })

    setStep("success")
    toast.success("Penarikan berhasil diproses!")
  }

  const resetForm = () => {
    setStep("select-account")
    setSelectedBank("")
    setAccountNumber("")
    setAccountName("")
    setAmount("")
    setSearchBank("")
    setShowNewAccount(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === "select-account" ? router.back() : resetForm())}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tarik Dana</h1>
          <p className="text-muted-foreground text-sm">Tarik saldo ke rekening bank</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-500 border-0 text-white">
        <CardContent className="p-6">
          <p className="text-sm text-white/80">Saldo Dapat Ditarik</p>
          <p className="text-3xl font-bold">{formatCurrency(maxWithdraw > 0 ? maxWithdraw : 0)}</p>
          <p className="text-xs text-white/60 mt-1">Biaya admin: {formatCurrency(withdrawFee)}</p>
        </CardContent>
      </Card>

      {/* Step: Select Account */}
      {step === "select-account" && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          {/* Saved Accounts */}
          {savedAccounts.length > 0 && !showNewAccount && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rekening Tersimpan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedAccounts.map((account) => (
                  <Button
                    key={account.id}
                    variant="outline"
                    className="w-full justify-start gap-4 h-auto py-4 hover:border-primary transition-all bg-transparent"
                    onClick={() => handleSelectSavedAccount(account)}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold",
                        withdrawBanks.find((b) => b.name === account.bank)?.color || "bg-gray-500",
                      )}
                    >
                      {account.bank.slice(0, 2)}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.bank} - {account.account}
                      </p>
                    </div>
                    {account.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Utama
                      </Badge>
                    )}
                  </Button>
                ))}
                <Button variant="ghost" className="w-full mt-2" onClick={() => setShowNewAccount(true)}>
                  + Tambah Rekening Baru
                </Button>
              </CardContent>
            </Card>
          )}

          {/* New Account */}
          {(showNewAccount || savedAccounts.length === 0) && (
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
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-[250px] overflow-y-auto mb-4">
                  {filteredBanks.map((bank) => (
                    <Button
                      key={bank.id}
                      variant="outline"
                      className={cn(
                        "h-auto py-3 flex-col gap-1.5 transition-all",
                        selectedBank === bank.id && "border-primary bg-primary/5",
                      )}
                      onClick={() => setSelectedBank(bank.id)}
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

                {selectedBank && (
                  <div className="space-y-4 pt-4 border-t">
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
                        <Button
                          variant="outline"
                          onClick={handleVerifyAccount}
                          disabled={isVerifying || !accountNumber}
                        >
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
                    <Button className="w-full" onClick={handleContinueToAmount} disabled={!accountName}>
                      Lanjutkan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step: Input Amount */}
      {step === "input-amount" && (
        <Card className="animate-in slide-in-from-right duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                  selectedBankData?.color,
                )}
              >
                {selectedBankData?.name.slice(0, 2)}
              </div>
              <div>
                <p>{selectedBankData?.name}</p>
                <p className="text-xs text-muted-foreground font-normal">
                  {accountNumber} - {accountName}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Jumlah Penarikan</Label>
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
              <p className="text-xs text-muted-foreground">
                Min. {formatCurrency(minWithdraw)} - Maks. {formatCurrency(maxWithdraw)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[100000, 250000, 500000, 1000000, 2500000, 5000000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(Math.min(amt, maxWithdraw).toString())}
                  disabled={amt > maxWithdraw}
                  className={cn(
                    "text-xs transition-all",
                    amount === amt.toString() && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  {amt >= 1000000 ? `${amt / 1000000}Jt` : `${amt / 1000}Rb`}
                </Button>
              ))}
            </div>

            <Button variant="ghost" size="sm" className="w-full" onClick={() => setAmount(maxWithdraw.toString())}>
              Tarik Semua ({formatCurrency(maxWithdraw)})
            </Button>

            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jumlah Penarikan</span>
                <span>{amount ? formatCurrency(Number.parseInt(amount)) : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span>{formatCurrency(withdrawFee)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Dipotong</span>
                  <span className="text-primary">
                    {amount ? formatCurrency(Number.parseInt(amount) + withdrawFee) : "-"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12"
              onClick={handleConfirmWithdraw}
              disabled={!amount || Number.parseInt(amount) < minWithdraw}
            >
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
            <CardTitle className="text-lg">Konfirmasi Penarikan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-xl space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bank Tujuan</span>
                <span className="font-medium">{selectedBankData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">No. Rekening</span>
                <span className="font-medium font-mono">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nama Pemilik</span>
                <span className="font-medium">{accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Jumlah Ditarik</span>
                <span className="font-bold text-lg">{formatCurrency(Number.parseInt(amount))}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total + Biaya</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(Number.parseInt(amount) + withdrawFee)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-600">Dana akan masuk ke rekening dalam 1x24 jam kerja</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("input-amount")}>
                Ubah
              </Button>
              <Button className="flex-1" onClick={handleProcessWithdraw}>
                Konfirmasi
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
            <p className="text-lg font-medium">Memproses Penarikan...</p>
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
            <p className="text-xl font-bold mb-2">Penarikan Diproses!</p>
            <p className="text-muted-foreground text-center mb-2">
              {formatCurrency(Number.parseInt(amount))} akan dikirim ke
            </p>
            <p className="font-medium text-center mb-2">
              {selectedBankData?.name} - {accountNumber}
            </p>
            <p className="text-sm text-muted-foreground text-center mb-6">Estimasi dana masuk: 1x24 jam kerja</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>
                Tarik Lagi
              </Button>
              <Button onClick={() => router.push("/dashboard")}>Ke Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
