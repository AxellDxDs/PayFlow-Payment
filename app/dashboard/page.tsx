"use client"
import { BalanceCards } from "@/components/dashboard/balance-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { LevelProgress } from "@/components/dashboard/level-progress"
import { PromoBanner } from "@/components/dashboard/promo-banner"
import { VoucherSection } from "@/components/dashboard/voucher-section"
import { PromoAds } from "@/components/dashboard/promo-ads"
import { QuickServices } from "@/components/dashboard/quick-services"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ChristmasEvent } from "@/components/christmas/christmas-event"
import { useAppStore } from "@/lib/store"
import { useLanguage } from "@/lib/i18n/language-context"

export default function DashboardPage() {
  const { user } = useAppStore()
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <ChristmasEvent variant="banner" showCountdown={true} />
      </ScrollAnimation>

      <ScrollAnimation animation="fade-up" delay={100}>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-balance">
            {t.dashboard.welcome}, {user?.fullName?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
      </ScrollAnimation>

      {/* Balance Cards */}
      <ScrollAnimation animation="fade-up" delay={200}>
        <BalanceCards />
      </ScrollAnimation>

      {/* Quick Actions */}
      <ScrollAnimation animation="fade-up" delay={300}>
        <QuickActions />
      </ScrollAnimation>

      {/* Promo Ads - Data & Kuota */}
      <ScrollAnimation animation="fade-up" delay={400}>
        <PromoAds />
      </ScrollAnimation>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Transactions & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Promo Banner */}
          <ScrollAnimation animation="fade-left" delay={500}>
            <PromoBanner />
          </ScrollAnimation>

          {/* Quick Services */}
          <ScrollAnimation animation="fade-left" delay={600}>
            <QuickServices />
          </ScrollAnimation>

          <ScrollAnimation animation="fade-left" delay={700}>
            <SpendingChart />
          </ScrollAnimation>

          <ScrollAnimation animation="fade-left" delay={800}>
            <RecentTransactions />
          </ScrollAnimation>
        </div>

        {/* Right Column - Level Progress & Vouchers */}
        <div className="space-y-6">
          <ScrollAnimation animation="fade-right" delay={500}>
            <LevelProgress />
          </ScrollAnimation>

          <ScrollAnimation animation="fade-right" delay={600}>
            <VoucherSection />
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}
