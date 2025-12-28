"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { useLanguage } from "@/lib/i18n/language-context"
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format"
import { TransactionReceipt } from "@/components/transactions/transaction-receipt"
import type { Transaction, TransactionType } from "@/lib/types"
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Zap,
  UtensilsCrossed,
  Bitcoin,
  Gift,
  Receipt,
  ChevronRight,
} from "@/components/icons"
import { cn } from "@/lib/utils"

const transactionIcons: Record<TransactionType, React.ReactNode> = {
  topup: <ArrowUpRight className="h-4 w-4" />,
  transfer: <ArrowDownLeft className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  withdraw: <ArrowDownLeft className="h-4 w-4" />,
  pulsa: <Smartphone className="h-4 w-4" />,
  bills: <Zap className="h-4 w-4" />,
  food: <UtensilsCrossed className="h-4 w-4" />,
  crypto: <Bitcoin className="h-4 w-4" />,
  cashback: <Gift className="h-4 w-4" />,
  reward: <Gift className="h-4 w-4" />,
}

const transactionColors: Record<TransactionType, string> = {
  topup: "bg-green-500/10 text-green-500",
  transfer: "bg-blue-500/10 text-blue-500",
  payment: "bg-purple-500/10 text-purple-500",
  withdraw: "bg-orange-500/10 text-orange-500",
  pulsa: "bg-red-500/10 text-red-500",
  bills: "bg-yellow-500/10 text-yellow-500",
  food: "bg-emerald-500/10 text-emerald-500",
  crypto: "bg-amber-500/10 text-amber-500",
  cashback: "bg-pink-500/10 text-pink-500",
  reward: "bg-cyan-500/10 text-cyan-500",
}

export function RecentTransactions() {
  const { transactions } = useAppStore()
  const { t } = useLanguage()
  const recentTransactions = transactions.slice(0, 10)
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
  const [receiptOpen, setReceiptOpen] = React.useState(false)

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setReceiptOpen(true)
  }

  const handleCloseReceipt = () => {
    setReceiptOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">{t.dashboard.recentTransactions}</CardTitle>
          <Link href="/dashboard/transactions">
            <Button variant="ghost" size="sm" className="gap-1">
              {t.dashboard.viewAll}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => handleTransactionClick(tx)}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div
                  className={cn("h-10 w-10 rounded-full flex items-center justify-center", transactionColors[tx.type])}
                >
                  {transactionIcons[tx.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(tx.createdAt)}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className={cn("text-sm font-semibold", tx.amount > 0 ? "text-green-500" : "text-foreground")}>
                      {tx.amount > 0 ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge
                      variant={tx.status === "success" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        tx.status === "success" && "bg-green-500/10 text-green-500 hover:bg-green-500/20",
                      )}
                    >
                      {t.transactions.status[tx.status]}
                    </Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t.transactions.noTransactions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {selectedTransaction && <TransactionReceipt transaction={selectedTransaction} onClose={handleCloseReceipt} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
