'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AuthCard from '@/components/auth/AuthCard'
import { CheckCircle, AlertCircle, RefreshCw, Mail } from 'lucide-react'

function VerifyAccountContent() {
    const [status, setStatus] = useState('loading') // loading, success, error, expired
    const [error, setError] = useState('')
    const [isResending, setIsResending] = useState(false)
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    useEffect(() => {
        if (token) {
            verifyAccount()
        } else {
            setStatus('error')
            setError('Invalid verification link')
        }
    }, [token])

    const verifyAccount = async () => {
        try {
            const response = await fetch('/api/auth/verify-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            })

            const data = await response.json()

            if (response.ok) {
                setStatus('success')
            } else {
                if (data.code === 'TOKEN_EXPIRED') {
                    setStatus('expired')
                } else {
                    setStatus('error')
                    setError(data.message || 'Verification failed')
                }
            }
        } catch (err) {
            setStatus('error')
            setError('Something went wrong. Please try again.')
        }
    }

    const handleResendVerification = async () => {
        setIsResending(true)
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                setStatus('email-sent')
            } else {
                const data = await response.json()
                setError(data.message || 'Failed to resend verification email')
            }
        } catch (err) {
            setError('Failed to resend verification email')
        } finally {
            setIsResending(false)
        }
    }

    // Loading state
    if (status === 'loading') {
        return (
            <AuthCard
                title="Verifying Your Account"
                description="Please wait while we verify your email address"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto">
                        <RefreshCw className="h-16 w-16 text-primary-600 animate-spin" />
                    </div>
                    <p className="text-text-secondary">
                        Verifying your account...
                    </p>
                </div>
            </AuthCard>
        )
    }

    // Success state
    if (status === 'success') {
        return (
            <AuthCard
                title="Account Verified!"
                description="Your email address has been successfully verified"
            >
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-text-secondary">
                            Welcome to Gulu! Your account is now fully activated and you can access all features.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link href="/auth/signin">
                            <Button className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300">
                                Sign In to Your Account
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button variant="ghost" className="w-full">
                                Explore Marketplace
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Ready to Get Started?</h4>
                        <ul className="text-sm text-blue-800 space-y-1 text-left">
                            <li>• Complete your profile</li>
                            <li>• Browse products or create your store</li>
                            <li>• Connect with suppliers and customers</li>
                            <li>• Start growing your business</li>
                        </ul>
                    </div>
                </div>
            </AuthCard>
        )
    }

    // Email sent state
    if (status === 'email-sent') {
        return (
            <AuthCard
                title="Verification Email Sent"
                description="We've sent a new verification link to your email"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-text-secondary">
                            Please check your email and click the verification link.
                        </p>
                        {email && (
                            <p className="font-medium text-text-primary">{email}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Link href="/auth/signin">
                            <Button className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300">
                                Go to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthCard>
        )
    }

    // Expired token state
    if (status === 'expired') {
        return (
            <AuthCard
                title="Verification Link Expired"
                description="This verification link has expired, but don't worry!"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-text-secondary">
                            Verification links expire for security reasons. We can send you a new one.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {email ? (
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300"
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Sending New Link...
                                    </>
                                ) : (
                                    'Send New Verification Link'
                                )}
                            </Button>
                        ) : (
                            <Link href="/auth/signup">
                                <Button className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300">
                                    Create New Account
                                </Button>
                            </Link>
                        )}

                        <Link href="/auth/signin">
                            <Button variant="ghost" className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthCard>
        )
    }

    // Error state
    return (
        <AuthCard
            title="Verification Failed"
            description="We couldn't verify your account"
        >
            <div className="text-center space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>

                <div className="space-y-2">
                    <p className="text-text-secondary">
                        The verification link may be invalid or expired.
                    </p>
                </div>

                <div className="space-y-3">
                    {email && (
                        <Button
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300"
                        >
                            {isResending ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send New Verification Link'
                            )}
                        </Button>
                    )}

                    <Link href="/auth/signin">
                        <Button variant="ghost" className="w-full">
                            Back to Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </AuthCard>
    )
}

export default function VerifyAccountPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        }>
            <VerifyAccountContent />
        </Suspense>
    )
}
