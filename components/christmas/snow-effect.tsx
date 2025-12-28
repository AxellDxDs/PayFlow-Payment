"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SnowflakeProps {
  style?: React.CSSProperties
  size: number
}

const SnowflakeSVG = ({ style, size }: SnowflakeProps) => (
  <svg
    className="absolute text-white/40 dark:text-white/20 pointer-events-none"
    style={style}
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path
      d="M12 0L12 24M0 12L24 12M3.5 3.5L20.5 20.5M20.5 3.5L3.5 20.5M12 2L10 5L12 8L14 5L12 2M12 16L10 19L12 22L14 19L12 16M2 12L5 10L8 12L5 14L2 12M16 12L19 10L22 12L19 14L16 12"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
    />
  </svg>
)

interface Snowflake {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
  wobble: number
}

interface SnowEffectProps {
  enabled?: boolean
  intensity?: "light" | "medium" | "heavy"
  className?: string
}

export function SnowEffect({ enabled = true, intensity = "medium", className }: SnowEffectProps) {
  const [snowflakes, setSnowflakes] = React.useState<Snowflake[]>([])
  const [isClient, setIsClient] = React.useState(false)

  const snowflakeCount = React.useMemo(() => {
    switch (intensity) {
      case "light":
        return 20
      case "medium":
        return 40
      case "heavy":
        return 70
      default:
        return 40
    }
  }, [intensity])

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  React.useEffect(() => {
    if (!enabled || !isClient) {
      setSnowflakes([])
      return
    }

    const flakes: Snowflake[] = Array.from({ length: snowflakeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 12,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.4,
      wobble: Math.random() * 30 - 15,
    }))

    setSnowflakes(flakes)
  }, [enabled, snowflakeCount, isClient])

  if (!enabled || !isClient || snowflakes.length === 0) return null

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-[100] overflow-hidden", className)}>
      {snowflakes.map((flake) => (
        <SnowflakeSVG
          key={flake.id}
          size={flake.size}
          style={{
            left: `${flake.x}%`,
            top: "-20px",
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            transform: `translateX(${flake.wobble}px)`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: var(--snow-opacity, 0.3);
          }
          95% {
            opacity: var(--snow-opacity, 0.3);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
