"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TransactionReceipt } from "@/components/transactions/transaction-receipt"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAppStore } from "@/lib/store"
import { useLanguage } from "@/lib/i18n/language-context"
import { formatCurrency } from "@/lib/utils/format"
import type { Transaction } from "@/lib/types"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Receipt,
  Search,
  Filter,
  Download,
  ShoppingBag,
  Zap,
  Gamepad2,
  Coffee,
  Bitcoin,
  CreditCard,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  Plane,
  Train,
  Car,
  Heart,
  Shield,
  Home,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const transactionIcons: Record<string, React.ElementType> = {
  topup: ArrowDownLeft,
  transfer: Send,
  payment: Receipt,
  withdraw: ArrowUpRight,
  food: Coffee,
  pulsa: Zap,
  game: Gamepad2,
  shopping: ShoppingBag,
  crypto: Bitcoin,
  bills: CreditCard,
  cashback: ArrowDownLeft,
  reward: ArrowDownLeft,
  travel: Plane,
  train: Train,
  vehicle: Car,
  donation: Heart,
  insurance: Shield,
  installment: Home,
}

const transactionColors: Record<string, string> = {
  topup: "bg-green-500/10 text-green-500",
  transfer: "bg-blue-500/10 text-blue-500",
  payment: "bg-purple-500/10 text-purple-500",
  withdraw: "bg-orange-500/10 text-orange-500",
  pulsa: "bg-red-500/10 text-red-500",
  bills: "bg-amber-500/10 text-amber-500",
  food: "bg-emerald-500/10 text-emerald-500",
  crypto: "bg-yellow-500/10 text-yellow-500",
  cashback: "bg-green-500/10 text-green-500",
  reward: "bg-pink-500/10 text-pink-500",
  travel: "bg-sky-500/10 text-sky-500",
  train: "bg-orange-500/10 text-orange-500",
  vehicle: "bg-slate-500/10 text-slate-500",
  donation: "bg-rose-500/10 text-rose-500",
  insurance: "bg-teal-500/10 text-teal-500",
  installment: "bg-indigo-500/10 text-indigo-500",
}

const filterOptions = [
  { value: "all", label: "Semua" },
  { value: "topup", label: "Top Up" },
  { value: "transfer", label: "Transfer" },
  { value: "payment", label: "Pembayaran" },
  { value: "withdraw", label: "Tarik Dana" },
  { value: "food", label: "Makanan" },
  { value: "pulsa", label: "Pulsa" },
  { value: "bills", label: "Tagihan" },
  { value: "crypto", label: "Crypto" },
]

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "highest", label: "Nominal Tertinggi" },
  { value: "lowest", label: "Nominal Terendah" },
]

export default function HistoryPage() {
  const { transactions } = useAppStore()
  const { t } = useLanguage()
  const [filter, setFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("newest")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({})
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
  const [receiptOpen, setReceiptOpen] = React.useState(false)

  // Calculate statistics
  const stats = React.useMemo(() => {
    const thisMonth = transactions.filter((tx) => {
      const txDate = new Date(tx.createdAt)
      const now = new Date()
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
    })

    const income = thisMonth.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0)
    const expense = thisMonth.filter((tx) => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

    return {
      totalTransactions: thisMonth.length,
      income,
      expense,
      balance: income - expense,
    }
  }, [transactions])

  // Filter and sort transactions
  const filteredTransactions = React.useMemo(() => {
    let result = [...transactions]

    // Apply type filter
    if (filter !== "all") {
      result = result.filter((tx) => tx.type === filter)
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter((tx) => tx.description.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply date range filter
    if (dateRange.from) {
      result = result.filter((tx) => new Date(tx.createdAt) >= dateRange.from!)
    }
    if (dateRange.to) {
      result = result.filter((tx) => new Date(tx.createdAt) <= dateRange.to!)
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "highest":
        result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        break
      case "lowest":
        result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
        break
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [transactions, filter, searchQuery, dateRange, sortBy])

  // Group transactions by date
  const groupedTransactions = React.useMemo(() => {
    const groups: Record<string, Transaction[]> = {}

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(tx)
    })

    return groups
  }, [filteredTransactions])

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setReceiptOpen(true)
  }

  const handleCloseReceipt = () => {
    setReceiptOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">Lihat semua aktivitas transaksi Anda</p>
        </div>
      </ScrollAnimation>

      {/* Statistics Cards */}
      <ScrollAnimation animation="fade-up" delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Transaksi</p>
                  <p className="text-xl font-bold">{stats.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pemasukan</p>
                  <p className="text-lg font-bold text-green-500">{formatCurrency(stats.income)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pengeluaran</p>
                  <p className="text-lg font-bold text-red-500">{formatCurrency(stats.expense)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Selisih</p>
                  <p className={cn("text-lg font-bold", stats.balance >= 0 ? "text-green-500" : "text-red-500")}>
                    {stats.balance >= 0 ? "+" : ""}
                    {formatCurrency(stats.balance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>

      {/* Filters */}
      <ScrollAnimation animation="fade-up" delay={200}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari transaksi..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <CalendarIcon className="h-4 w-4" />
                      {dateRange.from
                        ? dateRange.to
                          ? `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`
                          : format(dateRange.from, "dd MMM", { locale: id })
                        : "Pilih Tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button variant="outline" size="icon" className="bg-transparent">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? "default" : "outline"}
                  size="sm"
                  className={cn(filter !== option.value && "bg-transparent")}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Transaction List */}
      <ScrollAnimation animation="fade-up" delay={300}>
        <div className="space-y-6">
          {Object.keys(groupedTransactions).length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
                  <p className="text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedTransactions).map(([date, txs], groupIndex) => (
              <ScrollAnimation key={date} animation="fade-up" delay={groupIndex * 50}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">{date}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {txs.length} transaksi
                    </Badge>
                  </div>

                  <Card>
                    <CardContent className="p-0 divide-y divide-border">
                      {txs.map((tx, index) => {
                        const Icon = transactionIcons[tx.type] || Receipt
                        const isIncome = tx.amount > 0
                        const colorClass = transactionColors[tx.type] || "bg-gray-500/10 text-gray-500"

                        return (
                          <ScrollAnimation key={tx.id} animation="fade-left" delay={index * 30}>
                            <div
                              onClick={() => handleTransactionClick(tx)}
                              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                            >
                              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", colorClass)}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{tx.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(tx.createdAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <div>
                                  <p className={cn("font-semibold", isIncome ? "text-green-500" : "text-red-500")}>
                                    {isIncome ? "+" : ""}
                                    {formatCurrency(tx.amount)}
                                  </p>
                                  <Badge
                                    variant={
                                      tx.status === "success"
                                        ? "default"
                                        : tx.status === "pending"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {tx.status === "success"
                                      ? "Berhasil"
                                      : tx.status === "pending"
                                        ? "Pending"
                                        : "Gagal"}
                                  </Badge>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </ScrollAnimation>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              </ScrollAnimation>
            ))
          )}
        </div>
      </ScrollAnimation>

      {/* Transaction Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {selectedTransaction && <TransactionReceipt transaction={selectedTransaction} onClose={handleCloseReceipt} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
