import { useFormContext, useWatch } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Building2, Hash, Key, Calendar } from 'lucide-react'

export default function StepPayment() {
  const { register, control, setValue } = useFormContext()
  const frequency = useWatch({ control, name: 'payment.frequency', defaultValue: 'weekly' })

  return (
    <Card className='border-2 shadow-xl bg-white'>
      <CardHeader className='bg-gradient-to-r from-blue-50 to-orange-50 border-b'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-[#F36E16] rounded-lg'>
            <CreditCard className='h-5 w-5 text-white' />
          </div>
          <div>
            <CardTitle className='text-2xl'>Payment Information</CardTitle>
            <CardDescription>Set up your payment details for receiving earnings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-8 space-y-8'>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <CreditCard className='h-4 w-4 text-gray-500' />
              Account Holder Name
            </Label>
            <Input 
              {...register('payment.accountHolder', { required: true })} 
              placeholder='Enter account holder name' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Building2 className='h-4 w-4 text-gray-500' />
              Bank Name
            </Label>
            <Input 
              {...register('payment.bankName', { required: true })} 
              placeholder='Enter bank name' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Hash className='h-4 w-4 text-gray-500' />
              Account Number / IBAN
            </Label>
            <Input 
              {...register('payment.accountNumber', { required: true })} 
              placeholder='Enter account number or IBAN' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Key className='h-4 w-4 text-gray-500' />
              SWIFT / Routing Code
            </Label>
            <Input 
              {...register('payment.swift', { required: true })} 
              placeholder='Enter SWIFT or routing code' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
        </div>

        <div className='space-y-4'>
          <Label className='text-sm font-semibold flex items-center gap-2 mb-4 block'>
            <Calendar className='h-4 w-4 text-gray-500' />
            Payment Preferences
          </Label>
          <div className='grid md:grid-cols-3 gap-4'>
            {[
              { key: 'weekly', label: 'Weekly', info: 'Receive payments every week', icon: '📅' },
              { key: 'monthly', label: 'Monthly', info: 'Receive payments every month', icon: '📆' },
              { key: 'ondemand', label: 'On-demand', info: 'Request payouts manually', icon: '⚡' },
            ].map((opt) => (
              <button
                key={opt.key}
                type='button'
                onClick={() => setValue('payment.frequency', opt.key)}
                className={`text-left rounded-xl border-2 p-6 transition-all duration-200 ${
                  frequency === opt.key 
                    ? 'border-[#F36E16] bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className='text-2xl mb-2'>{opt.icon}</div>
                <div className='font-semibold text-gray-900 text-lg'>{opt.label}</div>
                <div className='text-sm text-gray-600 mt-1'>{opt.info}</div>
                {frequency === opt.key && (
                  <div className='mt-3 text-xs text-[#F36E16] font-semibold'>✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}