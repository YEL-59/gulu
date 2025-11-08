'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import StepperHeader from '@/components/reseller/onboarding/StepperHeader'
import StepBasicInfo from '@/components/reseller/onboarding/StepBasicInfo'
import StepBusiness from '@/components/reseller/onboarding/StepBusiness'
import StepPayment from '@/components/reseller/onboarding/StepPayment'
import StepStoreSetup from '@/components/reseller/onboarding/StepStoreSetup'
import SuccessPanel from '@/components/reseller/onboarding/SuccessPanel'

const steps = [
  { key: 0, label: "Basic info" },
  { key: 1, label: "Business" },
  { key: 2, label: "Payment" },
  { key: 3, label: "Store setup" },
]

export default function ResellerOnboardingPage() {
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      profile: {},
      business: { type: 'individual', address: {} },
      payment: { frequency: 'weekly' },
      store: {},
    },
  })

  const next = async () => {
    // Optionally validate current step fields
    const valid = await methods.trigger()
    if (!valid) return
    setCurrent((c) => Math.min(c + 1, 3))
  }

  const back = () => setCurrent((c) => Math.max(c - 1, 0))

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const res = await fetch('/api/reseller/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to submit form')
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error', err)
    }
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50'>
      <div className='container mx-auto px-4 py-8 md:py-12 max-w-5xl'>
        <StepperHeader current={submitted ? 4 : current} />

        <FormProvider {...methods}>
          {!submitted ? (
            <div className='mt-8'>
              <form onSubmit={onSubmit} className='space-y-8'>
                <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
                  {current === 0 && <StepBasicInfo />}
                  {current === 1 && <StepBusiness />}
                  {current === 2 && <StepPayment />}
                  {current === 3 && <StepStoreSetup />}
                </div>

                <div className='flex justify-between items-center pt-6 border-t border-gray-200 bg-white rounded-lg p-6 shadow-sm'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={back}
                    disabled={current === 0}
                    className='min-w-[120px]'
                  >
                    ← Back
                  </Button>

                  <div className='text-sm text-gray-500'>
                    Step {current + 1} of {steps.length}
                  </div>

                  {current < 3 ? (
                    <Button
                      type='button'
                      className='bg-[#F36E16] hover:bg-[#e06212] min-w-[120px] shadow-md hover:shadow-lg transition-all'
                      onClick={next}
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type='submit'
                      className='bg-[#F36E16] hover:bg-[#e06212] min-w-[120px] shadow-md hover:shadow-lg transition-all'
                    >
                      Submit ✓
                    </Button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className='mt-8'>
              <SuccessPanel onContinue={() => router.push('/store')} />
            </div>
          )}
        </FormProvider>
      </div>
    </div>
  )
}