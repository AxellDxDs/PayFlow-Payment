"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { useLanguage } from "@/lib/i18n/language-context"
import { TransactionReceipt } from "@/components/transactions/transaction-receipt"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  QrCode,
  CreditCard,
  Building2,
  Clock,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  TrendingUp,
  PiggyBank,
  Coins,
  RefreshCw,
  History,
  Shield,
  Loader2,
  ChevronRight,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const bankOptions = [
  { name: "BCA", code: "014" },
  { name: "BNI", code: "009" },
  { name: "BRI", code: "002" },
  { name: "Mandiri", code: "008" },
  { name: "CIMB Niaga", code: "022" },
  { name: "Permata", code: "013" },
]

const recentTransfers = [
  { id: 1, name: "Ahmad Fauzi", bank: "BCA", account: "****4521", avatar: "AF" },
  { id: 2, name: "Siti Rahayu", bank: "BNI", account: "****7832", avatar: "SR" },
  { id: 3, name: "Budi Santoso", bank: "Mandiri", account: "****1234", avatar: "BS" },
]

const quickActions = [
  {
    id: "qris",
    icon: QrCode,
    label: "Scan QR",
    href: "/dashboard/qris",
    color: "text-primary",
  },
  {
    id: "request",
    icon: ArrowDownLeft,
    label: "Minta Uang",
    href: "/dashboard/transfer",
    color: "text-green-500",
  },
  {
    id: "exchange-points",
    icon: RefreshCw,
    label: "Tukar Poin",
    href: "/dashboard/exchange-points",
    color: "text-blue-500",
  },
  {
    id: "security",
    icon: Shield,
    label: "Keamanan",
    href: "/dashboard/settings",
    color: "text-orange-500",
  },
]

export default function WalletPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { wallet, transactions, updateWallet, addTransaction } = useAppStore()
  const [showBalance, setShowBalance] = React.useState(true)
  const [topupAmount, setTopupAmount] = React.useState("")
  const [transferAmount, setTransferAmount] = React.useState("")
  const [selectedBank, setSelectedBank] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [isTopupDialogOpen, setIsTopupDialogOpen] = React.useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = React.useState(false)

  const [isProcessing, setIsProcessing] = React.useState(false)
  const [showReceipt, setShowReceipt] = React.useState(false)
  const [lastTransaction, setLastTransaction] = React.useState<any>(null)
  const [topupMethod, setTopupMethod] = React.useState<"bank" | "card">("bank")
  const [selectedTopupBank, setSelectedTopupBank] = React.useState("")

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

  const walletNumber = "6281234567890"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Berhasil disalin!")
  }

  const recentWalletTransactions = transactions
    .filter((t) => t.category === "transfer" || t.category === "topup" || t.type === "topup")
    .slice(0, 5)

  const handleTopUp = async () => {
    if (!topupAmount || Number(topupAmount) < 10000) {
      toast.error("Minimum top up Rp 10.000")
      return
    }

    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const amount = Number(topupAmount)
    const transactionId = `TXN${Date.now()}`
    const reference = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Update wallet
    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) + amount,
    })

    // Create transaction
    const newTransaction = {
      id: transactionId,
      userId: "user-1",
      type: "topup" as const,
      category: "topup",
      amount: amount,
      fee: 0,
      status: "success",
      description: `Top Up via ${topupMethod === "bank" ? bankOptions.find((b) => b.code === selectedTopupBank)?.name || "Bank" : "Kartu Kredit"}`,
      createdAt: new Date(),
      paymentMethod:
        topupMethod === "bank" ? bankOptions.find((b) => b.code === selectedTopupBank)?.name : "Kartu Kredit",
      reference: reference,
    }

    addTransaction(newTransaction)
    setLastTransaction(newTransaction)

    setIsProcessing(false)
    setIsTopupDialogOpen(false)
    setShowReceipt(true)

    // Reset form
    setTopupAmount("")
    setSelectedTopupBank("")

    toast.success("Top up berhasil!")
  }

  const handleTransfer = async () => {
    if (!transferAmount || !selectedBank || !accountNumber) {
      toast.error("Lengkapi semua data transfer")
      return
    }

    const amount = Number(transferAmount)
    if (amount > (wallet?.balanceMain || 0)) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transactionId = `TXN${Date.now()}`
    const reference = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Update wallet
    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) - amount,
    })

    // Create transaction
    const newTransaction = {
      id: transactionId,
      userId: "user-1",
      type: "debit" as const,
      category: "transfer",
      amount: amount,
      fee: 0,
      status: "success",
      description: `Transfer ke ${bankOptions.find((b) => b.code === selectedBank)?.name} - ${accountNumber}`,
      createdAt: new Date(),
      recipient: "Penerima",
      recipientBank: bankOptions.find((b) => b.code === selectedBank)?.name,
      recipientAccount: accountNumber,
      reference: reference,
    }

    addTransaction(newTransaction)
    setLastTransaction(newTransaction)

    setIsProcessing(false)
    setIsTransferDialogOpen(false)
    setShowReceipt(true)

    // Reset form
    setTransferAmount("")
    setSelectedBank("")
    setAccountNumber("")

    toast.success("Transfer berhasil!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dompet Saya</h1>
        <p className="text-muted-foreground">Kelola saldo dan transfer uang dengan mudah</p>
      </div>

      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/60 border-0 text-white overflow-hidden relative">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-white/80">Total Saldo PayFlow</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl sm:text-4xl font-bold">
                  {showBalance ? formatCurrency(wallet?.balanceMain || 0) : "Rp ******"}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>Nomor Dompet:</span>
                <code className="bg-white/10 px-2 py-0.5 rounded">{walletNumber}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => copyToClipboard(walletNumber)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isTopupDialogOpen} onOpenChange={setIsTopupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Top Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Top Up Saldo</DialogTitle>
                    <DialogDescription>Pilih metode dan jumlah top up</DialogDescription>
                  </DialogHeader>

                  {isProcessing ? (
                    <div className="py-12 flex flex-col items-center">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="font-medium">Memproses Top Up...</p>
                      <p className="text-sm text-muted-foreground">Mohon tunggu sebentar</p>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Jumlah Top Up</Label>
                        <Input
                          type="number"
                          placeholder="Masukkan jumlah"
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setTopupAmount(amount.toString())}
                            className={cn(topupAmount === amount.toString() && "border-primary bg-primary/10")}
                          >
                            {formatCurrency(amount)}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label>Metode Pembayaran</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start gap-2 h-auto py-3 bg-transparent",
                              topupMethod === "bank" && "border-primary bg-primary/10",
                            )}
                            onClick={() => setTopupMethod("bank")}
                          >
                            <Building2 className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Transfer Bank</p>
                              <p className="text-xs text-muted-foreground">BCA, BNI, BRI, dll</p>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start gap-2 h-auto py-3 bg-transparent",
                              topupMethod === "card" && "border-primary bg-primary/10",
                            )}
                            onClick={() => setTopupMethod("card")}
                          >
                            <CreditCard className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <p className="font-medium text-sm">Kartu Kredit</p>
                              <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                            </div>
                          </Button>
                        </div>
                      </div>

                      {topupMethod === "bank" && (
                        <div className="space-y-2">
                          <Label>Pilih Bank</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {bankOptions.map((bank) => (
                              <Button
                                key={bank.code}
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTopupBank(bank.code)}
                                className={cn(selectedTopupBank === bank.code && "border-primary bg-primary/10")}
                              >
                                {bank.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        disabled={!topupAmount || (topupMethod === "bank" && !selectedTopupBank)}
                        onClick={handleTopUp}
                      >
                        Lanjutkan Top Up
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-white text-primary hover:bg-white/90">
                    <Send className="h-4 w-4" />
                    Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Transfer Uang</DialogTitle>
                    <DialogDescription>Kirim uang ke rekening bank atau sesama pengguna</DialogDescription>
                  </DialogHeader>

                  {isProcessing ? (
                    <div className="py-12 flex flex-col items-center">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="font-medium">Memproses Transfer...</p>
                      <p className="text-sm text-muted-foreground">Mohon tunggu sebentar</p>
                    </div>
                  ) : (
                    <Tabs defaultValue="bank" className="py-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="bank">Transfer Bank</TabsTrigger>
                        <TabsTrigger value="payflow">Sesama PayFlow</TabsTrigger>
                      </TabsList>
                      <TabsContent value="bank" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Bank Tujuan</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {bankOptions.map((bank) => (
                              <Button
                                key={bank.code}
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedBank(bank.code)}
                                className={cn(selectedBank === bank.code && "border-primary bg-primary/10")}
                              >
                                {bank.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Nomor Rekening</Label>
                          <Input
                            placeholder="Masukkan nomor rekening"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Jumlah Transfer</Label>
                          <Input
                            type="number"
                            placeholder="Masukkan jumlah"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                          />
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Saldo tersedia</span>
                            <span className="font-medium">{formatCurrency(wallet?.balanceMain || 0)}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          disabled={!selectedBank || !accountNumber || !transferAmount}
                          onClick={handleTransfer}
                        >
                          Lanjutkan Transfer
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </TabsContent>
                      <TabsContent value="payflow" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Transfer Terakhir</Label>
                          <div className="space-y-2">
                            {recentTransfers.map((contact) => (
                              <Button
                                key={contact.id}
                                variant="outline"
                                className="w-full justify-start gap-3 h-auto py-3 bg-transparent"
                              >
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">{contact.avatar}</span>
                                </div>
                                <div className="text-left">
                                  <p className="font-medium">{contact.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {contact.bank} - {contact.account}
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Atau masukkan nomor PayFlow</Label>
                          <Input placeholder="Contoh: 6281234567890" />
                        </div>
                        <div className="space-y-2">
                          <Label>Jumlah Transfer</Label>
                          <Input type="number" placeholder="Masukkan jumlah" />
                        </div>
                        <Button className="w-full">Lanjutkan Transfer</Button>
                      </TabsContent>
                    </Tabs>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-5 -bottom-5 h-24 w-24 rounded-full bg-white/10" />
      </Card>

      {/* Balance Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Utama</p>
              <p className="text-lg font-bold">{formatCurrency(wallet?.balanceMain || 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Market</p>
              <p className="text-lg font-bold">{formatCurrency(wallet?.balanceMarket || 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <PiggyBank className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tabungan</p>
              <p className="text-lg font-bold">{formatCurrency(wallet?.balanceSavings || 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Coins className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Poin Rewards</p>
              <p className="text-lg font-bold">{wallet?.balancePoints?.toLocaleString() || 0} Poin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto py-4 flex-col gap-2 bg-transparent hover:bg-muted/50 transition-colors"
                onClick={() => router.push(action.href)}
              >
                <action.icon className={cn("h-6 w-6", action.color)} />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t.dashboard.recentTransactions}</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/transactions")}>
              <History className="h-4 w-4" />
              {t.dashboard.viewAll}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWalletTransactions.length > 0 ? (
                recentWalletTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          transaction.type === "credit" || transaction.type === "topup" ? "bg-green-100" : "bg-red-100",
                        )}
                      >
                        {transaction.type === "credit" || transaction.type === "topup" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-semibold",
                          transaction.type === "credit" || transaction.type === "topup"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {transaction.type === "credit" || transaction.type === "topup" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge
                        variant={
                          transaction.status === "completed" || transaction.status === "success"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {transaction.status === "completed" || transaction.status === "success" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status === "completed" || transaction.status === "success"
                          ? "Berhasil"
                          : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada transaksi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {lastTransaction && (
            <TransactionReceipt
              transaction={lastTransaction}
              onClose={() => {
                setShowReceipt(false)
                router.push("/dashboard")
              }}
              onRepeat={() => {
                setShowReceipt(false)
                if (lastTransaction.type === "topup") {
                  setIsTopupDialogOpen(true)
                } else {
                  setIsTransferDialogOpen(true)
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
