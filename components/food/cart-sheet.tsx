"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils/format"
import { ShoppingCart, Plus, Minus, Trash2, Loader2 } from "@/components/icons"
import * as React from "react"
import { toast } from "sonner"

export function CartSheet() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useAppStore()
  const [isOrdering, setIsOrdering] = React.useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  const deliveryFee = cart.length > 0 ? 8000 : 0
  const total = subtotal + deliveryFee

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang kosong")
      return
    }

    setIsOrdering(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("Pesanan berhasil dibuat! Driver sedang menuju restaurant.")
    clearCart()
    setIsOrdering(false)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang ({cart.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Keranjang kosong</p>
              <p className="text-sm text-muted-foreground">Tambahkan menu favorit Anda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <img
                    src={item.menuItem.image || `/placeholder.svg?height=64&width=64&query=${item.menuItem.name} food`}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.menuItem.name}</h4>
                    <p className="text-sm text-primary font-medium mt-1">{formatCurrency(item.menuItem.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() =>
                          item.quantity > 1
                            ? updateCartQuantity(item.menuItem.id, item.quantity - 1)
                            : removeFromCart(item.menuItem.id)
                        }
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="h-3 w-3 text-destructive" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="flex-col gap-4 border-t pt-4">
            {/* Promo Code */}
            <div className="flex gap-2 w-full">
              <Input placeholder="Kode promo" className="flex-1" />
              <Button variant="outline">Terapkan</Button>
            </div>

            {/* Summary */}
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ongkos kirim</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleOrder} disabled={isOrdering}>
              {isOrdering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses Pesanan...
                </>
              ) : (
                `Pesan Sekarang - ${formatCurrency(total)}`
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
