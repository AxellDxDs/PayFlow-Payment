"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MenuItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils/format"
import { Plus, Flame } from "@/components/icons"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useAppStore()

  const handleAddToCart = () => {
    addToCart({
      menuItem: item,
      quantity: 1,
    })
    toast.success(`${item.name} ditambahkan ke keranjang`)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={item.image || `/placeholder.svg?height=128&width=128&query=${item.name} food`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {item.isPopular && (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-xs">
              <Flame className="h-3 w-3 mr-1" />
              Populer
            </Badge>
          )}
        </div>
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
            <Button size="sm" onClick={handleAddToCart} disabled={!item.isAvailable} className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
