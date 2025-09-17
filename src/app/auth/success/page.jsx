'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AuthCard from '@/components/auth/AuthCard'
import { CheckCircle, ArrowRight, Mail, Shield, UserCheck } from 'lucide-react'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type') || 'default'

    const getSuccessConfig = () => {
        switch (type) {
            case 'signup':
                return {
                    icon: UserCheck,
                    title: 'Account Created Successfully!',
                    description: 'Welcome to Gulu! Your account has been created and you can now start using our platform.',
                    message: 'You can now sign in with your credentials and explore all the features we have to offer.',
                    buttonText: 'Go to Dashboard',
                    buttonLink: '/dashboard',
                    secondaryText: 'Sign In Instead',
                    secondaryLink: '/auth/signin'
                }
            case 'verification':
                return {
                    icon: CheckCircle,
                    title: 'Email Verified!',
                    description: 'Your email address has been successfully verified.',
                    message: 'Your account is now fully activated and you can access all features.',
                    buttonText: 'Continue to Dashboard',
                    buttonLink: '/dashboard',
                    secondaryText: 'Sign In',
                    secondaryLink: '/auth/signin'
                }
            case 'password-reset':
                return {
                    icon: Shield,
                    title: 'Password Reset Successful!',
                    description: 'Your password has been successfully updated.',
                    message: 'You can now sign in with your new password.',
                    buttonText: 'Sign In Now',
                    buttonLink: '/auth/signin',
                    secondaryText: 'Go to Homepage',
                    secondaryLink: '/'
                }
            case 'email-sent':
                return {
                    icon: Mail,
                    title: 'Email Sent!',
                    description: 'We\'ve sent you an email with further instructions.',
                    message: 'Please check your inbox and follow the instructions in the email.',
                    buttonText: 'Check Email',
                    buttonLink: 'mailto:',
                    secondaryText: 'Back to Sign In',
                    secondaryLink: '/auth/signin'
                }
            default:
                return {
                    icon: CheckCircle,
                    title: 'Success!',
                    description: 'Your action has been completed successfully.',
                    message: 'You can now continue using the platform.',
                    buttonText: 'Continue',
                    buttonLink: '/dashboard',
                    secondaryText: 'Go Home',
                    secondaryLink: '/'
                }
        }
    }

    const config = getSuccessConfig()
    const IconComponent = config.icon

    return (
        <AuthCard
            title={config.title}
            description={config.description}
        >
            <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-10 w-10 text-green-600" />
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                    <p className="text-text-secondary leading-relaxed">
                        {config.message}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    <Link href={config.buttonLink}>
                        <Button className="w-full bg-gradient-button hover:shadow-glow-orange transition-all duration-300">
                            {config.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href={config.secondaryLink}>
                        <Button variant="ghost" className="w-full text-text-secondary hover:text-text-primary">
                            {config.secondaryText}
                        </Button>
                    </Link>
                </div>

                {/* Additional Info based on type */}
                {type === 'signup' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                        <ul className="text-sm text-blue-800 space-y-1 text-left">
                            <li>• Complete your profile setup</li>
                            <li>• Explore the marketplace</li>
                            <li>• Connect with suppliers or customers</li>
                            <li>• Start building your business</li>
                        </ul>
                    </div>
                )}

                {type === 'verification' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                        <p className="text-sm text-green-800">
                            <strong>Your account is now fully verified!</strong> You have access to all platform features including secure transactions and premium support.
                        </p>
                    </div>
                )}

                {type === 'password-reset' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                        <h4 className="font-medium text-yellow-900 mb-2">Security Tips</h4>
                        <ul className="text-sm text-yellow-800 space-y-1 text-left">
                            <li>• Use a unique password for your Gulu account</li>
                            <li>• Enable two-factor authentication</li>
                            <li>• Don't share your password with anyone</li>
                            <li>• Sign out from shared devices</li>
                        </ul>
                    </div>
                )}
            </div>
        </AuthCard>
    )
}
