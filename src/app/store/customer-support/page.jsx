'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Breadcrumb from '@/components/common/Breadcrumb'
import {
  Truck,
  KeyRound,
  CreditCard,
  User,
  Heart,
  ShoppingCart,
  Wallet,
  Store,
  ClipboardList,
} from 'lucide-react'

const tiles = [
  { title: 'Track Order', icon: Truck, href: '/store/order-tracking' },
  { title: 'Change Password', icon: KeyRound, href: '/store/account/change-password' },
  { title: 'Payment Option', icon: CreditCard, href: '/store/billingAddress' },
  { title: 'User & Account', icon: User, href: '/store/account/profile' },
  { title: 'Wishlist & Compare', icon: Heart, href: '/store/wishlist' },
  { title: 'Shipping & Billing', icon: ClipboardList, href: '/store/account/address' },
  { title: 'Shopping Cart & Wallet', icon: ShoppingCart, href: '/store/cart' },
  { title: 'Sell on Wobuy', icon: Store, href: '/reseller' },
]

export default function CustomerSupportPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // Fake delay to simulate request
      await new Promise((r) => setTimeout(r, 600))
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-6" />

      {/* Top: Quick help tiles */}
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-center">What can we assist you with today?</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiles.map(({ title, icon: Icon, href }) => (
            <Link key={title} href={href} className="group">
              <Card className="border hover:border-[#F36E16] transition-colors">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="h-9 w-9 rounded-md bg-orange-100 text-[#F36E16] flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-medium group-hover:text-[#F36E16]">{title}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact and message section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center md:text-left">Don’t find your answer. Contact with us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">support@wobuy.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">+1 (555) 987-6543</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">Seattle, Washington, USA</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center md:text-left">Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 987 6543" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Write your message here..." />
              </div>
              <Button type="submit" className="w-full md:w-auto bg-[#F36E16] hover:bg-[#e5610d]">
                {status === 'sending' ? 'Sending…' : 'Send'}
              </Button>
              {status === 'success' && (
                <p className="text-sm text-green-600 pt-1">Your message has been sent successfully.</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600 pt-1">Something went wrong. Please try again.</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
