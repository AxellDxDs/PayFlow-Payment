"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CryptoPriceCard } from "@/components/crypto/crypto-price-card"
import { CryptoPortfolio } from "@/components/crypto/crypto-portfolio"
import { CryptoChart } from "@/components/crypto/crypto-chart"
import { TradePanel } from "@/components/crypto/trade-panel"
import { PriceAlertDialog } from "@/components/crypto/price-alert-dialog"
import { useCryptoPrices } from "@/lib/hooks/use-crypto-prices"
import type { CryptoAsset } from "@/lib/types"
import { Search, Bell, RefreshCw, TrendingUp, History } from "@/components/icons"

export default function CryptoPage() {
  const { prices, isLoading } = useCryptoPrices()
  const [selectedAsset, setSelectedAsset] = React.useState<CryptoAsset | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("market")

  // Set default selected asset
  React.useEffect(() => {
    if (prices.length > 0 && !selectedAsset) {
      setSelectedAsset(prices[0])
    }
  }, [prices, selectedAsset])

  // Update selected asset when prices change
  React.useEffect(() => {
    if (selectedAsset) {
      const updated = prices.find((p) => p.id === selectedAsset.id)
      if (updated) {
        setSelectedAsset(updated)
      }
    }
  }, [prices, selectedAsset])

  const filteredPrices = prices.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Crypto Trading</h1>
          <p className="text-muted-foreground">Trade dan monitor cryptocurrency favorit Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            Riwayat
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="market">
            <TrendingUp className="h-4 w-4 mr-2" />
            Market
          </TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6 mt-4">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart & Trade */}
            <div className="lg:col-span-2 space-y-6">
              {selectedAsset && (
                <>
                  <CryptoChart asset={selectedAsset} />

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <PriceAlertDialog asset={selectedAsset}>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Bell className="h-4 w-4 mr-2" />
                        Price Alert
                      </Button>
                    </PriceAlertDialog>
                  </div>

                  <TradePanel asset={selectedAsset} />
                </>
              )}
            </div>

            {/* Right Column - Price List */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Daftar Harga</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari crypto..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    filteredPrices.map((asset) => (
                      <CryptoPriceCard
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAsset?.id === asset.id}
                        onClick={() => setSelectedAsset(asset)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CryptoPortfolio />

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Aset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredPrices.slice(0, 4).map((asset) => (
                  <CryptoPriceCard
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset?.id === asset.id}
                    onClick={() => {
                      setSelectedAsset(asset)
                      setActiveTab("market")
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
