"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [displayChildren, setDisplayChildren] = React.useState(children)

  React.useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsAnimating(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
        className,
      )}
    >
      {displayChildren}
    </div>
  )
}

// Animated container for smooth mount/unmount
interface AnimatedPresenceProps {
  children: React.ReactNode
  show: boolean
  className?: string
  animation?: "fade" | "slide-up" | "slide-down" | "scale"
}

export function AnimatedPresence({ children, show, className, animation = "fade" }: AnimatedPresenceProps) {
  const [shouldRender, setShouldRender] = React.useState(show)

  React.useEffect(() => {
    if (show) setShouldRender(true)
  }, [show])

  const handleAnimationEnd = () => {
    if (!show) setShouldRender(false)
  }

  if (!shouldRender) return null

  const animationClasses: Record<string, { enter: string; exit: string }> = {
    fade: {
      enter: "animate-in fade-in duration-200",
      exit: "animate-out fade-out duration-150",
    },
    "slide-up": {
      enter: "animate-in fade-in slide-in-from-bottom-4 duration-300",
      exit: "animate-out fade-out slide-out-to-bottom-4 duration-200",
    },
    "slide-down": {
      enter: "animate-in fade-in slide-in-from-top-4 duration-300",
      exit: "animate-out fade-out slide-out-to-top-4 duration-200",
    },
    scale: {
      enter: "animate-in fade-in zoom-in-95 duration-200",
      exit: "animate-out fade-out zoom-out-95 duration-150",
    },
  }

  return (
    <div
      className={cn(show ? animationClasses[animation].enter : animationClasses[animation].exit, className)}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  )
}
