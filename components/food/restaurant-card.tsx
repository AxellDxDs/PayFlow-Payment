"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/lib/types"
import { formatCurrency } from "@/lib/utils/format"
import { Star, Clock, MapPin, Bike } from "@/components/icons"

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick?: () => void
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img
          src={restaurant.image || `/placeholder.svg?height=160&width=300&query=${restaurant.name} restaurant`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.isFeatured && <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">
              Tutup
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{restaurant.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {restaurant.category.map((cat) => (
                <span key={cat} className="text-xs text-muted-foreground">
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-0.5 rounded">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{restaurant.distance} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="h-3 w-3" />
            <span>{formatCurrency(restaurant.deliveryFee)}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: restaurant.priceLevel }).map((_, i) => (
            <span key={i} className="text-primary font-medium">
              $
            </span>
          ))}
          {Array.from({ length: 3 - restaurant.priceLevel }).map((_, i) => (
            <span key={i} className="text-muted-foreground/30 font-medium">
              $
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
