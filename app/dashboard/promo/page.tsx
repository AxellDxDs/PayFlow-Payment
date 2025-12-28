import { Suspense } from "react"
import { PromoContent } from "@/components/promo/promo-content"

export default function PromoPage() {
  return (
    <Suspense fallback={null}>
      <PromoContent />
    </Suspense>
  )
}
