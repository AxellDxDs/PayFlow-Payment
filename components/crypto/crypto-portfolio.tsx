"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { useCryptoPrices } from "@/lib/hooks/use-crypto-prices"
import { formatCurrency, formatNumber } from "@/lib/utils/format"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Eye, EyeOff, TrendingUp, Wallet } from "@/components/icons"
import * as React from "react"
import { Button } from "@/components/ui/button"

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#8b5cf6", "#ec4899"]

export function CryptoPortfolio() {
  const { cryptoWallets } = useAppStore()
  const { prices } = useCryptoPrices()
  const [showBalance, setShowBalance] = React.useState(true)

  // Calculate portfolio values based on current prices
  const portfolioData = cryptoWallets.map((wallet, index) => {
    const currentPrice = prices.find((p) => p.symbol === wallet.coinType)?.price || 0
    const value = wallet.balance * currentPrice
    return {
      name: wallet.coinType,
      value,
      balance: wallet.balance,
      color: COLORS[index % COLORS.length],
    }
  })

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-xs text-muted-foreground">{formatNumber(data.balance)} koin</p>
          <p className="text-sm font-semibold">{formatCurrency(data.value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Crypto
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Value */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">Total Nilai Aset</p>
          <p className="text-3xl font-bold">{showBalance ? formatCurrency(totalValue) : "Rp ••••••••"}</p>
          <div className="flex items-center justify-center gap-1 text-sm text-green-500 mt-1">
            <TrendingUp className="h-4 w-4" />
            <span>+5.24% hari ini</span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Asset List */}
        <div className="space-y-3 mt-4">
          {portfolioData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {showBalance ? formatNumber(item.balance) : "••••"} koin
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{showBalance ? formatCurrency(item.value) : "Rp ••••••"}</p>
                <p className="text-xs text-muted-foreground">{((item.value / totalValue) * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
