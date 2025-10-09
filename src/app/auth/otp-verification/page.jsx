'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'

function OTPVerificationContent() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendLoading, setResendLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [email, setEmail] = useState('user@example.com')
    const inputRefs = useRef([])
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            const emailParam = searchParams.get('email')
            if (emailParam) {
                setEmail(emailParam)
            }
        }
    }, [searchParams])

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [resendTimer])

    const handleInputChange = (index, value) => {
        if (value.length > 1) return // Prevent multiple characters

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
        setOtp(newOtp)

        // Focus the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex(val => !val)
        const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
        inputRefs.current[focusIndex]?.focus()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpCode = otp.join('')

        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: otpCode
                })
            })

            if (response.ok) {
                window.location.href = '/auth/success?type=verification'
            } else {
                const data = await response.json()
                setError(data.message || 'Invalid verification code')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        setResendLoading(true)
        try {
            await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            })

            setResendTimer(60)
            setCanResend(false)
            setError('')
        } catch (err) {
            setError('Failed to resend code')
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-xl border border-gray-300 rounded-lg p-8">
                {/* Header */}
                <div className="text-start mb-8">
                    <h1 className="text-3xl font-normal text-text-primary mb-2">Email verification</h1>
                    <p className="text-text-secondary">Enter the verification code we send you on:</p>
                    <p className="text-text-primary font-medium mt-1">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* OTP Input Fields */}
                    <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-text-secondary">
                            <RefreshCw className="h-4 w-4" />
                            <span className="text-sm">
                                {canResend ? '00:00' : `${Math.floor(resendTimer / 60).toString().padStart(2, '0')}.${(resendTimer % 60).toString().padStart(2, '0')}`}
                            </span>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <Button
                        type="submit"
                        disabled={isLoading || otp.join('').length !== 6}
                        className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-normal text-sm uppercase tracking-wide rounded-md"
                    >
                        {isLoading ? "VERIFYING..." : "CONTINUE"}
                    </Button>

                    {/* Resend Section */}
                    <div className="text-center">
                        <p className="text-sm text-text-secondary">
                            Didn't receive code?{' '}
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="text-accent-500 hover:text-accent-600 font-medium"
                                >
                                    {resendLoading ? 'Sending...' : 'Resend'}
                                </button>
                            ) : (
                                <span className="text-text-secondary">Resend</span>
                            )}
                        </p>
                    </div>

                    {/* Back to Sign In */}
                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600 font-medium"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function OTPVerificationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="w-full max-w-xl border border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-text-secondary">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <OTPVerificationContent />
        </Suspense>
    )
}
