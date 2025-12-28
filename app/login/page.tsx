"use client"

import * as React from "react"
import { LoginForm } from "@/components/auth/login-form"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Animated background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl transition-all duration-1000",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl transition-all duration-1000 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20",
          )}
        />
        {/* Additional floating elements */}
        <div
          className={cn(
            "absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl transition-all duration-1000 delay-500",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-50",
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl transition-all duration-1000 delay-700",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-50",
          )}
        />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Login form with entrance animation */}
      <div
        className={cn(
          "relative z-10 transition-all duration-700 ease-out",
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95",
        )}
      >
        <LoginForm />
      </div>
    </main>
  )
}
