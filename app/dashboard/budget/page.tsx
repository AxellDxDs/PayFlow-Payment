"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Wallet,
  ShoppingCart,
  Utensils,
  Car,
  Zap,
  Film,
  Heart,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface BudgetCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  budget: number
  spent: number
}

const categoryIcons: Record<string, { icon: React.ElementType; color: string }> = {
  makanan: { icon: Utensils, color: "text-orange-500 bg-orange-500/10" },
  transportasi: { icon: Car, color: "text-blue-500 bg-blue-500/10" },
  belanja: { icon: ShoppingCart, color: "text-pink-500 bg-pink-500/10" },
  tagihan: { icon: Zap, color: "text-yellow-500 bg-yellow-500/10" },
  hiburan: { icon: Film, color: "text-purple-500 bg-purple-500/10" },
  kesehatan: { icon: Heart, color: "text-red-500 bg-red-500/10" },
  kerja: { icon: Briefcase, color: "text-green-500 bg-green-500/10" },
  tabungan: { icon: PiggyBank, color: "text-cyan-500 bg-cyan-500/10" },
}

export default function BudgetPage() {
  const { wallet, addPoints } = useAppStore()
  const [categories, setCategories] = React.useState<BudgetCategory[]>([
    {
      id: "1",
      name: "makanan",
      icon: Utensils,
      color: "text-orange-500 bg-orange-500/10",
      budget: 2000000,
      spent: 1250000,
    },
    { id: "2", name: "transportasi", icon: Car, color: "text-blue-500 bg-blue-500/10", budget: 1000000, spent: 650000 },
    {
      id: "3",
      name: "belanja",
      icon: ShoppingCart,
      color: "text-pink-500 bg-pink-500/10",
      budget: 1500000,
      spent: 1800000,
    },
    { id: "4", name: "tagihan", icon: Zap, color: "text-yellow-500 bg-yellow-500/10", budget: 1500000, spent: 960000 },
    { id: "5", name: "hiburan", icon: Film, color: "text-purple-500 bg-purple-500/10", budget: 500000, spent: 320000 },
    {
      id: "6",
      name: "tabungan",
      icon: PiggyBank,
      color: "text-cyan-500 bg-cyan-500/10",
      budget: 3000000,
      spent: 2500000,
    },
  ])
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<BudgetCategory | null>(null)
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [newCategoryBudget, setNewCategoryBudget] = React.useState("")

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remaining = totalBudget - totalSpent

  const handleAddCategory = () => {
    if (!newCategoryName || !newCategoryBudget) {
      toast.error("Lengkapi semua data")
      return
    }

    const iconConfig = categoryIcons[newCategoryName] || { icon: Wallet, color: "text-gray-500 bg-gray-500/10" }

    const newCategory: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      icon: iconConfig.icon,
      color: iconConfig.color,
      budget: Number.parseFloat(newCategoryBudget),
      spent: 0,
    }

    setCategories([...categories, newCategory])
    addPoints(25)
    toast.success("Kategori anggaran ditambahkan! +25 poin")
    setShowAddDialog(false)
    setNewCategoryName("")
    setNewCategoryBudget("")
  }

  const handleUpdateBudget = () => {
    if (!editingCategory) return

    setCategories((prev) =>
      prev.map((cat) => (cat.id === editingCategory.id ? { ...cat, budget: editingCategory.budget } : cat)),
    )
    toast.success("Anggaran diperbarui!")
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    toast.success("Kategori dihapus")
  }

  const handleAddExpense = (categoryId: string, amount: number) => {
    setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, spent: cat.spent + amount } : cat)))
    addPoints(10)
    toast.success("Pengeluaran dicatat! +10 poin")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget Planner</h1>
          <p className="text-muted-foreground">Kelola anggaran bulanan Anda</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Anggaran</p>
                <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terpakai</p>
                <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  remaining >= 0 ? "bg-green-500/10" : "bg-red-500/10",
                )}
              >
                {remaining >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sisa</p>
                <p className={cn("text-xl font-bold", remaining >= 0 ? "text-green-500" : "text-red-500")}>
                  {formatCurrency(Math.abs(remaining))}
                  {remaining < 0 && " (Over)"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategori Anggaran</CardTitle>
          <CardDescription>
            Bulan {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon
            const percentage = (category.spent / category.budget) * 100
            const isOverBudget = category.spent > category.budget

            return (
              <div key={category.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", category.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium capitalize">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOverBudget && (
                      <Badge variant="destructive" className="text-xs">
                        Over Budget
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className={cn("h-2", isOverBudget && "[&>div]:bg-red-500")}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{percentage.toFixed(0)}% terpakai</span>
                  <span>Sisa: {formatCurrency(Math.max(0, category.budget - category.spent))}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Anggaran</DialogTitle>
            <DialogDescription>Buat kategori baru untuk mengelola pengeluaran</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={newCategoryName} onValueChange={setNewCategoryName}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryIcons).map((key) => (
                    <SelectItem key={key} value={key}>
                      <span className="capitalize">{key}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Anggaran Bulanan</Label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={newCategoryBudget}
                onChange={(e) => setNewCategoryBudget(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleAddCategory}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Anggaran</DialogTitle>
            <DialogDescription>Ubah jumlah anggaran untuk kategori ini</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input value={editingCategory.name} disabled className="capitalize" />
              </div>
              <div className="space-y-2">
                <Label>Anggaran Baru</Label>
                <Input
                  type="number"
                  value={editingCategory.budget}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, budget: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdateBudget}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
