'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AuthCard from '@/components/auth/AuthCard'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                setIsSuccess(true)
            } else {
                const data = await response.json()
                setError(data.message || 'Failed to send reset email')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <AuthCard
                title="Check Your Email"
                description="We've sent a password reset link to your email address"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-text-secondary">
                            We've sent a password reset link to:
                        </p>
                        <p className="font-medium text-text-primary">{email}</p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-text-secondary">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => setIsSuccess(false)}
                                variant="outline"
                                className="w-full"
                            >
                                Try Different Email
                            </Button>

                            <Link href="/auth/signin">
                                <Button variant="ghost" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthCard>
        )
    }

    return (
        <AuthCard
            title="Forgot Password?"
            description="Enter your email address and we'll send you a link to reset your password"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

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
