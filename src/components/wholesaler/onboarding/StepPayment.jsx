import { useFormContext, useWatch } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StepPayment() {
  const { register, control, setValue } = useFormContext()
  const frequency = useWatch({ control, name: 'payment.frequency', defaultValue: 'weekly' })

  return (
    <Card>
      <CardContent className='p-6 space-y-6'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <Label>Account Holder Name</Label>
            <Input {...register('payment.accountHolder', { required: true })} placeholder='John Doe' />
          </div>
          <div>
            <Label>Bank Name</Label>
            <Input {...register('payment.bankName', { required: true })} placeholder='Bank of America' />
          </div>
          <div>
            <Label>Account Number / IBAN</Label>
            <Input {...register('payment.accountNumber', { required: true })} placeholder='123456789' />
          </div>
          <div>
            <Label>SWIFT / Routing Code</Label>
            <Input {...register('payment.swift', { required: true })} placeholder='BOFAUS3N' />
          </div>
        </div>

        <div>
          <Label className='mb-2 block'>Payment Preferences</Label>
          <div className='grid md:grid-cols-3 gap-3'>
            {[
              { key: 'weekly', label: 'Weekly', info: 'Receive payments every week.' },
              { key: 'monthly', label: 'Monthly', info: 'Receive payments every month.' },
              { key: 'ondemand', label: 'On-demand', info: 'Request payouts manually.' },
            ].map((opt) => (
              <button
                key={opt.key}
                type='button'
                onClick={() => setValue('payment.frequency', opt.key)}
                className={`text-left rounded-md border p-4 ${frequency === opt.key ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              >
                <div className='font-medium'>{opt.label}</div>
                <div className='text-xs text-gray-600 mt-1'>{opt.info}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}