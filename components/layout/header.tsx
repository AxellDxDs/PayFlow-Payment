"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSelector } from "@/components/language-selector"
import {
  Bell,
  Search,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  Shield,
  Globe,
  Menu,
  ArrowUpRight,
  Send,
  ArrowDownLeft,
  QrCode,
  Smartphone,
  Zap,
  Bitcoin,
  UtensilsCrossed,
  CreditCard,
  Receipt,
  Wallet,
  X,
  ChevronRight,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils/format"

export function Header() {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const {
    user,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    sidebarOpen,
    toggleSidebar,
    logout,
    hasHydrated,
  } = useAppStore()

  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mounted, setMounted] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const allFeatures = React.useMemo(
    () => [
      {
        icon: ArrowUpRight,
        label: t.transactions.topup,
        href: "/dashboard/topup",
        description: t.nav.wallet,
        color: "text-green-500",
      },
      {
        icon: Send,
        label: t.transactions.transfer,
        href: "/dashboard/transfer",
        description: t.nav.transactions,
        color: "text-blue-500",
      },
      {
        icon: ArrowDownLeft,
        label: t.transactions.withdraw,
        href: "/dashboard/withdraw",
        description: t.nav.wallet,
        color: "text-orange-500",
      },
      {
        icon: QrCode,
        label: "QRIS",
        href: "/dashboard/qris",
        description: t.transactions.payment,
        color: "text-purple-500",
      },
      {
        icon: Smartphone,
        label: t.nav.pulsa,
        href: "/dashboard/pulsa",
        description: t.transactions.types.pulsa,
        color: "text-red-500",
      },
      {
        icon: Wallet,
        label: "Top Up E-Wallet",
        href: "/dashboard/ewallet",
        description: t.nav.wallet,
        color: "text-teal-500",
      },
      {
        icon: CreditCard,
        label: "Top Up Kartu",
        href: "/dashboard/topup-card",
        description: t.nav.wallet,
        color: "text-amber-500",
      },
      {
        icon: Zap,
        label: t.nav.bills,
        href: "/dashboard/bills",
        description: t.transactions.types.bills,
        color: "text-yellow-500",
      },
      {
        icon: Bitcoin,
        label: t.nav.crypto,
        href: "/dashboard/crypto",
        description: t.transactions.types.crypto,
        color: "text-amber-500",
      },
      {
        icon: UtensilsCrossed,
        label: t.nav.food,
        href: "/dashboard/food",
        description: t.transactions.types.food,
        color: "text-emerald-500",
      },
      {
        icon: CreditCard,
        label: "Kartu Saya",
        href: "/dashboard/cards",
        description: t.nav.wallet,
        color: "text-indigo-500",
      },
      {
        icon: Receipt,
        label: t.nav.bills,
        href: "/dashboard/bills",
        description: t.transactions.types.bills,
        color: "text-slate-500",
      },
      {
        icon: User,
        label: t.settings.profile,
        href: "/dashboard/settings",
        description: t.settings.title,
        color: "text-blue-500",
      },
      {
        icon: Shield,
        label: t.settings.security,
        href: "/dashboard/settings",
        description: t.settings.title,
        color: "text-green-500",
      },
      {
        icon: Settings,
        label: t.settings.title,
        href: "/dashboard/settings",
        description: t.settings.title,
        color: "text-gray-500",
      },
      {
        icon: Globe,
        label: t.settings.language,
        href: "/dashboard/settings",
        description: t.settings.selectLanguage,
        color: "text-blue-500",
      },
    ],
    [t],
  )

  const filteredFeatures = React.useMemo(() => {
    if (!searchQuery.trim()) return allFeatures
    const query = searchQuery.toLowerCase()
    return allFeatures.filter(
      (feature) => feature.label.toLowerCase().includes(query) || feature.description.toLowerCase().includes(query),
    )
  }, [searchQuery, allFeatures])

  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleFeatureSelect = (href: string) => {
    setSearchOpen(false)
    setSearchQuery("")
    router.push(href)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleThemeToggle = React.useCallback(() => {
    const currentTheme = resolvedTheme || theme || "dark"
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }, [resolvedTheme, theme, setTheme])

  const isDark = mounted ? (resolvedTheme || theme) === "dark" : true
  const ThemeIcon = isDark ? Sun : Moon

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300",
          sidebarOpen ? "left-0 lg:left-64" : "left-0 lg:left-20",
        )}
      >
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:block flex-1 max-w-md">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground bg-secondary/50 border-0 hover:bg-secondary/80 transition-all"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                <span>{t.common.search}...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            <LanguageSelector />

            {mounted && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="transition-all hover:scale-105"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <ThemeIcon className="h-5 w-5" />
              </Button>
            )}

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative transition-all hover:scale-105">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>{t.settings.notifications}</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        markAllNotificationsRead()
                      }}
                    >
                      {t.common.seeAll}
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        className={cn(
                          "flex flex-col items-start gap-1 p-3 cursor-pointer transition-colors",
                          !notif.isRead && "bg-primary/5",
                        )}
                        onSelect={(e) => {
                          e.preventDefault()
                          markNotificationRead(notif.id)
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-medium text-sm">{notif.title}</span>
                          {!notif.isRead && <span className="h-2 w-2 rounded-full bg-primary ml-auto animate-pulse" />}
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-2">{notif.message}</span>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(notif.createdAt)}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">{t.common.noData}</div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary">{t.common.seeAll}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-2 sm:pr-3 transition-all hover:scale-105">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {hasHydrated ? user?.fullName || user?.username || "User" : "..."}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.fullName || "User"}</span>
                    <span className="text-xs font-normal text-muted-foreground">@{user?.username || "user"}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/settings" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {t.settings.profile}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    {t.settings.security}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    {t.settings.title}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    {t.settings.language}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.auth.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen} modal={false}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b">
            <DialogTitle className="sr-only">{t.common.search}</DialogTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder={`${t.common.search}...`}
                className="pl-10 pr-10 border-0 focus-visible:ring-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredFeatures.length > 0 ? (
              <div className="space-y-1">
                {filteredFeatures.map((feature, index) => (
                  <button
                    key={`${feature.label}-${index}`}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/80 transition-all group text-left"
                    onClick={() => handleFeatureSelect(feature.href)}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg bg-muted flex items-center justify-center transition-transform group-hover:scale-110",
                        feature.color,
                      )}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{feature.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{feature.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {t.common.noData} "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Enter</span>
              <span>ESC {t.common.close}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
