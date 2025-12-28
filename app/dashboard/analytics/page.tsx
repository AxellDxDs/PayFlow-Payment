"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShoppingCart,
  Utensils,
  Car,
  Zap,
  Film,
  ChevronRight,
} from "@/components/icons"
import { cn } from "@/lib/utils"

interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  icon: React.ElementType
  color: string
  trend: "up" | "down" | "stable"
  trendValue: number
}

const spendingCategories: SpendingCategory[] = [
  {
    name: "Makanan & Minuman",
    amount: 2500000,
    percentage: 35,
    icon: Utensils,
    color: "bg-orange-500",
    trend: "up",
    trendValue: 12,
  },
  {
    name: "Transportasi",
    amount: 1500000,
    percentage: 21,
    icon: Car,
    color: "bg-blue-500",
    trend: "down",
    trendValue: 8,
  },
  {
    name: "Belanja",
    amount: 1200000,
    percentage: 17,
    icon: ShoppingCart,
    color: "bg-pink-500",
    trend: "up",
    trendValue: 5,
  },
  {
    name: "Tagihan",
    amount: 1000000,
    percentage: 14,
    icon: Zap,
    color: "bg-yellow-500",
    trend: "stable",
    trendValue: 0,
  },
  { name: "Hiburan", amount: 600000, percentage: 8, icon: Film, color: "bg-purple-500", trend: "down", trendValue: 15 },
  { name: "Lainnya", amount: 350000, percentage: 5, icon: Wallet, color: "bg-gray-500", trend: "up", trendValue: 3 },
]

const monthlyData = [
  { month: "Jan", income: 15000000, expense: 8500000 },
  { month: "Feb", income: 14500000, expense: 9200000 },
  { month: "Mar", income: 16000000, expense: 7800000 },
  { month: "Apr", income: 15500000, expense: 8100000 },
  { month: "May", income: 17000000, expense: 9500000 },
  { month: "Jun", income: 16500000, expense: 8800000 },
]

const insights = [
  {
    title: "Pengeluaran Naik",
    description: "Pengeluaran makanan naik 12% dari bulan lalu",
    type: "warning" as const,
    action: "Lihat Detail",
  },
  {
    title: "Target Tercapai",
    description: "Anda berhasil menghemat Rp 2.5 juta bulan ini",
    type: "success" as const,
    action: "Lihat Tabungan",
  },
  {
    title: "Tagihan Mendatang",
    description: "3 tagihan akan jatuh tempo minggu depan",
    type: "info" as const,
    action: "Lihat Tagihan",
  },
]

export default function AnalyticsPage() {
  const { user } = useAppStore()
  const [period, setPeriod] = React.useState("monthly")

  const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const totalIncome = 16500000
  const savings = totalIncome - totalSpending

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analisis Keuangan</h1>
          <p className="text-muted-foreground">Pantau dan analisis keuangan Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <ArrowDownLeft className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span>+8.5% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(totalSpending)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
              <TrendingDown className="h-4 w-4" />
              <span>-3.2% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tabungan</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(savings)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>+15.3% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pengeluaran per Kategori</CardTitle>
                <CardDescription>Distribusi pengeluaran bulan ini</CardDescription>
              </div>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Visual Pie Chart Representation */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative h-40 w-40">
                <svg className="transform -rotate-90 h-40 w-40">
                  {
                    spendingCategories.reduce(
                      (acc, cat, index) => {
                        const offset = acc.offset
                        const strokeDasharray = `${cat.percentage * 2.51327} ${251.327 - cat.percentage * 2.51327}`
                        acc.elements.push(
                          <circle
                            key={cat.name}
                            cx="80"
                            cy="80"
                            r="60"
                            fill="none"
                            strokeWidth="20"
                            stroke={`hsl(var(--chart-${index + 1}))`}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={-offset * 2.51327}
                            className="transition-all duration-500"
                          />,
                        )
                        acc.offset += cat.percentage
                        return acc
                      },
                      { elements: [] as React.ReactNode[], offset: 0 },
                    ).elements
                  }
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-lg font-bold">{formatCurrency(totalSpending)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {spendingCategories.map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", cat.color + "/10")}>
                    <cat.icon className={cn("h-4 w-4", cat.color.replace("bg-", "text-"))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{cat.name}</span>
                      <span className="text-sm text-muted-foreground">{cat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", cat.color)}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      cat.trend === "up"
                        ? "text-red-500"
                        : cat.trend === "down"
                          ? "text-green-500"
                          : "text-muted-foreground",
                    )}
                  >
                    {cat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : cat.trend === "down" ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : null}
                    {cat.trendValue > 0 && <span>{cat.trendValue}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tren Bulanan</CardTitle>
                <CardDescription>Perbandingan pemasukan vs pengeluaran</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-green-500">{formatCurrency(data.income)}</span>
                      <span className="text-red-500">{formatCurrency(data.expense)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-4">
                    <div
                      className="bg-green-500 rounded-l-full transition-all duration-500"
                      style={{ width: `${(data.income / 20000000) * 100}%` }}
                    />
                    <div
                      className="bg-red-500 rounded-r-full transition-all duration-500"
                      style={{ width: `${(data.expense / 20000000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Pengeluaran</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>Rekomendasi berdasarkan analisis keuangan Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className={cn(
                  "border-l-4",
                  insight.type === "warning"
                    ? "border-l-yellow-500"
                    : insight.type === "success"
                      ? "border-l-green-500"
                      : "border-l-blue-500",
                )}
              >
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                    {insight.action}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
