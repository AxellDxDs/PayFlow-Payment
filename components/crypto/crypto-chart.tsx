"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { CryptoAsset } from "@/lib/types"
import { formatCurrency, formatPercentage } from "@/lib/utils/format"
import { generateLineChartData, generateCandlestickData } from "@/lib/hooks/use-crypto-prices"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  ComposedChart,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

interface CryptoChartProps {
  asset: CryptoAsset
}

type TimeRange = "1H" | "1D" | "1W" | "1M" | "1Y"
type ChartType = "line" | "candle"

export function CryptoChart({ asset }: CryptoChartProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("1D")
  const [chartType, setChartType] = React.useState<ChartType>("line")

  const isPositive = asset.change24h >= 0

  // Generate data based on time range
  const getChartData = () => {
    switch (timeRange) {
      case "1H":
        return generateLineChartData(asset.price, 60, "1h")
      case "1D":
        return generateLineChartData(asset.price, 24, "1h")
      case "1W":
        return generateLineChartData(asset.price, 7, "1d")
      case "1M":
        return generateLineChartData(asset.price, 30, "1d")
      case "1Y":
        return generateLineChartData(asset.price, 52, "1w")
      default:
        return generateLineChartData(asset.price, 24, "1h")
    }
  }

  const candleData = generateCandlestickData(asset.price, 30)
  const lineData = getChartData()

  const formatYAxis = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toFixed(0)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold",
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
              <CardTitle className="flex items-center gap-2">
                {asset.name}
                <span className="text-muted-foreground font-normal">({asset.symbol})</span>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">{formatCurrency(asset.price)}</span>
                <span className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-500" : "text-red-500")}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {formatPercentage(asset.change24h)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={chartType === "line" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setChartType("line")}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "candle" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2"
                onClick={() => setChartType("candle")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>

            {/* Time Range Tabs */}
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <TabsList className="h-8">
                {(["1H", "1D", "1W", "1M", "1Y"] as TimeRange[]).map((range) => (
                  <TabsTrigger key={range} value={range} className="text-xs px-2">
                    {range}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {chartType === "line" ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candleData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis
                  yAxisId="price"
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
                          <p className="font-medium mb-2">{data.date}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="text-muted-foreground">Open:</span>
                            <span>{formatCurrency(data.open)}</span>
                            <span className="text-muted-foreground">High:</span>
                            <span className="text-green-500">{formatCurrency(data.high)}</span>
                            <span className="text-muted-foreground">Low:</span>
                            <span className="text-red-500">{formatCurrency(data.low)}</span>
                            <span className="text-muted-foreground">Close:</span>
                            <span>{formatCurrency(data.close)}</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--muted))" opacity={0.3} radius={[2, 2, 0, 0]} />
                <Line yAxisId="price" type="monotone" dataKey="close" stroke="hsl(var(--primary))" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
