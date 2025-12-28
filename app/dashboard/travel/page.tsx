"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import {
  Plane,
  Train,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  Search,
  ArrowRight,
  Loader2,
  Check,
  Star,
  Wifi,
  UtensilsCrossed,
  Briefcase,
} from "@/components/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Airlines data
const airlines = [
  { id: "garuda", name: "Garuda Indonesia", logo: "GA", color: "bg-sky-600" },
  { id: "lion", name: "Lion Air", logo: "JT", color: "bg-red-500" },
  { id: "citilink", name: "Citilink", logo: "QG", color: "bg-green-500" },
  { id: "airasia", name: "AirAsia", logo: "QZ", color: "bg-red-600" },
  { id: "batik", name: "Batik Air", logo: "ID", color: "bg-blue-500" },
  { id: "sriwijaya", name: "Sriwijaya Air", logo: "SJ", color: "bg-blue-700" },
]

// Train operators
const trainOperators = [
  { id: "kai", name: "KAI (Kereta Api Indonesia)", logo: "KAI", color: "bg-orange-500" },
  { id: "lrt", name: "LRT Jakarta", logo: "LRT", color: "bg-purple-500" },
  { id: "mrt", name: "MRT Jakarta", logo: "MRT", color: "bg-blue-600" },
  { id: "krl", name: "KRL Commuter Line", logo: "KRL", color: "bg-red-500" },
]

// Cities
const cities = [
  { code: "CGK", name: "Jakarta", airport: "Soekarno-Hatta" },
  { code: "SUB", name: "Surabaya", airport: "Juanda" },
  { code: "DPS", name: "Bali/Denpasar", airport: "Ngurah Rai" },
  { code: "UPG", name: "Makassar", airport: "Sultan Hasanuddin" },
  { code: "BDO", name: "Bandung", airport: "Husein Sastranegara" },
  { code: "JOG", name: "Yogyakarta", airport: "Adisucipto" },
  { code: "SRG", name: "Semarang", airport: "Ahmad Yani" },
  { code: "MES", name: "Medan", airport: "Kualanamu" },
  { code: "PDG", name: "Padang", airport: "Minangkabau" },
  { code: "PKU", name: "Pekanbaru", airport: "Sultan Syarif Kasim II" },
  { code: "BTH", name: "Batam", airport: "Hang Nadim" },
  { code: "PLM", name: "Palembang", airport: "Sultan Mahmud Badaruddin II" },
]

// Train stations
const trainStations = [
  { code: "GMR", name: "Gambir", city: "Jakarta" },
  { code: "PSE", name: "Pasar Senen", city: "Jakarta" },
  { code: "BD", name: "Bandung", city: "Bandung" },
  { code: "YK", name: "Yogyakarta (Tugu)", city: "Yogyakarta" },
  { code: "SGU", name: "Surabaya Gubeng", city: "Surabaya" },
  { code: "SMT", name: "Semarang Tawang", city: "Semarang" },
  { code: "SLO", name: "Solo Balapan", city: "Solo" },
  { code: "ML", name: "Malang", city: "Malang" },
  { code: "CN", name: "Cirebon", city: "Cirebon" },
  { code: "PWT", name: "Purwokerto", city: "Purwokerto" },
]

// Mock flight results
const mockFlights = [
  {
    id: "flight-1",
    airline: airlines[0],
    flightNumber: "GA 204",
    departure: { time: "06:00", city: "Jakarta", code: "CGK" },
    arrival: { time: "07:30", city: "Surabaya", code: "SUB" },
    duration: "1h 30m",
    price: 850000,
    class: "Economy",
    seats: 45,
    amenities: ["wifi", "meal", "baggage"],
  },
  {
    id: "flight-2",
    airline: airlines[1],
    flightNumber: "JT 510",
    departure: { time: "08:15", city: "Jakarta", code: "CGK" },
    arrival: { time: "09:45", city: "Surabaya", code: "SUB" },
    duration: "1h 30m",
    price: 550000,
    class: "Economy",
    seats: 120,
    amenities: ["baggage"],
  },
  {
    id: "flight-3",
    airline: airlines[2],
    flightNumber: "QG 820",
    departure: { time: "10:30", city: "Jakarta", code: "CGK" },
    arrival: { time: "12:00", city: "Surabaya", code: "SUB" },
    duration: "1h 30m",
    price: 480000,
    class: "Economy",
    seats: 80,
    amenities: ["baggage"],
  },
  {
    id: "flight-4",
    airline: airlines[4],
    flightNumber: "ID 6570",
    departure: { time: "14:00", city: "Jakarta", code: "CGK" },
    arrival: { time: "15:30", city: "Surabaya", code: "SUB" },
    duration: "1h 30m",
    price: 750000,
    class: "Economy",
    seats: 60,
    amenities: ["wifi", "meal", "baggage"],
  },
  {
    id: "flight-5",
    airline: airlines[0],
    flightNumber: "GA 310",
    departure: { time: "18:00", city: "Jakarta", code: "CGK" },
    arrival: { time: "19:30", city: "Surabaya", code: "SUB" },
    duration: "1h 30m",
    price: 920000,
    class: "Business",
    seats: 12,
    amenities: ["wifi", "meal", "baggage", "lounge"],
  },
]

// Mock train results
const mockTrains = [
  {
    id: "train-1",
    operator: trainOperators[0],
    trainName: "Argo Bromo Anggrek",
    trainNumber: "KA 1",
    departure: { time: "06:00", station: "Gambir", code: "GMR" },
    arrival: { time: "14:30", station: "Surabaya Gubeng", code: "SGU" },
    duration: "8h 30m",
    price: 450000,
    class: "Eksekutif",
    seats: 50,
    amenities: ["ac", "meal", "toilet", "charging"],
  },
  {
    id: "train-2",
    operator: trainOperators[0],
    trainName: "Taksaka",
    trainNumber: "KA 42",
    departure: { time: "08:00", station: "Gambir", code: "GMR" },
    arrival: { time: "15:00", station: "Yogyakarta", code: "YK" },
    duration: "7h 00m",
    price: 380000,
    class: "Eksekutif",
    seats: 40,
    amenities: ["ac", "meal", "toilet", "charging"],
  },
  {
    id: "train-3",
    operator: trainOperators[0],
    trainName: "Argo Parahyangan",
    trainNumber: "KA 24",
    departure: { time: "07:00", station: "Gambir", code: "GMR" },
    arrival: { time: "10:00", station: "Bandung", code: "BD" },
    duration: "3h 00m",
    price: 150000,
    class: "Eksekutif",
    seats: 80,
    amenities: ["ac", "toilet", "charging"],
  },
  {
    id: "train-4",
    operator: trainOperators[0],
    trainName: "Lodaya",
    trainNumber: "KA 77",
    departure: { time: "09:30", station: "Bandung", code: "BD" },
    arrival: { time: "17:30", station: "Surabaya Gubeng", code: "SGU" },
    duration: "8h 00m",
    price: 320000,
    class: "Bisnis",
    seats: 100,
    amenities: ["ac", "toilet", "charging"],
  },
  {
    id: "train-5",
    operator: trainOperators[0],
    trainName: "Bengawan",
    trainNumber: "KA 150",
    departure: { time: "20:00", station: "Pasar Senen", code: "PSE" },
    arrival: { time: "06:00", station: "Surabaya Gubeng", code: "SGU" },
    duration: "10h 00m",
    price: 280000,
    class: "Ekonomi Premium",
    seats: 150,
    amenities: ["ac", "toilet"],
  },
]

type TransportType = "flight" | "train"

export default function TravelPage() {
  const { wallet, updateWallet, addTransaction } = useAppStore()
  const [transportType, setTransportType] = React.useState<TransportType>("flight")
  const [searchParams, setSearchParams] = React.useState({
    from: "",
    to: "",
    date: new Date(),
    passengers: 1,
    class: "economy",
  })
  const [isSearching, setIsSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const [selectedTicket, setSelectedTicket] = React.useState<(typeof mockFlights)[0] | (typeof mockTrains)[0] | null>(
    null,
  )
  const [isBooking, setIsBooking] = React.useState(false)
  const [bookingDialogOpen, setBookingDialogOpen] = React.useState(false)

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to) {
      toast.error("Pilih kota asal dan tujuan")
      return
    }
    if (searchParams.from === searchParams.to) {
      toast.error("Kota asal dan tujuan tidak boleh sama")
      return
    }

    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSearching(false)
    setHasSearched(true)
  }

  const handleSelectTicket = (ticket: (typeof mockFlights)[0] | (typeof mockTrains)[0]) => {
    setSelectedTicket(ticket)
    setBookingDialogOpen(true)
  }

  const handleBookTicket = async () => {
    if (!selectedTicket || !wallet) return

    const totalPrice = selectedTicket.price * searchParams.passengers
    if (totalPrice > wallet.balanceMain) {
      toast.error("Saldo tidak mencukupi")
      return
    }

    setIsBooking(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateWallet({ balanceMain: wallet.balanceMain - totalPrice })
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: "user-1",
      type: "payment",
      amount: -totalPrice,
      fee: 5000,
      status: "success",
      description: `Tiket ${transportType === "flight" ? "Pesawat" : "Kereta"} - ${"flightNumber" in selectedTicket ? selectedTicket.flightNumber : selectedTicket.trainNumber}`,
      createdAt: new Date(),
    })

    toast.success("Pemesanan berhasil! E-ticket akan dikirim ke email Anda")
    setIsBooking(false)
    setBookingDialogOpen(false)
    setSelectedTicket(null)
    setHasSearched(false)
  }

  const results = transportType === "flight" ? mockFlights : mockTrains
  const locations = transportType === "flight" ? cities : trainStations

  return (
    <div className="space-y-6">
      <ScrollAnimation animation="fade-up">
        <div>
          <h1 className="text-2xl font-bold">Tiket Perjalanan</h1>
          <p className="text-muted-foreground">Pesan tiket pesawat dan kereta api dengan mudah</p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation animation="fade-up" delay={100}>
        <Tabs
          value={transportType}
          onValueChange={(v) => {
            setTransportType(v as TransportType)
            setHasSearched(false)
            setSearchParams((prev) => ({ ...prev, from: "", to: "" }))
          }}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="flight" className="gap-2">
              <Plane className="h-4 w-4" />
              Pesawat
            </TabsTrigger>
            <TabsTrigger value="train" className="gap-2">
              <Train className="h-4 w-4" />
              Kereta Api
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollAnimation>

      {/* Search Form */}
      <ScrollAnimation animation="fade-up" delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Cari {transportType === "flight" ? "Penerbangan" : "Kereta"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{transportType === "flight" ? "Kota Asal" : "Stasiun Asal"}</Label>
                <Select
                  value={searchParams.from}
                  onValueChange={(v) => setSearchParams((prev) => ({ ...prev, from: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Pilih ${transportType === "flight" ? "kota" : "stasiun"} asal`} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.code} value={loc.code}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{loc.name}</span>
                          <span className="text-muted-foreground">({loc.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{transportType === "flight" ? "Kota Tujuan" : "Stasiun Tujuan"}</Label>
                <Select value={searchParams.to} onValueChange={(v) => setSearchParams((prev) => ({ ...prev, to: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Pilih ${transportType === "flight" ? "kota" : "stasiun"} tujuan`} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.code} value={loc.code}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{loc.name}</span>
                          <span className="text-muted-foreground">({loc.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tanggal Keberangkatan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(searchParams.date, "dd MMMM yyyy", { locale: id })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={searchParams.date}
                      onSelect={(date) => date && setSearchParams((prev) => ({ ...prev, date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Jumlah Penumpang</Label>
                <Select
                  value={searchParams.passengers.toString()}
                  onValueChange={(v) => setSearchParams((prev) => ({ ...prev, passengers: Number.parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {num} Penumpang
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select
                  value={searchParams.class}
                  onValueChange={(v) => setSearchParams((prev) => ({ ...prev, class: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transportType === "flight" ? (
                      <>
                        <SelectItem value="economy">Ekonomi</SelectItem>
                        <SelectItem value="business">Bisnis</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="economy">Ekonomi</SelectItem>
                        <SelectItem value="business">Bisnis</SelectItem>
                        <SelectItem value="executive">Eksekutif</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mencari {transportType === "flight" ? "penerbangan" : "kereta"}...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Cari {transportType === "flight" ? "Penerbangan" : "Kereta"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Promo Banner */}
      <ScrollAnimation animation="fade-up" delay={300}>
        <Card className="bg-gradient-to-r from-sky-500 to-blue-600 border-0 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                {transportType === "flight" ? <Plane className="h-8 w-8" /> : <Train className="h-8 w-8" />}
              </div>
              <div className="flex-1">
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">Promo Spesial</Badge>
                <h3 className="text-xl font-bold">
                  Diskon hingga 30% untuk {transportType === "flight" ? "penerbangan" : "kereta"} domestik!
                </h3>
                <p className="text-white/80 text-sm">Berlaku hingga 31 Januari 2025</p>
              </div>
              <Button variant="secondary" size="sm">
                Klaim
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Search Results */}
      {hasSearched && (
        <ScrollAnimation animation="fade-up" delay={100}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {results.length} {transportType === "flight" ? "Penerbangan" : "Kereta"} Tersedia
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Clock className="h-4 w-4 mr-1" />
                  Waktu
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Harga Terendah
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {results.map((item, index) => {
                const isFlightResult = "flightNumber" in item
                return (
                  <ScrollAnimation key={item.id} animation="fade-up" delay={index * 50}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Operator Logo */}
                          <div className="flex items-center gap-3 md:w-40">
                            <div
                              className={cn(
                                "h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0",
                                isFlightResult ? item.airline.color : item.operator.color,
                              )}
                            >
                              {isFlightResult ? item.airline.logo : item.operator.logo}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {isFlightResult ? item.airline.name : item.operator.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isFlightResult ? item.flightNumber : item.trainNumber}
                              </p>
                              {!isFlightResult && <p className="text-xs text-muted-foreground">{item.trainName}</p>}
                            </div>
                          </div>

                          {/* Schedule */}
                          <div className="flex-1 flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-xl font-bold">{item.departure.time}</p>
                              <p className="text-xs text-muted-foreground">
                                {isFlightResult ? item.departure.code : item.departure.station}
                              </p>
                            </div>

                            <div className="flex-1 flex items-center gap-2">
                              <div className="h-px flex-1 bg-border" />
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">{item.duration}</p>
                                {isFlightResult ? (
                                  <Plane className="h-4 w-4 mx-auto text-muted-foreground" />
                                ) : (
                                  <Train className="h-4 w-4 mx-auto text-muted-foreground" />
                                )}
                              </div>
                              <div className="h-px flex-1 bg-border" />
                            </div>

                            <div className="text-center">
                              <p className="text-xl font-bold">{item.arrival.time}</p>
                              <p className="text-xs text-muted-foreground">
                                {isFlightResult ? item.arrival.code : item.arrival.station}
                              </p>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex gap-2 md:w-28">
                            {item.amenities.includes("wifi") && (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center" title="WiFi">
                                <Wifi className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            {item.amenities.includes("meal") && (
                              <div
                                className="h-8 w-8 rounded bg-muted flex items-center justify-center"
                                title="Makanan"
                              >
                                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            {item.amenities.includes("baggage") && (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center" title="Bagasi">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Price & Book */}
                          <div className="text-right md:w-40">
                            <Badge variant="outline" className="mb-1">
                              {item.class}
                            </Badge>
                            <p className="text-xl font-bold text-primary">{formatCurrency(item.price)}</p>
                            <p className="text-xs text-muted-foreground mb-2">{item.seats} kursi tersisa</p>
                            <Button size="sm" onClick={() => handleSelectTicket(item)}>
                              Pilih
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </ScrollAnimation>
      )}

      {/* Popular Routes */}
      {!hasSearched && (
        <ScrollAnimation animation="fade-up" delay={400}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rute Populer</CardTitle>
              <CardDescription>Destinasi favorit pengguna PayFlow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { from: "Jakarta", to: "Bali", price: 650000, rating: 4.8 },
                  { from: "Jakarta", to: "Surabaya", price: 450000, rating: 4.7 },
                  { from: "Jakarta", to: "Yogyakarta", price: 380000, rating: 4.9 },
                  { from: "Bandung", to: "Jakarta", price: 150000, rating: 4.6 },
                  { from: "Jakarta", to: "Medan", price: 850000, rating: 4.5 },
                  { from: "Surabaya", to: "Bali", price: 350000, rating: 4.7 },
                ].map((route, index) => (
                  <ScrollAnimation key={index} animation="zoom-in" delay={index * 50}>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent hover:bg-muted/50 w-full"
                      onClick={() => {
                        const fromCity = cities.find((c) => c.name.includes(route.from))
                        const toCity = cities.find((c) => c.name.includes(route.to))
                        if (fromCity && toCity) {
                          setSearchParams((prev) => ({
                            ...prev,
                            from: fromCity.code,
                            to: toCity.code,
                          }))
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{route.from}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{route.to}</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-muted-foreground text-xs">Mulai {formatCurrency(route.price)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-medium">{route.rating}</span>
                        </div>
                      </div>
                    </Button>
                  </ScrollAnimation>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      )}

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pemesanan</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold",
                      "flightNumber" in selectedTicket ? selectedTicket.airline.color : selectedTicket.operator.color,
                    )}
                  >
                    {"flightNumber" in selectedTicket ? selectedTicket.airline.logo : selectedTicket.operator.logo}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {"flightNumber" in selectedTicket ? selectedTicket.airline.name : selectedTicket.operator.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {"flightNumber" in selectedTicket ? selectedTicket.flightNumber : selectedTicket.trainNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-lg font-bold">{selectedTicket.departure.time}</p>
                    <p className="text-sm text-muted-foreground">
                      {"flightNumber" in selectedTicket
                        ? selectedTicket.departure.code
                        : selectedTicket.departure.station}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-px flex-1 bg-border" />
                    <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{selectedTicket.arrival.time}</p>
                    <p className="text-sm text-muted-foreground">
                      {"flightNumber" in selectedTicket ? selectedTicket.arrival.code : selectedTicket.arrival.station}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="font-medium">{format(searchParams.date, "dd MMMM yyyy", { locale: id })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah Penumpang</span>
                  <span className="font-medium">{searchParams.passengers} orang</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kelas</span>
                  <span className="font-medium">{selectedTicket.class}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga tiket</span>
                  <span>
                    {formatCurrency(selectedTicket.price)} x {searchParams.passengers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya layanan</span>
                  <span>{formatCurrency(5000)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total Pembayaran</span>
                  <span className="text-primary text-lg">
                    {formatCurrency(selectedTicket.price * searchParams.passengers + 5000)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Saldo Anda</span>
                <span className="font-semibold">{formatCurrency(wallet?.balanceMain || 0)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)} className="bg-transparent">
              Batal
            </Button>
            <Button onClick={handleBookTicket} disabled={isBooking}>
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Bayar Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
