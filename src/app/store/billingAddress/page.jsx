'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Breadcrumb from '@/components/common/Breadcrumb'
import { CreditCard, Wallet, BadgeDollarSign, Store, Truck } from 'lucide-react'

export default function BillingAddress() {
  const router = useRouter()

  const [cart, setCart] = useState({ items: [], subtotal: 0, shipping: 0, discount: 0, tax: 0, total: 0, coupon: '' })
  const [shipDifferent, setShipDifferent] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    address: '',
    country: 'United States',
    region: 'California',
    city: '',
    zip: '',
    phone: '',
  })
  const [shippingAddr, setShippingAddr] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    country: 'United States',
    region: 'California',
    city: '',
    zip: '',
    phone: '',
  })
  const [cardInfo, setCardInfo] = useState({ name: '', number: '', exp: '', cvv: '' })
  const [note, setNote] = useState('')

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('checkoutCart') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setCart({
          items: parsed.items || [],
          subtotal: parsed.subtotal || 0,
          shipping: parsed.shipping ?? 0,
          discount: parsed.discount || 0,
          tax: parsed.tax || 0,
          total: parsed.total || 0,
          coupon: parsed.coupon || '',
        })
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const computedTotals = useMemo(() => {
    const subtotal = cart.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0)
    const shipping = subtotal > 100 ? 0 : 10
    const discount = cart.coupon?.toLowerCase() === 'save24' ? subtotal * 0.24 : cart.discount || 0
    const tax = Math.round(subtotal * 0.12 * 100) / 100
    const total = Math.max(subtotal + shipping + tax - discount, 0)
    return { subtotal, shipping, discount, tax, total }
  }, [cart])

  const placeOrder = async () => {
    // Validate required fields
    if (!billing.firstName || !billing.lastName || !billing.email || !billing.address) {
      alert('Please fill in all required billing fields')
      return
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      // Import order processor
      const { processOrder } = await import('@/lib/utils/orderProcessor')
      
      // Process the order and create purchase records
      const { order, purchaseRecords } = processOrder(
        {
          billing,
          shipping: shipDifferent ? shippingAddr : billing,
          paymentMethod,
          note,
        },
        cart.items
      )

      // Save order and purchase records
      // In production, this would call an API that saves to database
      if (typeof window !== 'undefined') {
        // Save order
        const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
        existingOrders.push(order)
        localStorage.setItem('userOrders', JSON.stringify(existingOrders))

        // Save purchase records for resellers
        if (purchaseRecords.length > 0) {
          try {
            // Load existing purchase records from localStorage
            // In production, this would be handled by the API/database
            const existingPurchasesJson = localStorage.getItem('resellerPurchases')
            const existingPurchases = existingPurchasesJson 
              ? JSON.parse(existingPurchasesJson)
              : []
            
            const updatedPurchases = [...existingPurchases, ...purchaseRecords]
            localStorage.setItem('resellerPurchases', JSON.stringify(updatedPurchases))
            
            console.log('Created purchase records:', purchaseRecords.length)
            console.log('Purchase records:', purchaseRecords)
          } catch (e) {
            console.warn('Could not save purchase records to localStorage:', e)
          }
        }

        // Clear cart
        localStorage.removeItem('checkoutCart')
      }

      // In production, you would also call the API:
      // try {
      //   const response = await fetch('/api/orders', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ order, purchaseRecords }),
      //   })
      //   if (!response.ok) throw new Error('Failed to save order')
      // } catch (apiError) {
      //   console.error('API error:', apiError)
      //   // Still allow order to proceed in demo mode
      // }

      // Redirect to success page
      router.push('/store/order-success')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('There was an error placing your order. Please try again.')
    }
  }

  const field = (objSetter) => (e) => objSetter((p) => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Billing Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="firstName" placeholder="First name" value={billing.firstName} onChange={field(setBilling)} />
                  <Input name="lastName" placeholder="Last name" value={billing.lastName} onChange={field(setBilling)} />
                  <Input name="company" placeholder="Company Name (optional)" value={billing.company} onChange={field(setBilling)} className="md:col-span-2" />
                </div>
                <Input name="email" type="email" placeholder="Email" value={billing.email} onChange={field(setBilling)} />
                <Input name="address" placeholder="Address" value={billing.address} onChange={field(setBilling)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={billing.country} onValueChange={(v) => setBilling((p) => ({ ...p, country: v }))}>
                    <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input name="region" placeholder="Region/State" value={billing.region} onChange={field(setBilling)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input name="city" placeholder="City" value={billing.city} onChange={field(setBilling)} />
                  <Input name="zip" placeholder="Zip Code" value={billing.zip} onChange={field(setBilling)} />
                  <Input name="phone" placeholder="Phone Number" value={billing.phone} onChange={field(setBilling)} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox id="diff" checked={shipDifferent} onCheckedChange={(v) => setShipDifferent(Boolean(v))} />
                  <Label htmlFor="diff" className="text-sm text-gray-700">Ship to different address</Label>
                </div>

                {shipDifferent && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="firstName" placeholder="First name" value={shippingAddr.firstName} onChange={field(setShippingAddr)} />
                      <Input name="lastName" placeholder="Last name" value={shippingAddr.lastName} onChange={field(setShippingAddr)} />
                    </div>
                    <Input name="company" placeholder="Company Name (optional)" value={shippingAddr.company} onChange={field(setShippingAddr)} />
                    <Input name="address" placeholder="Address" value={shippingAddr.address} onChange={field(setShippingAddr)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={shippingAddr.country} onValueChange={(v) => setShippingAddr((p) => ({ ...p, country: v }))}>
                        <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input name="region" placeholder="Region/State" value={shippingAddr.region} onChange={field(setShippingAddr)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input name="city" placeholder="City" value={shippingAddr.city} onChange={field(setShippingAddr)} />
                      <Input name="zip" placeholder="Zip Code" value={shippingAddr.zip} onChange={field(setShippingAddr)} />
                      <Input name="phone" placeholder="Phone Number" value={shippingAddr.phone} onChange={field(setShippingAddr)} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold">Payment Option</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer">
                    <Wallet className="h-5 w-5 text-[#F36E16]" />
                    <div className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="cod" id="cod" />
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer">
                    <BadgeDollarSign className="h-5 w-5 text-[#F36E16]" />
                    <div className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="venmo" id="venmo" />
                      <span>Venmo</span>
                    </div>
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer">
                    <Wallet className="h-5 w-5 text-[#F36E16]" />
                    <div className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <span>Paypal</span>
                    </div>
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer">
                    <Store className="h-5 w-5 text-[#F36E16]" />
                    <div className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="amazon" id="amazon" />
                      <span>Amazon Pay</span>
                    </div>
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-[#F36E16]" />
                    <div className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="card" id="card" />
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <Input name="name" placeholder="Name on Card" value={cardInfo.name} onChange={(e) => setCardInfo((p) => ({ ...p, name: e.target.value }))} />
                    <Input name="number" placeholder="Card Number" value={cardInfo.number} onChange={(e) => setCardInfo((p) => ({ ...p, number: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input name="exp" placeholder="Expire Date" value={cardInfo.exp} onChange={(e) => setCardInfo((p) => ({ ...p, exp: e.target.value }))} />
                      <Input name="cvv" placeholder="CVV" value={cardInfo.cvv} onChange={(e) => setCardInfo((p) => ({ ...p, cvv: e.target.value }))} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <h2 className="text-xl font-semibold">Additional Information</h2>
                <Textarea placeholder="Order Notes (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              </CardContent>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="space-y-3">
                  {cart.items.length === 0 ? (
                    <div className="text-sm text-gray-600">No items added yet.</div>
                  ) : (
                    cart.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-3">
                        <img src={it.image} alt={it.name} className="h-12 w-12 rounded border object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{it.name}</p>
                          <p className="text-xs text-gray-600">Qty {it.quantity}</p>
                        </div>
                        <div className="text-sm font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Sub-total</span><span>${computedTotals.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{computedTotals.shipping === 0 ? 'Free' : `$${computedTotals.shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span>Discount</span><span>{computedTotals.discount ? `$${computedTotals.discount.toFixed(2)}` : '$0'}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${computedTotals.tax.toFixed(2)}</span></div>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-sm">Total</span>
                  <span className="text-xl font-semibold">${computedTotals.total.toFixed(2)} USD</span>
                </div>
                <Button onClick={placeOrder} className="w-full bg-[#F36E16] hover:bg-[#e06212] h-11">
                  PLACE ORDER
                </Button>
              </CardContent>
            </Card>
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Orders placed before 3PM ship same day
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}