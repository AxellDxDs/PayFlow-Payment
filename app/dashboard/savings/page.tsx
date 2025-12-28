"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Check,
  Plane,
  Car,
  GraduationCap,
  Home,
  Smartphone,
  Gift,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const savingsGoals = [
  {
    id: "goal-1",
    name: "Liburan ke Bali",
    icon: Plane,
    target: 15000000,
    current: 8500000,
    deadline: new Date("2025-06-30"),
    autoDebit: true,
    monthlyAmount: 1500000,
    color: "#3B82F6",
  },
  {
    id: "goal-2",
    name: "iPhone 16 Pro",
    icon: Smartphone,
    target: 25000000,
    current: 12000000,
    deadline: new Date("2025-03-15"),
    autoDebit: false,
    monthlyAmount: 0,
    color: "#8B5CF6",
  },
  {
    id: "goal-3",
    name: "Dana Darurat",
    icon: PiggyBank,
    target: 50000000,
    current: 35000000,
    deadline: null,
    autoDebit: true,
    monthlyAmount: 2000000,
    color: "#10B981",
  },
]

const goalIcons = [
  { id: "plane", icon: Plane, label: "Liburan" },
  { id: "car", icon: Car, label: "Kendaraan" },
  { id: "graduation", icon: GraduationCap, label: "Pendidikan" },
  { id: "home", icon: Home, label: "Rumah" },
  { id: "phone", icon: Smartphone, label: "Gadget" },
  { id: "gift", icon: Gift, label: "Lainnya" },
]

export default function SavingsPage() {
  const { wallet } = useAppStore()
  const [goals, setGoals] = React.useState(savingsGoals)
  const [showAddGoal, setShowAddGoal] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [newGoal, setNewGoal] = React.useState({
    name: "",
    target: "",
    deadline: "",
    icon: "plane",
    autoDebit: false,
    monthlyAmount: "",
  })

  const totalSavings = goals.reduce((sum, g) => sum + g.current, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.target) {
      toast.error("Lengkapi data tabungan")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const selectedIcon = goalIcons.find((i) => i.id === newGoal.icon)?.icon || PiggyBank
    const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

    setGoals((prev) => [
      ...prev,
      {
        id: `goal-${Date.now()}`,
        name: newGoal.name,
        icon: selectedIcon,
        target: Number(newGoal.target),
        current: 0,
        deadline: newGoal.deadline ? new Date(newGoal.deadline) : null,
        autoDebit: newGoal.autoDebit,
        monthlyAmount: Number(newGoal.monthlyAmount) || 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
    ])

    toast.success("Target tabungan berhasil dibuat!")
    setIsProcessing(false)
    setShowAddGoal(false)
    setNewGoal({
      name: "",
      target: "",
      deadline: "",
      icon: "plane",
      autoDebit: false,
      monthlyAmount: "",
    })
  }

  const handleDeposit = async (goalId: string, amount: number) => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, current: Math.min(g.current + amount, g.target) } : g)),
    )

    toast.success(`Berhasil menabung ${formatCurrency(amount)}!`)
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tabungan</h1>
          <p className="text-muted-foreground">Kelola target tabungan dan investasi Anda</p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Target Baru
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tabungan</p>
                <p className="text-2xl font-bold">{formatCurrency(wallet?.balanceSavings || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Target</p>
                <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bunga Tabungan</p>
                <p className="text-2xl font-bold">
                  3.5% <span className="text-sm font-normal text-muted-foreground">p.a.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = goal.icon
          const progress = (goal.current / goal.target) * 100
          const remaining = goal.target - goal.current

          return (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: goal.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        {goal.autoDebit && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Autodebit {formatCurrency(goal.monthlyAmount)}/bulan
                          </Badge>
                        )}
                      </div>
                      {goal.deadline && (
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium">
                            {goal.deadline.toLocaleDateString("id-ID", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{formatCurrency(goal.current)}</span>
                        <span className="text-muted-foreground">{formatCurrency(goal.target)}</span>
                      </div>
                      <Progress
                        value={progress}
                        className="h-2"
                        style={{ ["--progress-color" as string]: goal.color }}
                      />
                      <p className="text-xs text-muted-foreground">
                        {progress >= 100 ? (
                          <span className="text-green-500 font-medium">Target tercapai!</span>
                        ) : (
                          <>Sisa {formatCurrency(remaining)} lagi</>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeposit(goal.id, 100000)}
                        disabled={isProcessing || progress >= 100}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Tambah Dana
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Buat Target Tabungan Baru</CardTitle>
              <CardDescription>Tentukan target dan rencanakan tabungan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Target</Label>
                <Input
                  placeholder="Contoh: Liburan ke Jepang"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Pilih Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {goalIcons.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "aspect-square rounded-lg border flex items-center justify-center cursor-pointer transition-colors",
                          newGoal.icon === item.id ? "border-primary bg-primary/10" : "border-border hover:bg-muted/50",
                        )}
                        onClick={() => setNewGoal({ ...newGoal, icon: item.id })}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Dana</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                  <Input
                    type="number"
                    placeholder="10000000"
                    className="pl-10"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Waktu (Opsional)</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Aktifkan Autodebit</p>
                  <p className="text-xs text-muted-foreground">Potong otomatis setiap bulan</p>
                </div>
                <Switch
                  checked={newGoal.autoDebit}
                  onCheckedChange={(checked) => setNewGoal({ ...newGoal, autoDebit: checked })}
                />
              </div>

              {newGoal.autoDebit && (
                <div className="space-y-2">
                  <Label>Jumlah Autodebit per Bulan</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      type="number"
                      placeholder="500000"
                      className="pl-10"
                      value={newGoal.monthlyAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, monthlyAmount: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddGoal(false)}>
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleAddGoal} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Membuat...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Buat Target
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
