'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '@/schemas/signup.schemas'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (values) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                setIsSuccess(true)
            } else {
                const data = await response.json()
                form.setError('email', { message: data.message || 'Failed to send reset email' })
            }
        } catch (err) {
            form.setError('email', { message: 'Something went wrong. Please try again.' })
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="w-full max-w-xl border border-gray-300 rounded-lg p-8">
                    {/* Header */}
                    <div className="text-start mb-8">
                        <h1 className="text-3xl font-normal text-text-primary mb-2">Check Your Email</h1>
                        <p className="text-text-secondary">We've sent a password reset link to your email address</p>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-text-secondary">
                                We've sent a password reset link to:
                            </p>
                            <p className="font-medium text-text-primary">{form.getValues('email')}</p>
                        </div>

                        <div className="space-y-4 pt-4">
                            <p className="text-sm text-text-secondary">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => setIsSuccess(false)}
                                    variant="outline"
                                    className="w-full h-12 border border-gray-300 bg-white hover:bg-gray-50 text-text-primary font-medium rounded-md"
                                >
                                    Try Different Email
                                </Button>

                                <Link href="/auth/signin">
                                    <Button
                                        variant="ghost"
                                        className="w-full h-12 text-text-secondary hover:text-text-primary font-medium rounded-md"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </div>
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
                    <h1 className="text-3xl font-normal text-text-primary mb-2">Forgot password?</h1>
                    <p className="text-text-secondary">Enter your email for the verification process, we will send 4 digits code to your email.</p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Input */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email address"
                                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Continue Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-normal text-sm uppercase tracking-wide rounded-md"
                        >
                            {isLoading ? "SENDING..." : "CONTINUE"}
                        </Button>

                        {/* Footer Link */}
                        <div className="text-center text-sm text-text-secondary">
                            <Link
                                href="/auth/signin"
                                className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
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
