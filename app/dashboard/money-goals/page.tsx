"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Target,
  Plus,
  Plane,
  Home,
  Car,
  GraduationCap,
  Gift,
  Smartphone,
  Laptop,
  Heart,
  Trash2,
  TrendingUp,
  Calendar,
  Wallet,
  Sparkles,
  CheckCircle2,
  Loader2,
  PiggyBank,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MoneyGoal {
  id: string
  name: string
  icon: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  color: string
  isCompleted: boolean
}

const goalIcons: Record<string, { icon: React.ElementType; color: string }> = {
  vacation: { icon: Plane, color: "text-cyan-500 bg-cyan-500/10" },
  house: { icon: Home, color: "text-blue-500 bg-blue-500/10" },
  car: { icon: Car, color: "text-green-500 bg-green-500/10" },
  education: { icon: GraduationCap, color: "text-purple-500 bg-purple-500/10" },
  gift: { icon: Gift, color: "text-pink-500 bg-pink-500/10" },
  phone: { icon: Smartphone, color: "text-orange-500 bg-orange-500/10" },
  laptop: { icon: Laptop, color: "text-indigo-500 bg-indigo-500/10" },
  wedding: { icon: Heart, color: "text-red-500 bg-red-500/10" },
  emergency: { icon: PiggyBank, color: "text-amber-500 bg-amber-500/10" },
}

export default function MoneyGoalsPage() {
  const { wallet, updateWallet, addPoints, addTransaction, user } = useAppStore()
  const [goals, setGoals] = React.useState<MoneyGoal[]>([
    {
      id: "g1",
      name: "Liburan ke Bali",
      icon: "vacation",
      targetAmount: 5000000,
      currentAmount: 3250000,
      deadline: new Date("2025-06-01"),
      color: "cyan",
      isCompleted: false,
    },
    {
      id: "g2",
      name: "iPhone 16 Pro",
      icon: "phone",
      targetAmount: 22000000,
      currentAmount: 8500000,
      deadline: new Date("2025-09-01"),
      color: "orange",
      isCompleted: false,
    },
    {
      id: "g3",
      name: "Dana Darurat",
      icon: "emergency",
      targetAmount: 30000000,
      currentAmount: 15000000,
      deadline: new Date("2025-12-31"),
      color: "amber",
      isCompleted: false,
    },
  ])
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [showDepositDialog, setShowDepositDialog] = React.useState(false)
  const [selectedGoal, setSelectedGoal] = React.useState<MoneyGoal | null>(null)
  const [depositAmount, setDepositAmount] = React.useState("")
  const [isDepositing, setIsDepositing] = React.useState(false)
  const [newGoal, setNewGoal] = React.useState({
    name: "",
    icon: "vacation",
    targetAmount: "",
    deadline: "",
  })

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error("Lengkapi semua data")
      return
    }

    const goal: MoneyGoal = {
      id: `goal-${Date.now()}`,
      name: newGoal.name,
      icon: newGoal.icon,
      targetAmount: Number.parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: new Date(newGoal.deadline),
      color: goalIcons[newGoal.icon]?.color || "text-gray-500",
      isCompleted: false,
    }

    setGoals([...goals, goal])
    addPoints(50)
    toast.success("Target tabungan ditambahkan! +50 poin")
    setShowAddDialog(false)
    setNewGoal({ name: "", icon: "vacation", targetAmount: "", deadline: "" })
  }

  const handleDeposit = async () => {
    if (!selectedGoal || !depositAmount) return

    const amount = Number.parseFloat(depositAmount)
    if (amount > (wallet?.balanceMain || 0)) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsDepositing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newCurrentAmount = selectedGoal.currentAmount + amount
    const isCompleted = newCurrentAmount >= selectedGoal.targetAmount

    setGoals((prev) =>
      prev.map((g) => (g.id === selectedGoal.id ? { ...g, currentAmount: newCurrentAmount, isCompleted } : g)),
    )

    updateWallet({
      balanceMain: (wallet?.balanceMain || 0) - amount,
      balanceSavings: (wallet?.balanceSavings || 0) + amount,
    })

    addTransaction({
      id: `tx-${Date.now()}`,
      userId: user?.id || "",
      type: "transfer",
      amount: -amount,
      fee: 0,
      status: "success",
      description: `Nabung ke "${selectedGoal.name}"`,
      createdAt: new Date(),
    })

    const pointsEarned = Math.floor(amount / 50000) * 10
    if (pointsEarned > 0) {
      addPoints(pointsEarned)
    }

    if (isCompleted) {
      toast.success(`Selamat! Target "${selectedGoal.name}" tercapai!`)
      addPoints(200)
    } else {
      toast.success(`Berhasil menabung! +${pointsEarned} poin`)
    }

    setIsDepositing(false)
    setShowDepositDialog(false)
    setDepositAmount("")
    setSelectedGoal(null)
  }

  const handleDeleteGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id)
    if (goal && goal.currentAmount > 0) {
      updateWallet({
        balanceMain: (wallet?.balanceMain || 0) + goal.currentAmount,
        balanceSavings: (wallet?.balanceSavings || 0) - goal.currentAmount,
      })
    }
    setGoals((prev) => prev.filter((g) => g.id !== id))
    toast.success("Target dihapus dan dana dikembalikan ke saldo utama")
  }

  const openDepositDialog = (goal: MoneyGoal) => {
    setSelectedGoal(goal)
    setShowDepositDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Target Tabungan</h1>
          <p className="text-muted-foreground">Capai tujuan finansial Anda</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Target
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Terkumpul</p>
                <p className="text-xl font-bold text-green-500">{formatCurrency(totalSaved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Target</p>
                <p className="text-xl font-bold">{formatCurrency(totalTarget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-xl font-bold">
                  {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const iconConfig = goalIcons[goal.icon] || { icon: Target, color: "text-gray-500 bg-gray-500/10" }
          const Icon = iconConfig.icon
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const remaining = goal.targetAmount - goal.currentAmount
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          const monthlyNeeded = daysLeft > 0 ? remaining / (daysLeft / 30) : 0

          return (
            <Card key={goal.id} className={cn(goal.isCompleted && "border-green-500/50 bg-green-500/5")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", iconConfig.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {goal.isCompleted ? "Tercapai!" : daysLeft > 0 ? `${daysLeft} hari lagi` : "Sudah lewat"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {goal.isCompleted ? (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Tercapai
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Terkumpul</span>
                    <span className="font-medium">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className={cn("h-3", goal.isCompleted && "[&>div]:bg-green-500")}
                  />
                  {!goal.isCompleted && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sisa: {formatCurrency(remaining)}</span>
                      <span>~{formatCurrency(monthlyNeeded)}/bulan</span>
                    </div>
                  )}
                </div>

                {!goal.isCompleted && (
                  <Button className="w-full mt-4" onClick={() => openDepositDialog(goal)}>
                    <Wallet className="h-4 w-4 mr-2" />
                    Nabung Sekarang
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}

        {goals.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Belum ada target tabungan</p>
                <p className="text-sm">Buat target pertama Anda!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Target Tabungan</DialogTitle>
            <DialogDescription>Tentukan tujuan dan target tabungan Anda</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Target</Label>
              <Input
                placeholder="Contoh: Liburan ke Jepang"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(goalIcons).map(([key, { icon: Icon, color }]) => (
                  <Button
                    key={key}
                    variant={newGoal.icon === key ? "default" : "outline"}
                    className={cn("h-auto p-3", newGoal.icon !== key && "bg-transparent")}
                    onClick={() => setNewGoal({ ...newGoal, icon: key })}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Dana</Label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Tanggal</Label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleAddGoal}>Buat Target</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nabung ke "{selectedGoal?.name}"</DialogTitle>
            <DialogDescription>Masukkan jumlah yang ingin ditabung</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Saldo Utama</span>
                <span className="font-medium">{formatCurrency(wallet?.balanceMain || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sisa Target</span>
                <span className="font-medium">
                  {formatCurrency((selectedGoal?.targetAmount || 0) - (selectedGoal?.currentAmount || 0))}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Jumlah Nabung</Label>
              <Input
                type="number"
                placeholder="Masukkan jumlah"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {[50000, 100000, 250000, 500000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-transparent"
                  onClick={() => setDepositAmount(amount.toString())}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDepositDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleDeposit} disabled={isDepositing || !depositAmount}>
              {isDepositing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Nabung Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
