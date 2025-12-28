"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "@/components/icons"
import { useLanguage } from "@/lib/i18n/language-context"

const monthlyData = [
  { name: "Jan", income: 5400000, expense: 2400000 },
  { name: "Feb", income: 4800000, expense: 1800000 },
  { name: "Mar", income: 6200000, expense: 3200000 },
  { name: "Apr", income: 5800000, expense: 2800000 },
  { name: "May", income: 4900000, expense: 1900000 },
  { name: "Jun", income: 5600000, expense: 2600000 },
  { name: "Jul", income: 7100000, expense: 3100000 },
  { name: "Aug", income: 5200000, expense: 2200000 },
  { name: "Sep", income: 6900000, expense: 2900000 },
  { name: "Oct", income: 7400000, expense: 3400000 },
  { name: "Nov", income: 5700000, expense: 2700000 },
  { name: "Dec", income: 8800000, expense: 3800000 },
]

const categoryData = [
  { name: "Makanan", value: 35, color: "#22c55e", amount: 1750000 },
  { name: "Transfer", value: 25, color: "#3b82f6", amount: 1250000 },
  { name: "Pulsa & Data", value: 15, color: "#ef4444", amount: 750000 },
  { name: "Tagihan", value: 15, color: "#f59e0b", amount: 750000 },
  { name: "Crypto", value: 10, color: "#8b5cf6", amount: 500000 },
]

const weeklyTrend = [
  { day: "Sen", amount: 450000 },
  { day: "Sel", amount: 320000 },
  { day: "Rab", amount: 580000 },
  { day: "Kam", amount: 290000 },
  { day: "Jum", amount: 720000 },
  { day: "Sab", amount: 890000 },
  { day: "Min", amount: 650000 },
]

const savingsGoal = [
  { name: "Liburan", value: 75, fill: "#22c55e", target: 10000000, current: 7500000 },
  { name: "Gadget", value: 45, fill: "#3b82f6", target: 5000000, current: 2250000 },
  { name: "Darurat", value: 90, fill: "#f59e0b", target: 20000000, current: 18000000 },
]

export function SpendingChart() {
  const { t } = useLanguage()
  const [chartType, setChartType] = React.useState<"overview" | "category" | "trend" | "savings">("overview")

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${value / 1000000}jt`
    if (value >= 1000) return `${value / 1000}rb`
    return value.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-xl shadow-xl p-4">
          <p className="text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">Rp {entry.value.toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-xl shadow-xl p-4">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
          <p className="text-sm font-medium text-primary">Rp {payload[0].payload.amount.toLocaleString("id-ID")}</p>
        </div>
      )
    }
    return null
  }

  // Calculate totals
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0)
  const totalExpense = monthlyData.reduce((sum, item) => sum + item.expense, 0)
  const savingsRate = (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{t.dashboard.spending}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Analisis keuangan Anda</p>
          </div>
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as typeof chartType)}>
            <TabsList className="h-9 bg-muted/50">
              <TabsTrigger value="overview" className="text-xs px-3">
                Overview
              </TabsTrigger>
              <TabsTrigger value="category" className="text-xs px-3">
                Kategori
              </TabsTrigger>
              <TabsTrigger value="trend" className="text-xs px-3">
                Trend
              </TabsTrigger>
              <TabsTrigger value="savings" className="text-xs px-3">
                Tabungan
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "overview" && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">Pemasukan</span>
              </div>
              <p className="text-lg font-bold text-green-600">Rp {(totalIncome / 1000000).toFixed(1)}jt</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xs text-muted-foreground">Pengeluaran</span>
              </div>
              <p className="text-lg font-bold text-red-600">Rp {(totalExpense / 1000000).toFixed(1)}jt</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-600">-8.3%</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs text-muted-foreground">Tabungan</span>
              </div>
              <p className="text-lg font-bold text-blue-600">{savingsRate}%</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-blue-600">Dari pemasukan</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-[300px]">
          {chartType === "overview" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Pemasukan"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Pengeluaran"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {chartType === "category" && (
            <div className="flex flex-col lg:flex-row items-center gap-6 h-full">
              <div className="flex-1 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">Rp {item.amount.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-muted-foreground">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chartType === "trend" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" name="Pengeluaran" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === "savings" && (
            <div className="space-y-4 h-full overflow-auto">
              {savingsGoal.map((goal) => (
                <div key={goal.name} className="p-4 rounded-xl border bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{goal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Rp {goal.current.toLocaleString("id-ID")} / Rp {goal.target.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Badge
                      variant={goal.value >= 75 ? "default" : goal.value >= 50 ? "secondary" : "outline"}
                      className={goal.value >= 75 ? "bg-green-500" : ""}
                    >
                      {goal.value}%
                    </Badge>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${goal.value}%`,
                        backgroundColor: goal.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
