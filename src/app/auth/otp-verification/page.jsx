'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AuthCard from '@/components/auth/AuthCard'
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'

function OTPVerificationContent() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendLoading, setResendLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef([])
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || 'your email'

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
                    email: searchParams.get('email'),
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
                body: JSON.stringify({ email: searchParams.get('email') })
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
        <AuthCard
            title="Verify Your Email"
            description={`We've sent a 6-digit verification code to ${email}`}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">
                        Enter Verification Code
                    </label>
                    <div className="flex justify-center space-x-2">
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
                                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                autoComplete="off"
                            />
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300"
                    disabled={isLoading || otp.join('').length !== 6}
                >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <div className="text-center space-y-2">
                    <p className="text-sm text-text-secondary">
                        Didn't receive the code?
                    </p>
                    {canResend ? (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {resendLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Resend Code'
                            )}
                        </Button>
                    ) : (
                        <p className="text-sm text-text-secondary">
                            Resend code in {resendTimer}s
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                    </Link>
                </div>
            </form>
        </AuthCard>
    )
}

export default function OTPVerificationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        }>
            <OTPVerificationContent />
        </Suspense>
    )
}
