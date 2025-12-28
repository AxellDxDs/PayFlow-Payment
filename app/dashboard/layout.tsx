"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ChatWidget } from "@/components/support/chat-widget"
import { SnowEffect } from "@/components/christmas/snow-effect"
import { ChristmasFloatingButton } from "@/components/christmas/christmas-floating-button"
import { useAppStore } from "@/lib/store"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"
import { Loader2 } from "@/components/icons"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, sidebarOpen, hasHydrated, isNewUser, isProfileComplete } = useAppStore()
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [displayedChildren, setDisplayedChildren] = React.useState(children)
  const [snowEnabled, setSnowEnabled] = React.useState(true)

  React.useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (isNewUser && !isProfileComplete) {
        router.push("/login")
      }
    }
  }, [hasHydrated, isAuthenticated, isNewUser, isProfileComplete, router])

  React.useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setDisplayedChildren(children)
      setIsTransitioning(false)
    }, 150)
    return () => clearTimeout(timer)
  }, [pathname, children])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (isNewUser && !isProfileComplete)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Mengalihkan...</p>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <SnowEffect enabled={snowEnabled} intensity="light" />

        <Sidebar />
        <Header />
        <main
          className={cn(
            "pt-20 min-h-screen transition-all duration-300",
            sidebarOpen ? "lg:pl-64 pl-0" : "lg:pl-20 pl-0",
          )}
        >
          <div
            className={cn(
              "p-4 md:p-6 lg:p-8 max-w-7xl mx-auto transition-all duration-300 ease-out",
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
            )}
          >
            {displayedChildren}
          </div>
        </main>
        <ChatWidget />
        <ChristmasFloatingButton />
      </div>
    </LanguageProvider>
  )
}
