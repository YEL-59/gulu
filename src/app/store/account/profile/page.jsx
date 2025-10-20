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

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    displayName: 'User',
    username: 'user123',
    fullName: 'John Doe',
    email: 'john@example.com',
    secondaryEmail: '',
    phone: '+1 555 000 0000',
    country: 'United States',
    state: 'California',
    zip: '90210',
  })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('accountProfile') : null
      if (raw) setProfile(JSON.parse(raw))
    } catch {}
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, [name]: value }))
  }

  const save = async (e) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await new Promise((r) => setTimeout(r, 400))
      if (typeof window !== 'undefined') {
        localStorage.setItem('accountProfile', JSON.stringify(profile))
      }
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-6" />
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" name="displayName" value={profile.displayName} onChange={onChange} placeholder="Display name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={profile.username} onChange={onChange} placeholder="Username" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" value={profile.fullName} onChange={onChange} placeholder="Full name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" value={profile.email} onChange={onChange} placeholder="you@example.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="secondaryEmail">Secondary email</Label>
              <Input id="secondaryEmail" type="email" name="secondaryEmail" value={profile.secondaryEmail} onChange={onChange} placeholder="optional" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" value={profile.phone} onChange={onChange} placeholder="+1 555 000 0000" />
            </div>
            <div className="space-y-1">
              <Label>Country/Region</Label>
              <Select value={profile.country} onValueChange={(v) => setProfile((p) => ({ ...p, country: v }))}>
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
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" value={profile.state} onChange={onChange} placeholder="State" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="zip">Zip Code</Label>
              <Input id="zip" name="zip" value={profile.zip} onChange={onChange} placeholder="Zip" />
            </div>

            <div className="md:col-span-2 pt-2">
              <Button type="submit" className="bg-[#F36E16] hover:bg-[#e5610d]">
                {status === 'saving' ? 'Saving…' : 'Save Changes'}
              </Button>
              {status === 'saved' && (
                <span className="ml-3 text-sm text-green-600">Saved successfully.</span>
              )}
              {status === 'error' && (
                <span className="ml-3 text-sm text-red-600">Failed to save. Try again.</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}