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

  const goToStep = async (stepIndex) => {
    // If going forward, validate current step first
    if (stepIndex > current) {
      const valid = await methods.trigger()
      if (!valid) {
        // Show error message or toast here if needed
        return
      }
    }
    setCurrent(stepIndex)
  }

  const next = async () => {
    // Validate current step fields before proceeding
    const valid = await methods.trigger()
    if (!valid) {
      // Scroll to first error if validation fails
      const firstError = Object.keys(methods.formState.errors)[0]
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setCurrent((c) => Math.min(c + 1, 3))
  }

  const back = () => {
    // Allow going back without validation
    setCurrent((c) => Math.max(c - 1, 0))
  }

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
        <StepperHeader
          current={submitted ? 4 : current}
          onStepClick={goToStep}
        />

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

                <div className='flex justify-between items-center pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl p-6 shadow-lg backdrop-blur-sm'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={back}
                    disabled={current === 0}
                    className='min-w-[120px] h-11 border-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all'
                  >
                    ← Back
                  </Button>

                  <div className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-orange-50 rounded-full border border-gray-200'>
                    <span className='text-sm font-semibold text-gray-700'>
                      Step {current + 1} of {steps.length}
                    </span>
                    <div className='flex gap-1'>
                      {steps.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 w-1.5 rounded-full transition-all ${idx <= current ? 'bg-[#F36E16]' : 'bg-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {current < 3 ? (
                    <Button
                      type='button'
                      className='bg-gradient-to-r from-[#F36E16] to-[#e06212] hover:from-[#e06212] hover:to-[#d0560f] min-w-[120px] h-11 shadow-md hover:shadow-xl transition-all font-semibold'
                      onClick={next}
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type='submit'
                      className='bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 min-w-[120px] h-11 shadow-md hover:shadow-xl transition-all font-semibold'
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