"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CryptoAsset } from "@/lib/types"
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils/format"
import { TrendingUp, TrendingDown } from "@/components/icons"
import { cn } from "@/lib/utils"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { generateLineChartData } from "@/lib/hooks/use-crypto-prices"

interface CryptoPriceCardProps {
  asset: CryptoAsset
  onClick?: () => void
  isSelected?: boolean
}

export function CryptoPriceCard({ asset, onClick, isSelected }: CryptoPriceCardProps) {
  const isPositive = asset.change24h >= 0
  const chartData = generateLineChartData(asset.price, 24, "1h")

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold",
                asset.symbol === "BTC" && "bg-orange-500/20 text-orange-500",
                asset.symbol === "ETH" && "bg-blue-500/20 text-blue-500",
                asset.symbol === "USDT" && "bg-green-500/20 text-green-500",
                asset.symbol === "BNB" && "bg-yellow-500/20 text-yellow-500",
                asset.symbol === "SOL" && "bg-purple-500/20 text-purple-500",
                asset.symbol === "XRP" && "bg-gray-500/20 text-gray-500",
              )}
            >
              {asset.icon}
            </div>
            <div>
              <p className="font-semibold">{asset.symbol}</p>
              <p className="text-xs text-muted-foreground">{asset.name}</p>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#22c55e" : "#ef4444"}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-right">
            <p className="font-semibold">{formatCurrency(asset.price)}</p>
            <Badge variant="secondary" className={cn("text-xs", isPositive ? "text-green-500" : "text-red-500")}>
              {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatPercentage(asset.change24h)}
            </Badge>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>MCap: {formatCompactNumber(asset.marketCap)}</span>
          <span>Vol 24h: {formatCompactNumber(asset.volume24h)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
