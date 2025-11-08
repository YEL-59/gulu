import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Lock } from 'lucide-react'

export default function StepBasicInfo() {
  const { register } = useFormContext()

  return (
    <Card className='border-2 shadow-xl bg-white'>
      <CardHeader className='bg-gradient-to-r from-blue-50 to-orange-50 border-b'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-[#F36E16] rounded-lg'>
            <User className='h-5 w-5 text-white' />
          </div>
          <div>
            <CardTitle className='text-2xl'>Basic Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-8 space-y-6'>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <User className='h-4 w-4 text-gray-500' />
              First Name
            </Label>
            <Input 
              {...register('profile.firstName', { required: true })} 
              placeholder='Enter your first name' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <User className='h-4 w-4 text-gray-500' />
              Last Name
            </Label>
            <Input 
              {...register('profile.lastName', { required: true })} 
              placeholder='Enter your last name' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Phone className='h-4 w-4 text-gray-500' />
              Phone Number
            </Label>
            <Input 
              {...register('profile.phone', { required: true })} 
              placeholder='+1 234 567 8900' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Mail className='h-4 w-4 text-gray-500' />
              Email Address
            </Label>
            <Input 
              type='email' 
              {...register('profile.email', { required: true })} 
              placeholder='your.email@example.com' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Lock className='h-4 w-4 text-gray-500' />
              Password
            </Label>
            <Input 
              type='password' 
              {...register('profile.password', { required: true })} 
              placeholder='Create a strong password' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Lock className='h-4 w-4 text-gray-500' />
              Confirm Password
            </Label>
            <Input 
              type='password' 
              {...register('profile.confirmPassword', { required: true })} 
              placeholder='Confirm your password' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}