"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/i18n/language-context"
import { formatCurrency } from "@/lib/utils/format"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Receipt,
  Coffee,
  Zap,
  Bitcoin,
  CreditCard,
  Building2,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TransactionReceiptProps {
  transaction: any
  onClose?: () => void
  onRepeat?: () => void
  showActions?: boolean
}

const transactionIcons: Record<string, React.ElementType> = {
  topup: ArrowDownLeft,
  transfer: Send,
  payment: Receipt,
  withdraw: ArrowUpRight,
  pulsa: Zap,
  bills: CreditCard,
  food: Coffee,
  crypto: Bitcoin,
  cashback: ArrowDownLeft,
  reward: ArrowDownLeft,
  debit: ArrowUpRight,
  credit: ArrowDownLeft,
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
  debit: "bg-red-500/10 text-red-500",
  credit: "bg-green-500/10 text-green-500",
}

export function TransactionReceipt({ transaction, onClose, onRepeat, showActions = true }: TransactionReceiptProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const transactionType = transaction.type || transaction.category || "payment"
  const Icon = transactionIcons[transactionType] || Receipt
  const isIncome = transaction.type === "credit" || transaction.type === "topup"
  const receiptRef = React.useRef<HTMLDivElement>(null)

  const statusConfig = {
    success: {
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: t.receipt.transactionSuccess,
      badge: "default" as const,
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: t.receipt.transactionSuccess,
      badge: "default" as const,
    },
    failed: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      label: t.receipt.transactionFailed,
      badge: "destructive" as const,
    },
    pending: {
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      label: t.receipt.transactionPending,
      badge: "secondary" as const,
    },
    cancelled: {
      icon: XCircle,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
      label: t.transactions.status.cancelled,
      badge: "secondary" as const,
    },
  }

  const status = statusConfig[transaction.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id)
    toast.success(t.common.copied)
  }

  const transactionDate = new Date(transaction.createdAt)
  const formattedDate = transactionDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = transactionDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const handleDownload = () => {
    const receiptText = `
════════════════════════════════════════════════════════════
                        PAYFLOW
                   ${t.receipt.title.toUpperCase()}
════════════════════════════════════════════════════════════

${t.receipt.transactionId}    : ${transaction.id}
${t.receipt.date}             : ${formattedDate}
${t.receipt.time}             : ${formattedTime}
${t.receipt.type}             : ${t.transactions.types[transactionType] || transactionType}
${t.receipt.description}      : ${transaction.description}

────────────────────────────────────────────────────────────
                    DETAIL TRANSAKSI
────────────────────────────────────────────────────────────

${t.receipt.amount}           : ${formatCurrency(Math.abs(transaction.amount))}
${t.receipt.fee}              : ${transaction.fee > 0 ? formatCurrency(transaction.fee) : "GRATIS"}
────────────────────────────────────────────────────────────
${t.receipt.total}            : ${formatCurrency(Math.abs(transaction.amount) + (transaction.fee || 0))}
────────────────────────────────────────────────────────────

${t.receipt.status}           : ${t.transactions.status[transaction.status] || transaction.status}
${transaction.paymentMethod ? `${t.receipt.paymentMethod}    : ${transaction.paymentMethod}` : ""}
${transaction.recipient ? `${t.receipt.recipient}          : ${transaction.recipient}` : ""}
${transaction.recipientBank ? `${t.receipt.recipientBank}     : ${transaction.recipientBank}` : ""}
${transaction.recipientAccount ? `${t.receipt.recipientAccount}  : ${transaction.recipientAccount}` : ""}
${transaction.reference ? `${t.receipt.referenceNumber}   : ${transaction.reference}` : ""}

════════════════════════════════════════════════════════════
              Terima kasih telah menggunakan
                       PayFlow
        
     Simpan struk ini sebagai bukti transaksi Anda
════════════════════════════════════════════════════════════
    `.trim()

    const blob = new Blob([receiptText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `PayFlow-Receipt-${transaction.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(t.receipt.downloadReceipt)
  }

  const handleShare = async () => {
    const shareText = `PayFlow ${t.receipt.title}
━━━━━━━━━━━━━━━━━━━━━
${t.receipt.transactionId}: ${transaction.id}
${t.receipt.date}: ${formattedDate}
${t.receipt.time}: ${formattedTime}
${t.receipt.amount}: ${formatCurrency(Math.abs(transaction.amount))}
${t.receipt.status}: ${t.transactions.status[transaction.status] || transaction.status}
━━━━━━━━━━━━━━━━━━━━━`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `PayFlow - ${t.receipt.title}`,
          text: shareText,
        })
      } catch {
        navigator.clipboard.writeText(shareText)
        toast.success(t.common.copied)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success(t.common.copied)
    }
  }

  const handleBackToDashboard = () => {
    if (onClose) {
      onClose()
    }
    router.push("/dashboard")
  }

  const handleRepeat = () => {
    if (onRepeat) {
      onRepeat()
    } else {
      switch (transactionType) {
        case "topup":
          router.push("/dashboard/topup")
          break
        case "transfer":
          router.push("/dashboard/transfer")
          break
        case "pulsa":
          router.push("/dashboard/pulsa")
          break
        case "bills":
          router.push("/dashboard/bills")
          break
        case "food":
          router.push("/dashboard/food")
          break
        case "crypto":
          router.push("/dashboard/crypto")
          break
        default:
          router.push("/dashboard/transactions")
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden animate-in zoom-in duration-300" ref={receiptRef}>
      {/* Header with Status */}
      <div className={cn("p-6 text-center relative overflow-hidden", status.bgColor)}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)]" />
        </div>

        <div className="relative z-10">
          <div
            className={cn(
              "h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 ring-4 ring-white/20",
              status.bgColor,
            )}
          >
            <StatusIcon className={cn("h-10 w-10", status.color)} />
          </div>
          <h2 className={cn("text-xl font-bold mb-2", status.color)}>{status.label}</h2>
          <p className="text-4xl font-bold text-foreground">
            {isIncome ? "+" : "-"}
            {formatCurrency(Math.abs(transaction.amount))}
          </p>
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Transaction Type Badge */}
        <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/30 border">
          <div
            className={cn(
              "h-14 w-14 rounded-xl flex items-center justify-center",
              transactionColors[transactionType] || "bg-gray-500/10 text-gray-500",
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-lg">{t.transactions.types[transactionType] || transactionType}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{transaction.description}</p>
          </div>
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Detail Transaksi</h3>

          {/* Transaction ID */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">{t.receipt.transactionId}</span>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                {transaction.id.length > 16 ? `${transaction.id.slice(0, 16)}...` : transaction.id}
              </code>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyId}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">{t.receipt.date}</span>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">{t.receipt.time}</span>
            <span className="text-sm font-medium font-mono">{formattedTime}</span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm text-muted-foreground">{t.receipt.status}</span>
            <Badge variant={status.badge} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {t.transactions.status[transaction.status] || transaction.status}
            </Badge>
          </div>

          {/* Payment Method */}
          {transaction.paymentMethod && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">{t.receipt.paymentMethod}</span>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{transaction.paymentMethod}</span>
              </div>
            </div>
          )}

          {/* Recipient Bank */}
          {transaction.recipientBank && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">{t.receipt.recipientBank}</span>
              <span className="text-sm font-medium">{transaction.recipientBank}</span>
            </div>
          )}

          {/* Recipient Account */}
          {transaction.recipientAccount && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">{t.receipt.recipientAccount}</span>
              <span className="text-sm font-medium font-mono">{transaction.recipientAccount}</span>
            </div>
          )}

          {/* Recipient */}
          {transaction.recipient && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">{t.receipt.recipient}</span>
              <span className="text-sm font-medium">{transaction.recipient}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Amount Breakdown */}
        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Rincian Biaya</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.receipt.amount}</span>
            <span className="text-sm font-medium">{formatCurrency(Math.abs(transaction.amount))}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.receipt.fee}</span>
            <span className={cn("text-sm font-medium", !transaction.fee && "text-green-600")}>
              {transaction.fee > 0 ? formatCurrency(transaction.fee) : "GRATIS"}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.receipt.total}</span>
            <span className="font-bold text-xl text-primary">
              {formatCurrency(Math.abs(transaction.amount) + (transaction.fee || 0))}
            </span>
          </div>
        </div>

        {/* Reference Number */}
        {transaction.reference && (
          <div className="flex items-center justify-between text-xs text-muted-foreground p-2 rounded bg-muted/30">
            <span>{t.receipt.referenceNumber}</span>
            <span className="font-mono font-medium">{transaction.reference}</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <>
            <Separator />

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent flex-1" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                {t.common.download}
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent flex-1" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                {t.common.share}
              </Button>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2 bg-transparent h-12" onClick={handleBackToDashboard}>
                <Home className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{t.receipt.backToDashboard}</span>
              </Button>
              <Button className="gap-2 h-12" onClick={handleRepeat}>
                <RefreshCw className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{t.receipt.repeatTransaction}</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
