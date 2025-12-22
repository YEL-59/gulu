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
import SuccessPanel from '@/components/wholesaler/onboarding/SuccessPanel'
import { useWholesalerRegistration } from '@/hooks/auth.hook'
import { Loader2 } from 'lucide-react'

const steps = [
  { key: 0, label: "Basic info" },
  { key: 1, label: "Business" },
  { key: 2, label: "Payment" },
  { key: 3, label: "Store setup" },
]

export default function WholesalerOnboardingPage() {
  const [current, setCurrent] = useState(0)
  const router = useRouter()
  const { submitRegistration, isPending, isSuccess } = useWholesalerRegistration()

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      profile: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      business: {
        type: 'individual',
        name: '',
        registration: '',
        industry: '',
        documentType: 'identity', // Default document type
        address: {
          country: '',
          state: '',
          city: '',
          zip: '',
          line1: '',
        },
        documents: null,
      },
      payment: {
        accountHolder: '',
        bankName: '',
        accountNumber: '',
        swift: '',
        frequency: 'weekly',
      },
      store: {
        name: '',
        contactPhone: '',
        description: '',
        logo: null,
        banner: null,
      },
    },
  })

  const goToStep = async (stepIndex) => {
    // If going forward, validate current step first
    if (stepIndex > current) {
      const valid = await validateCurrentStep()
      if (!valid) return
    }
    setCurrent(stepIndex)
  }

  // Validate fields for current step only
  const validateCurrentStep = async () => {
    let fieldsToValidate = []

    switch (current) {
      case 0:
        fieldsToValidate = [
          'profile.firstName',
          'profile.lastName',
          'profile.phone',
          'profile.email',
          'profile.password',
          'profile.confirmPassword',
        ]
        break
      case 1:
        fieldsToValidate = [
          'business.name',
          'business.address.country',
          'business.address.state',
          'business.address.city',
          'business.address.zip',
          'business.address.line1',
        ]
        // Add registration field validation if company type
        if (methods.getValues('business.type') === 'company') {
          fieldsToValidate.push('business.registration')
        }
        break
      case 2:
        fieldsToValidate = [
          'payment.accountHolder',
          'payment.bankName',
          'payment.accountNumber',
          'payment.swift',
        ]
        break
      case 3:
        fieldsToValidate = [
          'store.name',
          'store.description',
        ]
        break
    }

    const result = await methods.trigger(fieldsToValidate)
    return result
  }

  const next = async () => {
    const valid = await validateCurrentStep()
    if (!valid) {
      // Scroll to first error
      const firstErrorKey = Object.keys(methods.formState.errors)[0]
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    setCurrent((c) => Math.min(c + 1, 3))
  }

  const back = () => {
    setCurrent((c) => Math.max(c - 1, 0))
  }

  const onSubmit = methods.handleSubmit(async (data) => {
    // Validate password match
    if (data.profile.password !== data.profile.confirmPassword) {
      methods.setError('profile.confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    // Submit to API
    submitRegistration(data)
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 py-8 md:py-12 max-w-5xl relative z-10'>
        <StepperHeader
          current={isSuccess ? 4 : current}
          variant="wholesaler"
          onStepClick={goToStep}
        />

        <FormProvider {...methods}>
          {!isSuccess ? (
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
                    disabled={current === 0 || isPending}
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
                      disabled={isPending}
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type='submit'
                      disabled={isPending}
                      className='bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 min-w-[120px] h-11 shadow-md hover:shadow-xl transition-all font-semibold'
                    >
                      {isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Submitting...
                        </>
                      ) : (
                        'Submit ✓'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className='mt-8'>
              <SuccessPanel onContinue={() => router.push('/auth/signin')} />
            </div>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
