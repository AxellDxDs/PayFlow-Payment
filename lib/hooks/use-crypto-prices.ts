"use client"

import * as React from "react"
import type { CryptoAsset } from "@/lib/types"
import { mockCryptoAssets } from "@/lib/mock-data"

// Simulated real-time price updates
export function useCryptoPrices() {
  const [prices, setPrices] = React.useState<CryptoAsset[]>(mockCryptoAssets)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Initial load
    setIsLoading(false)

    // Simulate real-time price updates every 3 seconds
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((asset) => {
          // Random price change between -2% and +2%
          const changePercent = (Math.random() - 0.5) * 4
          const newPrice = asset.price * (1 + changePercent / 100)
          const new24hChange = asset.change24h + (Math.random() - 0.5) * 0.5

          return {
            ...asset,
            price: newPrice,
            change24h: Math.max(-20, Math.min(20, new24hChange)),
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return { prices, isLoading }
}

// Generate candlestick data for charts
export function generateCandlestickData(basePrice: number, days = 30) {
  const data = []
  let currentPrice = basePrice * 0.85 // Start 15% lower

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const volatility = 0.03 // 3% daily volatility
    const open = currentPrice
    const change = (Math.random() - 0.48) * volatility * currentPrice // Slight upward bias
    const close = open + change
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    const volume = Math.random() * 1000000000

    data.push({
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume,
    })

    currentPrice = close
  }

  return data
}

// Generate line chart data
export function generateLineChartData(basePrice: number, points = 24, interval: "1h" | "1d" | "1w" = "1h") {
  const data = []
  let currentPrice = basePrice * 0.95

  for (let i = points; i >= 0; i--) {
    const date = new Date()
    if (interval === "1h") {
      date.setHours(date.getHours() - i)
    } else if (interval === "1d") {
      date.setDate(date.getDate() - i)
    } else {
      date.setDate(date.getDate() - i * 7)
    }

    const change = (Math.random() - 0.48) * 0.02 * currentPrice
    currentPrice = currentPrice + change

    data.push({
      time:
        interval === "1h"
          ? date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      price: currentPrice,
    })
  }

  return data
}
