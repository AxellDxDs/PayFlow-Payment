"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Mission } from "@/lib/types"
import { formatNumber } from "@/lib/utils/format"
import { Target, Clock, Check, Gift, Coins, Percent, CheckCircle2 } from "@/components/icons"
import { cn } from "@/lib/utils"

interface MissionCardProps {
  mission: Mission
  onClaim?: () => void
}

export function MissionCard({ mission, onClaim }: MissionCardProps) {
  const progress = (mission.progress / mission.target) * 100
  const isCompleted = mission.isCompleted
  const isClaimed = mission.isClaimed
  const canClaim = mission.progress >= mission.target && !mission.isClaimed

  const rewardIcon = {
    points: <Coins className="h-4 w-4" />,
    cashback: <Percent className="h-4 w-4" />,
    voucher: <Gift className="h-4 w-4" />,
  }

  const hoursLeft = Math.max(0, Math.floor((new Date(mission.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)))

  return (
    <Card className={cn(isClaimed && "opacity-60 bg-muted/30")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              isClaimed
                ? "bg-green-500/10 text-green-500"
                : isCompleted
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-primary/10 text-primary",
            )}
          >
            {isClaimed ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : isCompleted ? (
              <Gift className="h-6 w-6" />
            ) : (
              <Target className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-sm">{mission.title}</h4>
              <Badge
                variant="secondary"
                className={cn("flex-shrink-0", canClaim && "bg-amber-500/20 text-amber-600 animate-pulse")}
              >
                {rewardIcon[mission.rewardType]}
                <span className="ml-1">
                  {mission.rewardType === "cashback" ? `${mission.reward}%` : `+${formatNumber(mission.reward)}`}
                </span>
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mt-1">{mission.description}</p>

            {/* Progress */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {mission.progress}/{mission.target}
                </span>
              </div>
              <Progress value={progress} className={cn("h-2", isCompleted && "bg-green-500/20 [&>div]:bg-green-500")} />
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{hoursLeft}h tersisa</span>
              </div>

              {canClaim ? (
                <Button size="sm" className="h-7 bg-amber-500 hover:bg-amber-600" onClick={onClaim}>
                  <Gift className="h-3 w-3 mr-1" />
                  Klaim Reward
                </Button>
              ) : isClaimed ? (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Diklaim
                </Badge>
              ) : isCompleted ? (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                  Siap Diklaim
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
