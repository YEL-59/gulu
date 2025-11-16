import { CheckCircle2, Mail, Clock, Shield, TrendingUp, Package, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function SuccessPanel({ onContinue }) {
  const features = [
    { icon: Package, text: 'Add and manage your products' },
    { icon: BarChart3, text: 'Track orders and sales analytics' },
    { icon: TrendingUp, text: 'Monitor performance metrics' },
    { icon: Settings, text: 'Manage your store settings' },
  ]

  return (
    <div className='max-w-3xl mx-auto'>
      <Card className='border-2 shadow-2xl bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 overflow-hidden'>
        <CardContent className='p-8 md:p-12'>
          {/* Success Icon with Animation */}
          <div className='flex justify-center mb-6'>
            <div className='relative'>
              <div className='absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20'></div>
              <div className='relative h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg'>
                <CheckCircle2 className='h-12 w-12 text-white' />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className='text-center mb-8'>
            <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3'>
              Application Submitted Successfully!
            </h2>
            <p className='text-gray-600 text-lg'>
              Your wholesaler application has been received and is under review
            </p>
          </div>

          {/* Info Cards */}
          <div className='grid md:grid-cols-2 gap-4 mb-8'>
            <div className='bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3'>
              <div className='p-2 bg-blue-500 rounded-lg flex-shrink-0'>
                <Mail className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-1'>Confirmation Email</h3>
                <p className='text-sm text-gray-600'>
                  You'll receive a confirmation email once your application is approved
                </p>
              </div>
            </div>

            <div className='bg-orange-50 border-2 border-orange-200 rounded-lg p-4 flex items-start gap-3'>
              <div className='p-2 bg-orange-500 rounded-lg flex-shrink-0'>
                <Clock className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-1'>Review Process</h3>
                <p className='text-sm text-gray-600'>
                  Approval is done exclusively by our Super Admin team
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className='bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-5 mb-8'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-amber-500 rounded-lg flex-shrink-0'>
                <Shield className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>Important Notice</h3>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  Please note that approval may take some time as we carefully review each application. 
                  We appreciate your patience. Once approved, you'll have full access to your wholesaler dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold text-gray-900 mb-4 text-center'>
              What You'll Be Able To Do:
            </h3>
            <div className='grid md:grid-cols-2 gap-3'>
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#F36E16] hover:shadow-md transition-all'
                  >
                    <div className='p-2 bg-gradient-to-br from-[#F36E16] to-orange-600 rounded-lg'>
                      <Icon className='h-4 w-4 text-white' />
                    </div>
                    <span className='text-sm font-medium text-gray-700'>{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200'>
            <Link href='/auth/signin' className='w-full sm:w-auto'>
              <Button 
                variant='outline' 
                className='w-full sm:w-auto h-12 border-2 hover:bg-gray-50 font-semibold'
              >
                LOGIN TO YOUR ACCOUNT
              </Button>
            </Link>
            <Button 
              className='bg-gradient-to-r from-[#F36E16] to-[#e06212] hover:from-[#e06212] hover:to-[#d0560f] w-full sm:w-auto h-12 shadow-lg hover:shadow-xl transition-all font-semibold' 
              onClick={onContinue}
            >
              CONTINUE EXPLORING
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}