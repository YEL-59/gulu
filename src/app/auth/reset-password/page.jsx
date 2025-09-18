'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AuthCard from '@/components/auth/AuthCard'
import { Eye, EyeOff, Lock, ArrowLeft, AlertCircle } from 'lucide-react'

function ResetPasswordContent() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })

    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: formData.password
                })
            })

            if (response.ok) {
                window.location.href = '/auth/success?type=password-reset'
            } else {
                const data = await response.json()
                setError(data.message || 'Failed to reset password')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const getPasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const passwordStrength = getPasswordStrength(formData.password)
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

    if (!token) {
        return (
            <AuthCard
                title="Invalid Reset Link"
                description="This password reset link is invalid or has expired"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>

                    <p className="text-text-secondary">
                        Please request a new password reset link.
                    </p>

                    <div className="space-y-3">
                        <Link href="/auth/forgot-password">
                            <Button className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300">
                                Request New Link
                            </Button>
                        </Link>

                        <Link href="/auth/signin">
                            <Button variant="ghost" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthCard>
        )
    }

    return (
        <AuthCard
            title="Reset Your Password"
            description="Enter your new password below"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {formData.password && (
                        <div className="space-y-2">
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 flex-1 rounded ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-text-secondary">
                                Password strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="pl-10 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                        <strong>Password requirements:</strong>
                    </p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                    </ul>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
