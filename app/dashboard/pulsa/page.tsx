"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Smartphone,
  Zap,
  Gamepad2,
  Wifi,
  Droplets,
  Tv,
  Loader2,
  Check,
  Phone,
  Search,
  Swords,
  Crosshair,
  Wand2,
  Gem,
  Joystick,
  Skull,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const providers = [
  { id: "telkomsel", name: "Telkomsel", prefix: ["0811", "0812", "0813", "0821", "0822", "0852", "0853"] },
  { id: "indosat", name: "Indosat Ooredoo", prefix: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"] },
  { id: "xl", name: "XL Axiata", prefix: ["0817", "0818", "0819", "0859", "0877", "0878"] },
  { id: "tri", name: "3 (Tri)", prefix: ["0895", "0896", "0897", "0898", "0899"] },
  {
    id: "smartfren",
    name: "Smartfren",
    prefix: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"],
  },
]

const pulsaPackages = [
  { nominal: 5000, price: 6500 },
  { nominal: 10000, price: 11500 },
  { nominal: 15000, price: 16500 },
  { nominal: 20000, price: 21500 },
  { nominal: 25000, price: 26500 },
  { nominal: 50000, price: 51500 },
  { nominal: 100000, price: 101500 },
  { nominal: 200000, price: 202000 },
]

const dataPackages = [
  { name: "1GB / 7 Hari", price: 15000, quota: "1GB", validity: "7 hari" },
  { name: "2GB / 30 Hari", price: 25000, quota: "2GB", validity: "30 hari" },
  { name: "5GB / 30 Hari", price: 50000, quota: "5GB", validity: "30 hari" },
  { name: "10GB / 30 Hari", price: 85000, quota: "10GB", validity: "30 hari" },
  { name: "15GB / 30 Hari", price: 120000, quota: "15GB", validity: "30 hari" },
  { name: "25GB / 30 Hari", price: 175000, quota: "25GB", validity: "30 hari" },
  { name: "50GB / 30 Hari", price: 300000, quota: "50GB", validity: "30 hari" },
  { name: "Unlimited / 30 Hari", price: 450000, quota: "Unlimited", validity: "30 hari" },
]

const gameTopups = [
  { id: "ml", name: "Mobile Legends", icon: Swords },
  { id: "ff", name: "Free Fire", icon: Crosshair },
  { id: "pubg", name: "PUBG Mobile", icon: Skull },
  { id: "genshin", name: "Genshin Impact", icon: Wand2 },
  { id: "valorant", name: "Valorant", icon: Joystick },
  { id: "codm", name: "Call of Duty Mobile", icon: Gamepad2 },
]

const gameDenominations = [
  { diamonds: 86, price: 19000 },
  { diamonds: 172, price: 38000 },
  { diamonds: 257, price: 57000 },
  { diamonds: 344, price: 76000 },
  { diamonds: 514, price: 114000 },
  { diamonds: 706, price: 152000 },
  { diamonds: 1412, price: 304000 },
  { diamonds: 2195, price: 456000 },
]

export default function PulsaPage() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = React.useState<number | null>(null)
  const [selectedGame, setSelectedGame] = React.useState<string | null>(null)
  const [gameId, setGameId] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [tab, setTab] = React.useState("pulsa")

  // Auto-detect provider
  React.useEffect(() => {
    if (phoneNumber.length >= 4) {
      const prefix = phoneNumber.substring(0, 4)
      const provider = providers.find((p) => p.prefix.some((pre) => prefix.startsWith(pre)))
      if (provider) {
        setSelectedProvider(provider.id)
      }
    }
  }, [phoneNumber])

  const handlePurchase = async (type: string, price: number, description: string) => {
    if (!wallet) return

    if (price > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain - price })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: type as "pulsa" | "payment",
      amount: -price,
      fee: 0,
      status: "success",
      description,
      createdAt: new Date(),
    })

    toast.success("Pembelian berhasil!")
    setIsProcessing(false)
    setSelectedPackage(null)
    setPhoneNumber("")
    setGameId("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pulsa & Tagihan</h1>
        <p className="text-muted-foreground">Beli pulsa, paket data, token listrik, dan lainnya</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="pulsa" className="flex flex-col gap-1 py-3">
            <Smartphone className="h-4 w-4" />
            <span className="text-xs">Pulsa</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex flex-col gap-1 py-3">
            <Wifi className="h-4 w-4" />
            <span className="text-xs">Paket Data</span>
          </TabsTrigger>
          <TabsTrigger value="game" className="flex flex-col gap-1 py-3">
            <Gamepad2 className="h-4 w-4" />
            <span className="text-xs">Game</span>
          </TabsTrigger>
          <TabsTrigger value="pln" className="flex flex-col gap-1 py-3">
            <Zap className="h-4 w-4" />
            <span className="text-xs">PLN</span>
          </TabsTrigger>
          <TabsTrigger value="pdam" className="flex flex-col gap-1 py-3">
            <Droplets className="h-4 w-4" />
            <span className="text-xs">PDAM</span>
          </TabsTrigger>
          <TabsTrigger value="tv" className="flex flex-col gap-1 py-3">
            <Tv className="h-4 w-4" />
            <span className="text-xs">TV Kabel</span>
          </TabsTrigger>
        </TabsList>

        {/* Pulsa Tab */}
        <TabsContent value="pulsa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Isi Pulsa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nomor Handphone</Label>
                <Input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={13}
                />
                {selectedProvider && (
                  <p className="text-sm text-primary">
                    Provider: {providers.find((p) => p.id === selectedProvider)?.name}
                  </p>
                )}
              </div>

              {phoneNumber.length >= 10 && (
                <div className="space-y-3">
                  <Label>Pilih Nominal</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {pulsaPackages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors text-center",
                          selectedPackage === idx ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                        )}
                        onClick={() => setSelectedPackage(idx)}
                      >
                        <p className="text-lg font-bold">{formatCurrency(pkg.nominal)}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(pkg.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPackage !== null && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    handlePurchase(
                      "pulsa",
                      pulsaPackages[selectedPackage].price,
                      `Pulsa ${formatCurrency(pulsaPackages[selectedPackage].nominal)} - ${phoneNumber}`,
                    )
                  }
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Bayar {formatCurrency(pulsaPackages[selectedPackage].price)}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Package Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Paket Data Internet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nomor Handphone</Label>
                <Input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={13}
                />
                {selectedProvider && (
                  <p className="text-sm text-primary">
                    Provider: {providers.find((p) => p.id === selectedProvider)?.name}
                  </p>
                )}
              </div>

              {phoneNumber.length >= 10 && (
                <div className="space-y-3">
                  <Label>Pilih Paket</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataPackages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors",
                          selectedPackage === idx ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                        )}
                        onClick={() => setSelectedPackage(idx)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{pkg.quota}</Badge>
                          <span className="text-xs text-muted-foreground">{pkg.validity}</span>
                        </div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(pkg.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPackage !== null && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    handlePurchase(
                      "pulsa",
                      dataPackages[selectedPackage].price,
                      `Paket Data ${dataPackages[selectedPackage].name} - ${phoneNumber}`,
                    )
                  }
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Bayar {formatCurrency(dataPackages[selectedPackage].price)}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Game Top Up Tab - Updated to use icons instead of emojis */}
        <TabsContent value="game" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Top Up Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Pilih Game</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gameTopups.map((game) => (
                    <div
                      key={game.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors text-center",
                        selectedGame === game.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                      )}
                      onClick={() => setSelectedGame(game.id)}
                    >
                      <game.icon className="h-8 w-8 mx-auto text-primary" />
                      <p className="mt-2 font-medium text-sm">{game.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedGame && (
                <>
                  <div className="space-y-2">
                    <Label>ID Game (User ID)</Label>
                    <Input placeholder="Masukkan User ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Cek User ID di menu profil game kamu</p>
                  </div>

                  {gameId && (
                    <div className="space-y-3">
                      <Label>Pilih Nominal</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {gameDenominations.map((denom, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-4 rounded-lg border cursor-pointer transition-colors text-center",
                              selectedPackage === idx
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/50",
                            )}
                            onClick={() => setSelectedPackage(idx)}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <Gem className="h-4 w-4 text-cyan-400" />
                              <p className="text-lg font-bold">{denom.diamonds}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{formatCurrency(denom.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedPackage !== null && gameId && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    handlePurchase(
                      "payment",
                      gameDenominations[selectedPackage].price,
                      `Top Up ${gameTopups.find((g) => g.id === selectedGame)?.name} ${gameDenominations[selectedPackage].diamonds} Diamonds`,
                    )
                  }
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Bayar {formatCurrency(gameDenominations[selectedPackage].price)}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLN Tab */}
        <TabsContent value="pln" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Token Listrik PLN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nomor Meter / ID Pelanggan</Label>
                <Input placeholder="Masukkan nomor meter" />
              </div>

              <div className="space-y-3">
                <Label>Pilih Nominal Token</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[20000, 50000, 100000, 200000, 500000, 1000000].map((nominal, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors text-center",
                        selectedPackage === idx ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                      )}
                      onClick={() => setSelectedPackage(idx)}
                    >
                      <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <p className="font-bold">{formatCurrency(nominal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg" disabled>
                <Zap className="mr-2 h-4 w-4" />
                Beli Token
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PDAM Tab */}
        <TabsContent value="pdam" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Tagihan PDAM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wilayah PDAM</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Pilih Wilayah</option>
                  <option value="jakarta">PDAM DKI Jakarta</option>
                  <option value="bandung">PDAM Kota Bandung</option>
                  <option value="surabaya">PDAM Kota Surabaya</option>
                  <option value="semarang">PDAM Kota Semarang</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Nomor Pelanggan</Label>
                <Input placeholder="Masukkan nomor pelanggan" />
              </div>

              <Button className="w-full bg-transparent" size="lg" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Cek Tagihan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TV Kabel Tab */}
        <TabsContent value="tv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                Tagihan TV Kabel & Internet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Pilih Provider</option>
                  <option value="indihome">IndiHome</option>
                  <option value="firstmedia">First Media</option>
                  <option value="biznet">Biznet</option>
                  <option value="mnc">MNC Vision</option>
                  <option value="transvision">Transvision</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>ID Pelanggan</Label>
                <Input placeholder="Masukkan ID pelanggan" />
              </div>

              <Button className="w-full bg-transparent" size="lg" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Cek Tagihan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
