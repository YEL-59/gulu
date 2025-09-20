'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/schemas/signup.schemas'
import { GoogleIcon } from '@/components/icons/SvgIcon'

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
            <div className="w-full max-w-xl border border-gray-300 rounded-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Create an account</h1>
                    <p className="text-text-secondary">Enter your details below</p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Input */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Name"
                                            {...field}
                                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Input */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email or Phone Number"
                                            {...field}
                                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Input */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                            className="border-0 border-b border-gray-300 rounded-none px-0 py-3 text-text-primary placeholder-text-secondary focus:border-primary-500 focus:ring-0 bg-transparent"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        {/* Create Account Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-accent-500 hover:bg-accent-600 text-white font-normal text-sm uppercase tracking-wide rounded-md"
                        >
                            {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                        </Button>

                        {/* Or Divider */}
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-text-secondary text-sm">Or</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        {/* Google Sign In Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 border border-gray-300 bg-white  hover:bg-gray-50 text-text-primary font-medium rounded-md hover:text-text-primary flex items-center justify-center space-x-3"
                        >
                            {/* Google Logo */}
                            <div className="flex items-center space-x-1">
                                <GoogleIcon />

                            </div>
                            <span>Sign in with Google</span>
                        </Button>

                        {/* Footer Link */}
                        <div className="text-center text-sm text-text-secondary">
                            Allready have an account?{' '}
                            <Link href="/auth/signin" className="text-primary-500 hover:text-primary-600 font-medium">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </Form>


            </div>
        </div>
    )
}