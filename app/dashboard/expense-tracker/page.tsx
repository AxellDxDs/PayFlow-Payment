"use client"

import * as React from "react"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils/format"
import {
  Plus,
  Minus,
  Calendar,
  TrendingUp,
  TrendingDown,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Heart,
  Home,
  Smartphone,
  Coffee,
  Briefcase,
  Filter,
  Search,
  Loader2,
  Trash2,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Expense {
  id: string
  name: string
  amount: number
  category: string
  date: Date
  note?: string
  type: "expense" | "income"
}

const categories = [
  { value: "food", label: "Makanan", icon: Utensils, color: "bg-orange-500" },
  { value: "transport", label: "Transportasi", icon: Car, color: "bg-blue-500" },
  { value: "shopping", label: "Belanja", icon: ShoppingBag, color: "bg-pink-500" },
  { value: "bills", label: "Tagihan", icon: Zap, color: "bg-yellow-500" },
  { value: "entertainment", label: "Hiburan", icon: Film, color: "bg-purple-500" },
  { value: "health", label: "Kesehatan", icon: Heart, color: "bg-red-500" },
  { value: "housing", label: "Rumah", icon: Home, color: "bg-green-500" },
  { value: "communication", label: "Komunikasi", icon: Smartphone, color: "bg-cyan-500" },
  { value: "coffee", label: "Kopi & Snack", icon: Coffee, color: "bg-amber-500" },
  { value: "work", label: "Pekerjaan", icon: Briefcase, color: "bg-slate-500" },
]

const sampleExpenses: Expense[] = [
  { id: "1", name: "Makan Siang", amount: 45000, category: "food", date: new Date(), type: "expense" },
  { id: "2", name: "Grab ke Kantor", amount: 25000, category: "transport", date: new Date(), type: "expense" },
  { id: "3", name: "Kopi Starbucks", amount: 65000, category: "coffee", date: new Date(), type: "expense" },
  { id: "4", name: "Gaji Bulanan", amount: 15000000, category: "work", date: new Date(2025, 0, 25), type: "income" },
  {
    id: "5",
    name: "Belanja Groceries",
    amount: 350000,
    category: "shopping",
    date: new Date(2025, 0, 27),
    type: "expense",
  },
  { id: "6", name: "Listrik Bulanan", amount: 450000, category: "bills", date: new Date(2025, 0, 20), type: "expense" },
  {
    id: "7",
    name: "Nonton Bioskop",
    amount: 100000,
    category: "entertainment",
    date: new Date(2025, 0, 26),
    type: "expense",
  },
]

function ExpenseTrackerContent() {
  const [expenses, setExpenses] = React.useState<Expense[]>(sampleExpenses)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<"expense" | "income">("expense")
  const [filterCategory, setFilterCategory] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const [formData, setFormData] = React.useState({
    name: "",
    amount: "",
    category: "food",
    note: "",
    date: new Date().toISOString().split("T")[0],
  })

  const totalExpense = expenses.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)

  const totalIncome = expenses.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)

  const balance = totalIncome - totalExpense

  const filteredExpenses = expenses
    .filter((e) => filterCategory === "all" || e.category === filterCategory)
    .filter((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const handleSave = async () => {
    if (!formData.name || !formData.amount) {
      toast.error("Mohon lengkapi data")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: formData.name,
      amount: Number(formData.amount),
      category: formData.category,
      date: new Date(formData.date),
      note: formData.note,
      type: selectedType,
    }

    setExpenses((prev) => [newExpense, ...prev])
    setIsProcessing(false)
    setShowAddDialog(false)
    setFormData({
      name: "",
      amount: "",
      category: "food",
      note: "",
      date: new Date().toISOString().split("T")[0],
    })
    toast.success(selectedType === "expense" ? "Pengeluaran berhasil dicatat" : "Pemasukan berhasil dicatat")
  }

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    toast.success("Transaksi berhasil dihapus")
  }

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue) || categories[0]
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Hari ini"
    if (date.toDateString() === yesterday.toDateString()) return "Kemarin"

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(date)
  }

  // Group expenses by date
  const groupedExpenses = filteredExpenses.reduce(
    (groups, expense) => {
      const dateKey = expense.date.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(expense)
      return groups
    },
    {} as Record<string, Expense[]>,
  )

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pencatat Pengeluaran</h1>
          <p className="text-muted-foreground">Lacak setiap transaksi harian Anda</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pemasukan</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pengeluaran</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={cn("text-2xl font-bold", balance >= 0 ? "text-primary" : "text-red-500")}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  balance >= 0 ? "bg-primary/10" : "bg-red-500/10",
                )}
              >
                {balance >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-primary" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>{filteredExpenses.length} transaksi ditemukan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedExpenses).map(([dateKey, dayExpenses]) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{formatDate(new Date(dateKey))}</span>
                </div>
                <div className="space-y-2">
                  {dayExpenses.map((expense) => {
                    const categoryInfo = getCategoryInfo(expense.category)
                    return (
                      <div
                        key={expense.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            categoryInfo.color + "/10",
                          )}
                        >
                          <categoryInfo.icon className={cn("h-5 w-5", categoryInfo.color.replace("bg-", "text-"))} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{expense.name}</p>
                          <p className="text-sm text-muted-foreground">{categoryInfo.label}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p
                            className={cn(
                              "text-lg font-bold",
                              expense.type === "income" ? "text-green-500" : "text-red-500",
                            )}
                          >
                            {expense.type === "income" ? "+" : "-"}
                            {formatCurrency(expense.amount)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Transaksi</DialogTitle>
            <DialogDescription>Catat pemasukan atau pengeluaran baru</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedType === "expense" ? "default" : "outline"}
                onClick={() => setSelectedType("expense")}
                className="gap-2"
              >
                <Minus className="h-4 w-4" />
                Pengeluaran
              </Button>
              <Button
                variant={selectedType === "income" ? "default" : "outline"}
                onClick={() => setSelectedType("income")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Pemasukan
              </Button>
            </div>

            <div>
              <Label>Nama Transaksi</Label>
              <Input
                placeholder="contoh: Makan Siang"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label>Jumlah</Label>
              <Input
                type="number"
                placeholder="Rp 0"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Catatan (opsional)</Label>
              <Input
                placeholder="Tambahkan catatan..."
                value={formData.note}
                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ExpenseTrackerPage() {
  return (
    <Suspense fallback={null}>
      <ExpenseTrackerContent />
    </Suspense>
  )
}
