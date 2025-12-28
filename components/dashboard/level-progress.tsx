"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { LEVEL_CONFIGS } from "@/lib/mock-data"
import { formatNumber, formatCurrency } from "@/lib/utils/format"
import { Trophy, Star, ChevronRight, Sparkles } from "@/components/icons"

export function LevelProgress() {
  const { user } = useAppStore()

  if (!user) return null

  const currentLevelConfig = LEVEL_CONFIGS.find((l) => l.name === user.level)
  const currentLevelIndex = LEVEL_CONFIGS.findIndex((l) => l.name === user.level)
  const nextLevel = LEVEL_CONFIGS[currentLevelIndex + 1]

  const progressToNextLevel = nextLevel
    ? ((user.points - currentLevelConfig!.minPoints) / (nextLevel.minPoints - currentLevelConfig!.minPoints)) * 100
    : 100

  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - user.points : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Level & Rewards</CardTitle>
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3 w-3" />
            Rank #{42}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: `linear-gradient(135deg, ${currentLevelConfig?.color}40, ${currentLevelConfig?.color}20)`,
              boxShadow: `0 0 20px ${currentLevelConfig?.color}30`,
            }}
          >
            {currentLevelConfig?.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold" style={{ color: currentLevelConfig?.color }}>
                {currentLevelConfig?.displayName}
              </h3>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-sm text-muted-foreground">{formatNumber(user.points)} Poin</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-accent">Cashback {currentLevelConfig?.cashbackPercentage}%</p>
            <p className="text-xs text-muted-foreground">
              Limit{" "}
              {currentLevelConfig?.dailyLimit === -1
                ? "Unlimited"
                : formatCurrency(currentLevelConfig?.dailyLimit || 0)}
              /hari
            </p>
          </div>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress ke {nextLevel.displayName}</span>
              <span className="font-medium">{formatNumber(pointsToNextLevel)} poin lagi</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatNumber(currentLevelConfig?.minPoints || 0)}</span>
              <span>{formatNumber(nextLevel.minPoints)}</span>
            </div>
          </div>
        )}

        {/* Level Benefits */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Benefit Level Kamu</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{currentLevelConfig?.cashbackPercentage}%</p>
              <p className="text-xs text-muted-foreground">Cashback</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-accent">
                {currentLevelConfig?.dailyLimit === -1 ? "∞" : `${(currentLevelConfig?.dailyLimit || 0) / 1000000}jt`}
              </p>
              <p className="text-xs text-muted-foreground">Limit/Hari</p>
            </div>
          </div>
        </div>

        {/* View All Levels */}
        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Lihat Semua Level & Benefit</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </CardContent>
    </Card>
  )
}
