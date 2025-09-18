'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/schemas/signup.schemas'

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (values) => {
        setIsLoading(true)
        try {
            // Handle form submission
            console.log('Form submitted:', values)
            // Add your API call here
        } catch (error) {
            console.error('Sign up error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Create an account</h1>
                    <p className="text-text-secondary">Enter your details below</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <Input
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email or Phone Number"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                            required
                        />
                    </div>

                    {/* Create Account Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm uppercase tracking-wide rounded-none"
                    >
                        CREATE ACCOUNT
                    </Button>

                    {/* Or Divider */}
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-text-secondary text-sm">Or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Google Sign Up Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border border-gray-300 bg-white hover:bg-gray-50 text-text-primary font-medium rounded-none flex items-center justify-center space-x-3"
                    >
                        {/* Google Logo */}
                        <div className="flex items-center space-x-1">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">G</span>
                            </div>
                            <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        </div>
                        <span>Sign up with Google</span>
                    </Button>

                    {/* Footer Link */}
                    <div className="text-center text-sm text-text-secondary">
                        Already have account?{' '}
                        <Link href="/auth/signin" className="text-primary-500 hover:text-primary-600 font-medium">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}