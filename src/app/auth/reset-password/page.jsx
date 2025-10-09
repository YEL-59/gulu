'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '@/schemas/signup.schemas'
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react'

function ResetPasswordContent() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [token, setToken] = useState('')
    const searchParams = useSearchParams()

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    useEffect(() => {
        if (searchParams) {
            const tokenParam = searchParams.get('token')
            if (tokenParam) {
                setToken(tokenParam)
            }
        }
    }, [searchParams])

    const onSubmit = async (values) => {
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: values.password
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

    //use !token to check if the token is valid 
    if (token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="w-full max-w-xl border border-gray-300 rounded-lg p-8">
                    {/* Header */}
                    <div className="text-start mb-8">
                        <h1 className="text-3xl font-normal text-text-primary mb-2">Invalid Reset Link</h1>
                        <p className="text-text-secondary">This password reset link is invalid or has expired</p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>

                        <p className="text-text-secondary">
                            Please request a new password reset link.
                        </p>

                        <div className="space-y-3">
                            <Link href="/auth/forgot-password">
                                <Button className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-normal text-sm uppercase tracking-wide rounded-md">
                                    Request New Link
                                </Button>
                            </Link>

                            <Link href="/auth/signin">
                                <Button variant="ghost" className="w-full h-12 text-text-secondary hover:text-text-primary font-medium rounded-md">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-xl border border-gray-300 rounded-lg p-8">
                {/* Header */}
                <div className="text-start mb-8">
                    <h1 className="text-3xl font-normal text-text-primary mb-2">Update Password</h1>
                    <p className="text-text-secondary">Set the new password for your account so you can login and access all features.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center">
                                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* New Password Input */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="New password"
                                                className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-0 top-3 text-text-secondary hover:text-text-primary"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Input */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm Password"
                                                className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-0 top-3 text-text-secondary hover:text-text-primary"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Update Password Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-normal text-sm uppercase tracking-wide rounded-md"
                        >
                            {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                        </Button>

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
                </Form>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
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
            <ResetPasswordContent />
        </Suspense>
    )
}
