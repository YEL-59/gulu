import { Suspense } from 'react'
import OrderTrackingClient from './OrderTrackingClient'

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading order tracking…</div>}>
      <OrderTrackingClient />
    </Suspense>
  )
}
