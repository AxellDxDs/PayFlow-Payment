"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TransferForm } from "@/components/transactions/transfer-form"
import { TopupForm } from "@/components/transactions/topup-form"
import { TransactionReceipt } from "@/components/transactions/transaction-receipt"
import { useAppStore } from "@/lib/store"
import { useLanguage } from "@/lib/i18n/language-context"
import { formatCurrency, formatDate } from "@/lib/utils/format"
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
} from "@/components/icons"
import { cn } from "@/lib/utils"

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
}

export default function TransactionsPage() {
  const { transactions } = useAppStore()
  const { t } = useLanguage()
  const [filter, setFilter] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
  const [receiptOpen, setReceiptOpen] = React.useState(false)

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      if (filter !== "all" && tx.type !== filter) return false
      if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [transactions, filter, searchQuery])

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setReceiptOpen(true)
  }

  const handleCloseReceipt = () => {
    setReceiptOpen(false)
    setSelectedTransaction(null)
  }

  const filterOptions = [
    { value: "all", label: t.transactions.all },
    { value: "topup", label: t.transactions.types.topup },
    { value: "transfer", label: t.transactions.types.transfer },
    { value: "payment", label: t.transactions.types.payment },
    { value: "food", label: t.transactions.types.food },
    { value: "pulsa", label: t.transactions.types.pulsa },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.transactions.title}</h1>
        <p className="text-muted-foreground">{t.transactions.subtitle}</p>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">
            <Receipt className="h-4 w-4 mr-2" />
            {t.transactions.history}
          </TabsTrigger>
          <TabsTrigger value="transfer">
            <Send className="h-4 w-4 mr-2" />
            {t.transactions.transfer}
          </TabsTrigger>
          <TabsTrigger value="topup">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            {t.transactions.topup}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>{t.transactions.history}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t.transactions.searchPlaceholder}
                      className="pl-9 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {filterOptions.map((f) => (
                  <Button
                    key={f.value}
                    variant={filter === f.value ? "default" : "outline"}
                    size="sm"
                    className={cn(filter !== f.value && "bg-transparent")}
                    onClick={() => setFilter(f.value)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">{t.transactions.noTransactions}</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const Icon = transactionIcons[tx.type] || Receipt
                    const isIncome = tx.amount > 0
                    const colorClass = transactionColors[tx.type] || "bg-gray-500/10 text-gray-500"
                    return (
                      <div
                        key={tx.id}
                        onClick={() => handleTransactionClick(tx)}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                      >
                        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", colorClass)}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{tx.description}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(tx.createdAt)}</p>
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
                              {t.transactions.status[tx.status]}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <div className="max-w-lg">
            <TransferForm />
          </div>
        </TabsContent>

        <TabsContent value="topup">
          <div className="max-w-lg">
            <TopupForm />
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {selectedTransaction && <TransactionReceipt transaction={selectedTransaction} onClose={handleCloseReceipt} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
