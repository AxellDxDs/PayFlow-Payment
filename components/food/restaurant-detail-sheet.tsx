"use client"

import * as React from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MenuItemCard } from "@/components/food/menu-item-card"
import type { Restaurant, MenuItem } from "@/lib/types"
import { mockMenuItems } from "@/lib/mock-data"
import { Star, Clock, MapPin, Bike, Heart } from "@/components/icons"
import { formatCurrency } from "@/lib/utils/format"

interface RestaurantDetailSheetProps {
  restaurant: Restaurant | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RestaurantDetailSheet({ restaurant, open, onOpenChange }: RestaurantDetailSheetProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)

  if (!restaurant) return null

  // Get menu items for this restaurant (simulated)
  const menuItems = mockMenuItems.filter((item) => item.restaurantId === restaurant.id)

  // Group by category
  const categories = [...new Set(menuItems.map((item) => item.category))]

  // Add some sample items if none exist
  const displayItems: MenuItem[] =
    menuItems.length > 0
      ? menuItems
      : [
          {
            id: `${restaurant.id}-1`,
            restaurantId: restaurant.id,
            name: "Menu Spesial 1",
            description: "Menu andalan dari restaurant ini",
            image: `/placeholder.svg?height=128&width=128&query=special food 1`,
            price: 45000,
            category: "Spesial",
            isPopular: true,
            isAvailable: true,
          },
          {
            id: `${restaurant.id}-2`,
            restaurantId: restaurant.id,
            name: "Menu Spesial 2",
            description: "Hidangan lezat pilihan chef",
            image: `/placeholder.svg?height=128&width=128&query=special food 2`,
            price: 55000,
            category: "Spesial",
            isPopular: false,
            isAvailable: true,
          },
          {
            id: `${restaurant.id}-3`,
            restaurantId: restaurant.id,
            name: "Minuman Segar",
            description: "Minuman dingin menyegarkan",
            image: `/placeholder.svg?height=128&width=128&query=fresh drink`,
            price: 15000,
            category: "Minuman",
            isPopular: true,
            isAvailable: true,
          },
        ]

  const displayCategories = [...new Set(displayItems.map((item) => item.category))]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0">
        {/* Header Image */}
        <div className="relative h-48">
          <img
            src={restaurant.image || `/placeholder.svg?height=192&width=400&query=${restaurant.name} restaurant`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl font-bold">{restaurant.name}</h2>
            <div className="flex flex-wrap gap-1 mt-1">
              {restaurant.category.map((cat) => (
                <Badge key={cat} variant="secondary" className="bg-white/20 text-white text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{restaurant.rating}</span>
              <span className="text-muted-foreground">({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.distance} km</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Bike className="h-4 w-4 text-muted-foreground" />
            <span>Ongkir: {formatCurrency(restaurant.deliveryFee)}</span>
            {restaurant.isOpen ? (
              <Badge className="bg-green-500/10 text-green-500">Buka</Badge>
            ) : (
              <Badge variant="secondary">Tutup</Badge>
            )}
          </div>
        </div>

        {/* Menu */}
        <Tabs defaultValue={displayCategories[0] || "all"} className="flex-1">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full justify-start overflow-x-auto">
              {displayCategories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-380px)] p-4">
            {displayCategories.map((cat) => (
              <TabsContent key={cat} value={cat} className="space-y-3 mt-0">
                {displayItems
                  .filter((item) => item.category === cat)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
