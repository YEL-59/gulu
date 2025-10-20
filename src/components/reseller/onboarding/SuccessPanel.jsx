import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPanel({ onContinue }) {
  return (
    <div className='max-w-xl mx-auto bg-green-50 rounded-xl p-8 text-center'>
      <div className='mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4'>
        <Check className='h-8 w-8 text-green-600' />
      </div>
      <h2 className='text-xl md:text-2xl font-bold mb-2'>You're almost ready to start selling!</h2>
      <p className='text-gray-700'>
        After completing this step, you'll have access to your seller dashboard where you can:
      </p>
      <ul className='text-left text-sm text-gray-700 mt-3 space-y-1'>
        <li>• Add and manage your products</li>
        <li>• Track orders and sales analytics</li>
        <li>• Communicate with customers</li>
        <li>• Manage your store settings</li>
      </ul>
      <Button className='mt-6 bg-[#F36E16] hover:bg-[#e06212]' onClick={onContinue}>CONTINUE SELLING</Button>
    </div>
  )
}