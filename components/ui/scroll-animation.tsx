"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out" | "flip"
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export function ScrollAnimation({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 500,
  once = true,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasAnimated, setHasAnimated] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated) return
          setIsVisible(true)
          setHasAnimated(true)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once, hasAnimated, threshold])

  const animationStyles: Record<string, string> = {
    "fade-up": "translate-y-8 opacity-0",
    "fade-down": "-translate-y-8 opacity-0",
    "fade-left": "translate-x-8 opacity-0",
    "fade-right": "-translate-x-8 opacity-0",
    "zoom-in": "scale-95 opacity-0",
    "zoom-out": "scale-105 opacity-0",
    flip: "rotateX-90 opacity-0",
  }

  const visibleStyles = "translate-y-0 translate-x-0 scale-100 opacity-100 rotateX-0"

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", isVisible ? visibleStyles : animationStyles[animation], className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Hook for programmatic scroll animations
export function useScrollAnimation(threshold = 0.1) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// Stagger animation wrapper for list items
interface StaggerAnimationProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in"
}

export function StaggerAnimation({
  children,
  className,
  staggerDelay = 100,
  animation = "fade-up",
}: StaggerAnimationProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollAnimation animation={animation} delay={index * staggerDelay}>
          {child}
        </ScrollAnimation>
      ))}
    </div>
  )
}
