'use client'

import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/common/Breadcrumb'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OrderSuccessPage() {
  const router = useRouter()

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb className="mb-4" />
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <Check className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Your Order Is Completed!</h1>
          <p className="text-gray-600 max-w-xl mb-6">
            Thank you for your order! Your order is being processed and will be completed within 3–6 hours.
            You will receive an email confirmation when your order is completed.
          </p>
          <Button className="bg-[#F36E16] hover:bg-[#e06212]" onClick={() => router.push('/store')}>
            CONTINUE SHOPPING
          </Button>
        </div>
      </div>
    </div>
  )
}