import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SuccessPanel({ onContinue }) {
  return (
    <div className='max-w-xl mx-auto bg-green-50 rounded-xl p-8 text-center'>
      <div className='mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4'>
        <Check className='h-8 w-8 text-green-600' />
      </div>
      <h2 className='text-xl md:text-2xl font-bold mb-2'>Application Submitted!</h2>
      <p className='text-gray-700 mb-4'>
        Your wholesaler application has been submitted successfully. Our team will review your application and you'll receive a confirmation email once approved.
      </p>
      <p className='text-gray-700 mb-4'>
        Please note that approval is done exclusively by our Super Admin team and may take some time. Once approved, you'll have access to your wholesaler dashboard where you can:
      </p>
      <ul className='text-left text-sm text-gray-700 mt-3 space-y-1 mb-6'>
        <li>• Add and manage your products</li>
        <li>• Track orders and sales analytics</li>
        <li>• Communicate with customers</li>
        <li>• Manage your store settings</li>
      </ul>
      <div className='flex flex-col sm:flex-row gap-3 justify-center'>
        <Link href='/auth/signin'>
          <Button variant='outline' className='w-full sm:w-auto'>
            LOGIN TO YOUR ACCOUNT
          </Button>
        </Link>
        <Button className='bg-[#F36E16] hover:bg-[#e06212] w-full sm:w-auto' onClick={onContinue}>
          CONTINUE
        </Button>
      </div>
    </div>
  )
}