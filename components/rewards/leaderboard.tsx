"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLeaderboard, LEVEL_CONFIGS } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import { formatNumber } from "@/lib/utils/format"
import { Trophy, Medal, Crown, TrendingUp } from "@/components/icons"
import { cn } from "@/lib/utils"
import * as React from "react"

export function Leaderboard() {
  const { user, wallet } = useAppStore()

  // Create dynamic leaderboard with user's actual points
  const dynamicLeaderboard = React.useMemo(() => {
    const userPoints = user?.points || wallet?.balancePoints || 0
    const userEntry = {
      rank: 0,
      userId: user?.id || "user-1",
      username: user?.username || "johndoe",
      avatar: user?.avatar || "/professional-avatar.png",
      points: userPoints,
      level: user?.level || "gold",
    }

    // Get other players (excluding the mock user entry)
    const otherPlayers = mockLeaderboard.filter((e) => e.userId !== "user-1")

    // Add user and sort by points
    const allPlayers = [...otherPlayers, userEntry].sort((a, b) => b.points - a.points)

    // Assign ranks
    return allPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
    }))
  }, [user, wallet])

  // Get user's current rank
  const userRank = dynamicLeaderboard.find((e) => e.userId === (user?.id || "user-1"))?.rank || 0

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getLevelColor = (level: string) => {
    return LEVEL_CONFIGS.find((l) => l.name === level)?.color || "#888"
  }

  const renderLeaderboardTab = (entries: typeof dynamicLeaderboard) => {
    const top5 = entries.slice(0, 5)
    const userInTop5 = top5.some((e) => e.userId === (user?.id || "user-1"))
    const userEntry = entries.find((e) => e.userId === (user?.id || "user-1"))

    return (
      <div className="space-y-2">
        {top5.map((entry) => (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              entry.userId === (user?.id || "user-1")
                ? "bg-primary/10 ring-1 ring-primary"
                : "bg-muted/50 hover:bg-muted",
            )}
          >
            <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
            <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
              <img
                src={entry.avatar || `/placeholder.svg?height=40&width=40&query=avatar ${entry.rank}`}
                alt={entry.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">@{entry.username}</p>
                {entry.userId === (user?.id || "user-1") && (
                  <Badge variant="secondary" className="text-xs">
                    Kamu
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getLevelColor(entry.level) }} />
                <span className="text-xs text-muted-foreground capitalize">{entry.level}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">{formatNumber(entry.points)}</p>
              <p className="text-xs text-muted-foreground">poin</p>
            </div>
          </div>
        ))}

        {/* User's rank if not in top 5 */}
        {!userInTop5 && userEntry && (
          <>
            <div className="flex items-center justify-center py-2">
              <span className="text-xs text-muted-foreground">...</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 ring-1 ring-primary">
              <div className="w-8 flex justify-center">{getRankIcon(userEntry.rank)}</div>
              <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                <img
                  src={userEntry.avatar || `/placeholder.svg?height=40&width=40&query=avatar`}
                  alt={userEntry.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">@{userEntry.username}</p>
                  <Badge variant="secondary" className="text-xs">
                    Kamu
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getLevelColor(userEntry.level) }} />
                  <span className="text-xs text-muted-foreground capitalize">{userEntry.level}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatNumber(userEntry.points)}</p>
                <p className="text-xs text-muted-foreground">poin</p>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          {userRank > 0 && (
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Rank #{userRank}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="w-full">
            <TabsTrigger value="weekly" className="flex-1">
              Mingguan
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">
              Bulanan
            </TabsTrigger>
            <TabsTrigger value="alltime" className="flex-1">
              Semua
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4">
            {renderLeaderboardTab(dynamicLeaderboard)}
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            {renderLeaderboardTab(dynamicLeaderboard)}
          </TabsContent>

          <TabsContent value="alltime" className="mt-4">
            {renderLeaderboardTab(dynamicLeaderboard)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
