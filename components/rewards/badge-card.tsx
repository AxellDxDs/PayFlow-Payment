"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Badge } from "@/lib/types"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/format"
import { Check, Lock } from "@/components/icons"

interface BadgeCardProps {
  badge: Badge
  onClick?: () => void
}

export function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const progress = badge.maxProgress ? (badge.progress || 0 / badge.maxProgress) * 100 : 0

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg",
        badge.isEarned ? "bg-gradient-to-br from-primary/5 to-accent/5" : "opacity-70",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "h-14 w-14 rounded-xl flex items-center justify-center text-2xl relative",
              badge.isEarned ? "bg-primary/10" : "bg-muted",
            )}
          >
            {badge.icon}
            {badge.isEarned && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            {!badge.isEarned && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-muted-foreground/50 flex items-center justify-center">
                <Lock className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{badge.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{badge.description}</p>

            {badge.isEarned ? (
              <p className="text-xs text-green-500 mt-2">Diperoleh {formatDate(badge.earnedAt!)}</p>
            ) : badge.maxProgress ? (
              <div className="mt-2 space-y-1">
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  {badge.progress} / {badge.maxProgress}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">{badge.requirement}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
