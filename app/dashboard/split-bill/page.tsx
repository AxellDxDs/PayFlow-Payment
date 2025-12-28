"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { Users, Plus, Check, Clock, Calculator, Loader2, CheckCircle2 } from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SplitMember {
  id: string
  name: string
  username: string
  avatar: string
  amount: number
  isPaid: boolean
}

interface SplitBillItem {
  id: string
  title: string
  totalAmount: number
  paidBy: string
  members: SplitMember[]
  createdAt: Date
  status: "pending" | "completed"
}

const mockFriends = [
  { id: "f1", name: "Sarah Wilson", username: "sarah", avatar: "/sarah-avatar.png" },
  { id: "f2", name: "Mike Johnson", username: "mike", avatar: "/mike-avatar.jpg" },
  { id: "f3", name: "Emma Davis", username: "emma", avatar: "/emma-avatar.jpg" },
  { id: "f4", name: "Alex Chen", username: "alex", avatar: "/alex-avatar.png" },
  { id: "f5", name: "Lisa Park", username: "lisa", avatar: "/lisa-avatar.jpg" },
]

export default function SplitBillPage() {
  const { user, wallet, updateWallet, addTransaction, addPoints } = useAppStore()
  const [activeTab, setActiveTab] = React.useState("create")
  const [billTitle, setBillTitle] = React.useState("")
  const [totalAmount, setTotalAmount] = React.useState("")
  const [selectedFriends, setSelectedFriends] = React.useState<string[]>([])
  const [splitBills, setSplitBills] = React.useState<SplitBillItem[]>([
    {
      id: "sb-1",
      title: "Makan Malam di Restoran",
      totalAmount: 450000,
      paidBy: user?.username || "johndoe",
      members: [
        {
          id: "m1",
          name: "Sarah Wilson",
          username: "sarah",
          avatar: "/sarah-avatar.png",
          amount: 150000,
          isPaid: true,
        },
        {
          id: "m2",
          name: "Mike Johnson",
          username: "mike",
          avatar: "/mike-avatar.jpg",
          amount: 150000,
          isPaid: false,
        },
        {
          id: "m3",
          name: user?.fullName || "John Doe",
          username: user?.username || "johndoe",
          avatar: user?.avatar || "",
          amount: 150000,
          isPaid: true,
        },
      ],
      createdAt: new Date("2024-12-26"),
      status: "pending",
    },
  ])
  const [isCreating, setIsCreating] = React.useState(false)

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const handleCreateSplit = async () => {
    if (!billTitle || !totalAmount || selectedFriends.length === 0) {
      toast.error("Lengkapi semua data terlebih dahulu")
      return
    }

    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const amount = Number.parseFloat(totalAmount)
    const perPersonAmount = amount / (selectedFriends.length + 1)

    const members: SplitMember[] = [
      {
        id: `m-${user?.id}`,
        name: user?.fullName || "John Doe",
        username: user?.username || "johndoe",
        avatar: user?.avatar || "",
        amount: perPersonAmount,
        isPaid: true,
      },
      ...selectedFriends.map((friendId) => {
        const friend = mockFriends.find((f) => f.id === friendId)!
        return {
          id: `m-${friendId}`,
          name: friend.name,
          username: friend.username,
          avatar: friend.avatar,
          amount: perPersonAmount,
          isPaid: false,
        }
      }),
    ]

    const newSplit: SplitBillItem = {
      id: `sb-${Date.now()}`,
      title: billTitle,
      totalAmount: amount,
      paidBy: user?.username || "johndoe",
      members,
      createdAt: new Date(),
      status: "pending",
    }

    setSplitBills([newSplit, ...splitBills])
    addPoints(50)
    toast.success("Split bill berhasil dibuat! +50 poin")

    setBillTitle("")
    setTotalAmount("")
    setSelectedFriends([])
    setIsCreating(false)
    setActiveTab("pending")
  }

  const handleRemindMember = (splitId: string, memberId: string) => {
    toast.success("Pengingat telah dikirim!")
  }

  const handleReceivePayment = (splitId: string, memberId: string) => {
    setSplitBills((prev) =>
      prev.map((split) => {
        if (split.id === splitId) {
          const updatedMembers = split.members.map((m) => (m.id === memberId ? { ...m, isPaid: true } : m))
          const allPaid = updatedMembers.every((m) => m.isPaid)
          const member = split.members.find((m) => m.id === memberId)

          if (member) {
            updateWallet({ balanceMain: (wallet?.balanceMain || 0) + member.amount })
            addTransaction({
              id: `tx-${Date.now()}`,
              userId: user?.id || "",
              type: "transfer",
              amount: member.amount,
              fee: 0,
              status: "success",
              description: `Terima pembayaran split bill dari @${member.username}`,
              createdAt: new Date(),
            })
          }

          return { ...split, members: updatedMembers, status: allPaid ? "completed" : "pending" }
        }
        return split
      }),
    )
    toast.success("Pembayaran diterima!")
  }

  const pendingSplits = splitBills.filter((s) => s.status === "pending")
  const completedSplits = splitBills.filter((s) => s.status === "completed")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Split Bill</h1>
        <p className="text-muted-foreground">Bagi tagihan dengan teman-teman Anda</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Split
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Menunggu ({pendingSplits.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Selesai ({completedSplits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Buat Split Bill Baru
              </CardTitle>
              <CardDescription>Masukkan detail tagihan dan pilih teman untuk dibagi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Tagihan</Label>
                <Input
                  placeholder="Contoh: Makan malam di restoran"
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Tagihan</Label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Pilih Teman ({selectedFriends.length} dipilih)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {mockFriends.map((friend) => (
                    <Button
                      key={friend.id}
                      variant={selectedFriends.includes(friend.id) ? "default" : "outline"}
                      className={cn(
                        "h-auto p-3 justify-start gap-2",
                        !selectedFriends.includes(friend.id) && "bg-transparent",
                      )}
                      onClick={() => toggleFriend(friend.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{friend.name.split(" ")[0]}</p>
                        <p className="text-xs opacity-70">@{friend.username}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {totalAmount && selectedFriends.length > 0 && (
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Tagihan</span>
                    <span className="font-medium">{formatCurrency(Number.parseFloat(totalAmount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jumlah Orang</span>
                    <span className="font-medium">{selectedFriends.length + 1} orang (termasuk kamu)</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Per Orang</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(Number.parseFloat(totalAmount) / (selectedFriends.length + 1))}
                    </span>
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={handleCreateSplit} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat split bill...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Buat Split Bill
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingSplits.length > 0 ? (
            pendingSplits.map((split) => (
              <Card key={split.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{split.title}</CardTitle>
                      <CardDescription>
                        Dibayar oleh @{split.paidBy} - {new Date(split.createdAt).toLocaleDateString("id-ID")}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                      {formatCurrency(split.totalAmount)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {split.members.map((member) => (
                    <div
                      key={member.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        member.isPaid ? "bg-green-500/5 border-green-500/20" : "bg-muted/30",
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">@{member.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatCurrency(member.amount)}</p>
                        {member.isPaid ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Lunas
                          </Badge>
                        ) : member.username !== user?.username ? (
                          <div className="flex gap-1 mt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs bg-transparent"
                              onClick={() => handleRemindMember(split.id, member.id)}
                            >
                              Ingatkan
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleReceivePayment(split.id, member.id)}
                            >
                              Terima
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Tidak ada split bill menunggu</p>
                  <p className="text-sm">Buat split bill baru untuk membagi tagihan</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedSplits.length > 0 ? (
            completedSplits.map((split) => (
              <Card key={split.id} className="opacity-80">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{split.title}</CardTitle>
                      <CardDescription>{new Date(split.createdAt).toLocaleDateString("id-ID")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Selesai
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Belum ada split bill selesai</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
