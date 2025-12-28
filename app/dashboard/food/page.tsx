"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RestaurantCard } from "@/components/food/restaurant-card"
import { RestaurantDetailSheet } from "@/components/food/restaurant-detail-sheet"
import { CartSheet } from "@/components/food/cart-sheet"
import { mockRestaurants } from "@/lib/mock-data"
import type { Restaurant } from "@/lib/types"
import { Search, MapPin, SlidersHorizontal, Star, Flame } from "@/components/icons"

const categories = [
  { id: "all", label: "Semua", icon: null },
  { id: "promo", label: "Promo", icon: Flame },
  { id: "fast-food", label: "Fast Food", icon: null },
  { id: "indonesian", label: "Indonesian", icon: null },
  { id: "coffee", label: "Coffee", icon: null },
  { id: "pizza", label: "Pizza", icon: null },
]

const sortOptions = [
  { id: "recommended", label: "Rekomendasi" },
  { id: "nearest", label: "Terdekat" },
  { id: "rating", label: "Rating Tertinggi" },
  { id: "fastest", label: "Tercepat" },
]

export default function FoodPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [selectedSort, setSelectedSort] = React.useState("recommended")
  const [selectedRestaurant, setSelectedRestaurant] = React.useState<Restaurant | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  // Filter restaurants
  let filteredRestaurants = mockRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Apply category filter
  if (selectedCategory !== "all" && selectedCategory !== "promo") {
    filteredRestaurants = filteredRestaurants.filter((r) =>
      r.category.some((c) => c.toLowerCase().includes(selectedCategory.replace("-", " "))),
    )
  }
  if (selectedCategory === "promo") {
    filteredRestaurants = filteredRestaurants.filter((r) => r.isFeatured)
  }

  // Sort
  filteredRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (selectedSort) {
      case "nearest":
        return a.distance - b.distance
      case "rating":
        return b.rating - a.rating
      case "fastest":
        return Number.parseInt(a.deliveryTime) - Number.parseInt(b.deliveryTime)
      default:
        return 0
    }
  })

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setDetailOpen(true)
  }

  const featuredRestaurants = mockRestaurants.filter((r) => r.isFeatured)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pesan Makanan</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Jakarta Selatan</span>
            <Button variant="link" className="h-auto p-0 text-primary text-sm">
              Ubah
            </Button>
          </div>
        </div>
        <CartSheet />
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari restaurant atau makanan..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon && <cat.icon className="h-4 w-4 mr-1" />}
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Featured Restaurants */}
      {selectedCategory === "all" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Restaurant Pilihan
            </h2>
            <Button variant="ghost" size="sm">
              Lihat Semua
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Urutkan:</span>
        {sortOptions.map((opt) => (
          <Badge
            key={opt.id}
            variant={selectedSort === opt.id ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedSort(opt.id)}
          >
            {opt.label}
          </Badge>
        ))}
      </div>

      {/* All Restaurants */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selectedCategory === "all" ? "Semua Restaurant" : `Restaurant ${selectedCategory}`}
        </h2>
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Tidak ada restaurant ditemukan</p>
              <p className="text-sm text-muted-foreground">Coba kata kunci lain</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Restaurant Detail Sheet */}
      <RestaurantDetailSheet restaurant={selectedRestaurant} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}
