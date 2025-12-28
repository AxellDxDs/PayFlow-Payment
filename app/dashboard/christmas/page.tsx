"use client"

import { ChristmasEvent } from "@/components/christmas/christmas-event"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export default function ChristmasPage() {
  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Christmas & New Year Event 2025-2026</h1>
          <p className="text-muted-foreground">Rayakan momen spesial dengan berbagai hadiah menarik!</p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fade-up" delay={100}>
        <ChristmasEvent variant="full" showMissions={true} showPromos={true} showCountdown={true} />
      </ScrollAnimation>
    </div>
  )
}
