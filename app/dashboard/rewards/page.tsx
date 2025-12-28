"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BadgeCard } from "@/components/rewards/badge-card"
import { MissionCard } from "@/components/rewards/mission-card"
import { Leaderboard } from "@/components/rewards/leaderboard"
import { LuckySpin } from "@/components/rewards/lucky-spin"
import { useAppStore } from "@/lib/store"
import { mockBadges, LEVEL_CONFIGS } from "@/lib/mock-data"
import { formatNumber, formatCurrency } from "@/lib/utils/format"
import { Trophy, Award, Target, Gift, Users, Crown, RefreshCw } from "@/components/icons"
import { toast } from "sonner"

export default function RewardsPage() {
  const { user, wallet, missions, claimMissionReward, resetDailyMissions } = useAppStore()

  const currentLevelConfig = LEVEL_CONFIGS.find((l) => l.name === user?.level)
  const currentLevelIndex = LEVEL_CONFIGS.findIndex((l) => l.name === user?.level)
  const nextLevel = LEVEL_CONFIGS[currentLevelIndex + 1]

  const earnedBadges = mockBadges.filter((b) => b.isEarned)
  const progressBadges = mockBadges.filter((b) => !b.isEarned)

  const userPoints = user?.points || wallet?.balancePoints || 0

  const progressToNextLevel = nextLevel
    ? Math.min(
        ((userPoints - currentLevelConfig!.minPoints) / (nextLevel.minPoints - currentLevelConfig!.minPoints)) * 100,
        100,
      )
    : 100

  const handleClaimMission = (missionId: string) => {
    claimMissionReward(missionId)
    toast.success("Reward berhasil diklaim! Poin telah ditambahkan.")
  }

  const handleResetMissions = () => {
    resetDailyMissions()
    toast.success("Misi harian telah direset!")
  }

  const completedMissions = missions.filter((m) => m.isCompleted).length
  const claimedMissions = missions.filter((m) => m.isClaimed).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Rewards & Gamifikasi</h1>
        <p className="text-muted-foreground">Kumpulkan poin, badge, dan naik level!</p>
      </div>

      {/* Level Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center text-5xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${currentLevelConfig?.color}40, ${currentLevelConfig?.color}20)`,
                boxShadow: `0 0 30px ${currentLevelConfig?.color}30`,
              }}
            >
              {currentLevelConfig?.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold" style={{ color: currentLevelConfig?.color }}>
                  {currentLevelConfig?.displayName} Member
                </h2>
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Poin</p>
                  <p className="text-xl font-bold">{formatNumber(userPoints)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cashback</p>
                  <p className="text-xl font-bold text-green-500">{currentLevelConfig?.cashbackPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Limit Harian</p>
                  <p className="text-xl font-bold">
                    {currentLevelConfig?.dailyLimit === -1
                      ? "Unlimited"
                      : formatCurrency(currentLevelConfig?.dailyLimit || 0)}
                  </p>
                </div>
              </div>

              {nextLevel && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress ke {nextLevel.displayName}</span>
                    <span className="font-medium">
                      {formatNumber(Math.max(0, nextLevel.minPoints - userPoints))} poin lagi
                    </span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="missions">
            <TabsList>
              <TabsTrigger value="missions" className="gap-2">
                <Target className="h-4 w-4" />
                Misi Harian
              </TabsTrigger>
              <TabsTrigger value="badges" className="gap-2">
                <Award className="h-4 w-4" />
                Badges
              </TabsTrigger>
            </TabsList>

            <TabsContent value="missions" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Misi Hari Ini</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedMissions}/{missions.length} selesai, {claimedMissions} diklaim
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetMissions} className="gap-2 bg-transparent">
                  <RefreshCw className="h-4 w-4" />
                  Reset Misi
                </Button>
              </div>
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} onClaim={() => handleClaimMission(mission.id)} />
              ))}
            </TabsContent>

            <TabsContent value="badges" className="mt-4 space-y-6">
              {/* Earned Badges */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Badge Diperoleh ({earnedBadges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {earnedBadges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>

              {/* Progress Badges */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Dalam Progress ({progressBadges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {progressBadges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <LuckySpin />
          <Leaderboard />

          {/* Referral Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ajak Teman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ajak teman bergabung dan dapatkan 5.000 poin untuk setiap teman yang mendaftar!
              </p>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Kode Referral Kamu</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-lg font-bold">
                    {user?.username?.toUpperCase() || "USER"}2024
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${user?.username?.toUpperCase() || "USER"}2024`)
                      toast.success("Kode referral disalin!")
                    }}
                  >
                    Salin
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Referral</span>
                <span className="font-semibold">12 orang</span>
              </div>
              <Button className="w-full">
                <Gift className="h-4 w-4 mr-2" />
                Bagikan Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
