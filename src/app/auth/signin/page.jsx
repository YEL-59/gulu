'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useSignIn } from '@/hooks/auth.hook'
import { GoogleIcon } from '@/components/icons/SvgIcon'
import {
    Eye,
    EyeOff,
    ArrowRight,
    Shield,
    Zap,
    TrendingUp
} from 'lucide-react'

function SignInForm() {
    const { form, mutate, isPending } = useSignIn()
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = (values) => {
        mutate(values)
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 -left-10 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                    <div className="absolute bottom-20 -right-10 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700" />
                    <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <div className="mb-10">
                        <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                            Welcome
                            <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                                Back!
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md">
                            Sign in to access your dashboard, manage orders, and grow your business.
                        </p>
                    </div>

                    {/* Features Cards */}
                    <div className="space-y-4">
                        {[
                            { icon: Shield, title: 'Secure Access', desc: 'Your data is protected with enterprise-grade security', color: 'from-emerald-400 to-cyan-400' },
                            { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed and performance', color: 'from-amber-400 to-orange-400' },
                            { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Track your business growth instantly', color: 'from-violet-400 to-purple-400' },
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{feature.title}</h3>
                                    <p className="text-sm text-slate-400">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Gulu
                        </h2>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h1>
                        <p className="text-slate-500">Enter your credentials to continue</p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 text-sm font-medium">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    {...field}
                                                    className="pl-10 h-12 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg text-base"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-slate-700 text-sm font-medium">Password</FormLabel>
                                            <Link
                                                href="/auth/forgot-password"
                                                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="pl-10 pr-10 h-12 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg text-base"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-gradient-to-b from-slate-50 to-white text-slate-500">or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign In */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-md"
                            >
                                <GoogleIcon />
                                <span>Sign in with Google</span>
                            </Button>

                            {/* Sign Up Link */}
                            <div className="text-center text-sm text-slate-600 pt-4">
                                Don't have an account?{' '}
                                <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                                    Create one now
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
        }>
            <SignInForm />
        </Suspense>
    )
}
