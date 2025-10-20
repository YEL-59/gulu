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
    <div className='bg-white min-h-screen'>
      <div className='container mx-auto px-4 py-10'>
        <StepperHeader current={submitted ? 4 : current} />

        <FormProvider {...methods}>
          {!submitted ? (
            <form onSubmit={onSubmit} className='space-y-6'>
              {current === 0 && <StepBasicInfo />}
              {current === 1 && <StepBusiness />}
              {current === 2 && <StepPayment />}
              {current === 3 && <StepStoreSetup />}

              <div className='flex justify-between pt-2'>
                <Button type='button' variant='outline' onClick={back} disabled={current === 0}>
                  BACK
                </Button>
                {current < 3 ? (
                  <Button type='button' className='bg-[#F36E16] hover:bg-[#e06212]' onClick={next}>
                    NEXT
                  </Button>
                ) : (
                  <Button type='submit' className='bg-[#F36E16] hover:bg-[#e06212]'>
                    SUBMIT
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <SuccessPanel onContinue={() => router.push('/store')} />
          )}
        </FormProvider>
      </div>
    </div>
  )
}