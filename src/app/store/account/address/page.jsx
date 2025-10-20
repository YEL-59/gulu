'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Breadcrumb from '@/components/common/Breadcrumb'

function AddressForm({ title, data, onChange, onSave }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`${title}-firstName`}>First Name</Label>
            <Input id={`${title}-firstName`} name="firstName" value={data.firstName} onChange={onChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${title}-lastName`}>Last Name</Label>
            <Input id={`${title}-lastName`} name="lastName" value={data.lastName} onChange={onChange} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor={`${title}-company`}>Company Name (Optional)</Label>
            <Input id={`${title}-company`} name="company" value={data.company} onChange={onChange} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor={`${title}-address`}>Address</Label>
            <Input id={`${title}-address`} name="address" value={data.address} onChange={onChange} />
          </div>
          <div className="space-y-1">
            <Label>Country</Label>
            <Select value={data.country} onValueChange={(v) => onChange({ target: { name: 'country', value: v } })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${title}-region`}>Region/State</Label>
            <Input id={`${title}-region`} name="region" value={data.region} onChange={onChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${title}-city`}>City</Label>
            <Input id={`${title}-city`} name="city" value={data.city} onChange={onChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${title}-zip`}>Zip Code</Label>
            <Input id={`${title}-zip`} name="zip" value={data.zip} onChange={onChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${title}-email`}>Email</Label>
            <Input id={`${title}-email`} type="email" name="email" value={data.email} onChange={onChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${title}-phone`}>Phone Number</Label>
            <Input id={`${title}-phone`} name="phone" value={data.phone} onChange={onChange} />
          </div>
          <div className="md:col-span-2 pt-2">
            <Button onClick={onSave} className="bg-[#F36E16] hover:bg-[#e5610d]">Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AddressPage() {
  const [billing, setBilling] = useState({
    firstName: '', lastName: '', company: '', address: '', country: 'United States', region: 'California', city: '', zip: '', email: '', phone: ''
  })
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', company: '', address: '', country: 'United States', region: 'California', city: '', zip: '', email: '', phone: ''
  })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    try {
      const b = typeof window !== 'undefined' ? localStorage.getItem('accountBillingAddress') : null
      const s = typeof window !== 'undefined' ? localStorage.getItem('accountShippingAddress') : null
      if (b) setBilling(JSON.parse(b))
      if (s) setShipping(JSON.parse(s))
    } catch {}
  }, [])

  const changeBilling = (e) => setBilling((p) => ({ ...p, [e.target.name]: e.target.value }))
  const changeShipping = (e) => setShipping((p) => ({ ...p, [e.target.name]: e.target.value }))

  const saveBilling = async () => {
    setStatus('saving')
    await new Promise((r) => setTimeout(r, 400))
    if (typeof window !== 'undefined') localStorage.setItem('accountBillingAddress', JSON.stringify(billing))
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 1200)
  }
  const saveShipping = async () => {
    setStatus('saving')
    await new Promise((r) => setTimeout(r, 400))
    if (typeof window !== 'undefined') localStorage.setItem('accountShippingAddress', JSON.stringify(shipping))
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 1200)
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-6" />
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Address</h1>
        <AddressForm title="Billing Address" data={billing} onChange={changeBilling} onSave={saveBilling} />
        <AddressForm title="Shipping Address" data={shipping} onChange={changeShipping} onSave={saveShipping} />
        {status === 'saved' && <p className="text-sm text-green-600">Changes saved.</p>}
        {status === 'saving' && <p className="text-sm text-gray-600">Saving…</p>}
      </div>
    </div>
  )
}