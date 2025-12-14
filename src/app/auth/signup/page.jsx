'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useSignUp } from '@/hooks/auth.hook'
import { ROLES } from '@/schemas/signup.schemas'
import { GoogleIcon } from '@/components/icons/SvgIcon'
import {
    User,
    Store,
    Users,
    ShoppingBag,
    Eye,
    EyeOff,
    Check,
    ArrowRight,
    Sparkles,
    ArrowLeft
} from 'lucide-react'

const roleOptions = [
    {
        id: ROLES.WHOLESALER,
        label: 'Wholesaler',
        description: 'Sell products in bulk to resellers',
        icon: Store,
        color: 'from-violet-500 to-purple-600',
        bgColor: 'bg-violet-50',
        borderColor: 'border-violet-200',
        textColor: 'text-violet-600',
        termsUrl: '/wholesaler/terms',
    },
    {
        id: ROLES.RESELLER,
        label: 'Reseller',
        description: 'Buy from wholesalers, sell to customers',
        icon: Users,
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-600',
        termsUrl: '/reseller/terms',
    },
    {
        id: ROLES.CUSTOMER,
        label: 'Customer',
        description: 'Shop products from resellers',
        icon: ShoppingBag,
        color: 'from-orange-500 to-amber-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-600',
        termsUrl: null, // No terms page required for customers
    },
]

// Get role info by ID
const getRoleById = (roleId) => roleOptions.find(r => r.id === roleId)

export default function SignUpPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { form, mutate, isPending } = useSignUp()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [mounted, setMounted] = useState(false)

    const selectedRole = form.watch('role_id')

    // Get role from URL params (set after accepting terms)
    const roleFromUrl = searchParams.get('role_id')
    const preSelectedRole = roleFromUrl ? parseInt(roleFromUrl) : null
    const preSelectedRoleInfo = preSelectedRole ? getRoleById(preSelectedRole) : null

    // Check if we should show the registration form
    // Show form if: Customer is selected OR role came from URL (after accepting terms)
    const showRegistrationForm = selectedRole === ROLES.CUSTOMER || preSelectedRole

    useEffect(() => {
        setMounted(true)
        // If role_id is in URL, set it in the form
        if (preSelectedRole && [ROLES.WHOLESALER, ROLES.RESELLER].includes(preSelectedRole)) {
            form.setValue('role_id', preSelectedRole)
        }
    }, [preSelectedRole, form])

    const handleRoleClick = (role) => {
        if (role.termsUrl) {
            // Wholesaler/Reseller - redirect to terms page
            router.push(role.termsUrl)
        } else {
            // Customer - just select the role
            form.setValue('role_id', role.id)
        }
    }

    const onSubmit = (values) => {
        mutate(values)
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return null
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700" />
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-white/90 font-medium">Join 10,000+ businesses</span>
                        </div>
                        <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                            Start Your
                            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                                Business Journey
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md">
                            Connect with wholesalers, resellers, and customers on a platform designed for growth.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        {[
                            'Secure & encrypted transactions',
                            'Real-time inventory management',
                            'Analytics dashboard included',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-slate-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
                <div className="w-full max-w-lg py-6 sm:py-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Gulu
                        </h2>
                    </div>

                    {/* Show role badge if coming from terms page */}
                    {preSelectedRoleInfo && (
                        <div className="mb-6">
                            <button
                                onClick={() => router.push('/auth/signup')}
                                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Change role
                            </button>
                            <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${preSelectedRoleInfo.bgColor} ${preSelectedRoleInfo.borderColor} border-2 w-full`}>
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${preSelectedRoleInfo.color} flex items-center justify-center shadow-md`}>
                                    <preSelectedRoleInfo.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className={`font-semibold ${preSelectedRoleInfo.textColor}`}>
                                        Registering as {preSelectedRoleInfo.label}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Terms accepted ✓
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            {preSelectedRole ? 'Complete your registration' : 'Create your account'}
                        </h1>
                        <p className="text-slate-500 text-sm sm:text-base">
                            {preSelectedRole ? 'Fill in your details to get started' : 'Choose your role and get started in minutes'}
                        </p>
                    </div>

                    {/* Role Selection - Only show if no pre-selected role */}
                    {!preSelectedRole && (
                        <div className="mb-6 sm:mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-3">I want to join as</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {roleOptions.map((role) => {
                                    const Icon = role.icon
                                    const isSelected = selectedRole === role.id
                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleRoleClick(role)}
                                            className={`
                                                relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                                                ${isSelected
                                                    ? `${role.borderColor} ${role.bgColor} shadow-lg scale-[1.02]`
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            {isSelected && (
                                                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg`}>
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mb-3 shadow-md`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className={`font-semibold text-sm ${isSelected ? role.textColor : 'text-slate-900'}`}>
                                                {role.label}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                {role.description}
                                            </p>
                                            {role.termsUrl && (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                                    <ArrowRight className="w-3 h-3" />
                                                    <span>Review terms first</span>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            {form.formState.errors.role_id && (
                                <p className="text-red-500 text-sm mt-2">{form.formState.errors.role_id.message}</p>
                            )}
                        </div>
                    )}

                    {/* Show registration form only for Customer or after terms acceptance */}
                    {showRegistrationForm ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                                {/* Name Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 text-sm font-medium">First Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            placeholder="John"
                                                            {...field}
                                                            className="pl-10 h-11 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 text-sm font-medium">Last Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            placeholder="Doe"
                                                            {...field}
                                                            className="pl-10 h-11 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

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
                                                        placeholder="john@example.com"
                                                        {...field}
                                                        className="pl-10 h-11 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
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
                                            <FormLabel className="text-slate-700 text-sm font-medium">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Create a strong password"
                                                        {...field}
                                                        className="pl-10 pr-10 h-11 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
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

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 text-sm font-medium">Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm your password"
                                                        {...field}
                                                        className="pl-10 pr-10 h-11 border-slate-200 bg-white focus:border-orange-500 focus:ring-orange-500/20 rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* Terms */}
                                <p className="text-xs text-slate-500 text-center">
                                    By creating an account, you agree to our{' '}
                                    <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                                        Privacy Policy
                                    </Link>
                                </p>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
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

                                {/* Google Sign Up */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-md"
                                >
                                    <GoogleIcon />
                                    <span>Sign up with Google</span>
                                </Button>

                                {/* Sign In Link */}
                                <div className="text-center text-sm text-slate-600 pt-2">
                                    Already have an account?{' '}
                                    <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        /* Prompt to select a role */
                        <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2">Select your role to continue</h3>
                            <p className="text-sm text-slate-500">
                                Choose how you want to use Gulu. Wholesalers and resellers will need to review terms first.
                            </p>
                            <div className="mt-6 text-center text-sm text-slate-600">
                                Already have an account?{' '}
                                <Link href="/auth/signin" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
