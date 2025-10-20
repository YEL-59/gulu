'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import Breadcrumb from '@/components/common/Breadcrumb'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }
  const toggle = (key) => setShow((p) => ({ ...p, [key]: !p[key] }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    if (form.next.length < 8 || form.next !== form.confirm) {
      setStatus('error')
      return
    }
    await new Promise((r) => setTimeout(r, 500))
    setStatus('saved')
    setForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setStatus('idle'), 1500)
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-6" />
      <h1 className="text-2xl font-semibold mb-4">Change Password</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="current">Current Password</Label>
              <div className="relative">
                <Input id="current" name="current" type={show.current ? 'text' : 'password'} value={form.current} onChange={handleChange} />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" onClick={() => toggle('current')}>
                  {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="next">New Password</Label>
              <div className="relative">
                <Input id="next" name="next" type={show.next ? 'text' : 'password'} value={form.next} onChange={handleChange} placeholder="8+ characters" />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" onClick={() => toggle('next')}>
                  {show.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input id="confirm" name="confirm" type={show.confirm ? 'text' : 'password'} value={form.confirm} onChange={handleChange} />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" onClick={() => toggle('confirm')}>
                  {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="bg-[#F36E16] hover:bg-[#e5610d]">
              {status === 'saving' ? 'Changing…' : 'Change Password'}
            </Button>
            {status === 'saved' && <span className="ml-3 text-sm text-green-600">Password updated.</span>}
            {status === 'error' && <span className="ml-3 text-sm text-red-600">Check your inputs and try again.</span>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}