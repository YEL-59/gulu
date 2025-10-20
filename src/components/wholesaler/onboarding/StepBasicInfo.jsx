import { useFormContext } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function StepBasicInfo() {
  const { register } = useFormContext()

  return (
    <Card>
      <CardContent className='p-6 space-y-4'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <Label>First Name</Label>
            <Input {...register('profile.firstName', { required: true })} placeholder='Cameron' />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input {...register('profile.lastName', { required: true })} placeholder='Williamson' />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input {...register('profile.phone', { required: true })} placeholder='+09282828' />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input type='email' {...register('profile.email', { required: true })} placeholder='williamson@gmail.com' />
          </div>
          <div>
            <Label>Password</Label>
            <Input type='password' {...register('profile.password', { required: true })} />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type='password' {...register('profile.confirmPassword', { required: true })} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}