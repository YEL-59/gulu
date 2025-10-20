import { useFormContext, useWatch } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function StepBusiness() {
  const { register, control, setValue } = useFormContext()
  const type = useWatch({ control, name: 'business.type', defaultValue: 'individual' })

  return (
    <Card>
      <CardContent className='p-6 space-y-6'>
        <div>
          <Label className='mb-2 block'>Business Type</Label>
          <div className='flex gap-3'>
            <button
              type='button'
              className={`px-4 py-2 rounded-md border ${type === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onClick={() => setValue('business.type', 'individual')}
            >
              Individual
            </button>
            <button
              type='button'
              className={`px-4 py-2 rounded-md border ${type === 'company' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onClick={() => setValue('business.type', 'company')}
            >
              Company
            </button>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <Label>{type === 'company' ? 'Business/Company Name' : 'Business/Company Name'}</Label>
            <Input {...register('business.name', { required: true })} placeholder='Cameron' />
          </div>
          {type === 'company' && (
            <div>
              <Label>Registration Number / Tax ID</Label>
              <Input {...register('business.registration', { required: true })} placeholder='123456789' />
            </div>
          )}
          <div>
            <Label>Industry/Category</Label>
            <Select onValueChange={(val) => setValue('business.industry', val)}>
              <SelectTrigger>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='electronics'>Electronics</SelectItem>
                <SelectItem value='fashion'>Fashion</SelectItem>
                <SelectItem value='home'>Home & Living</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className='mb-2 block'>Business Address</Label>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <Label>Country</Label>
              <Select onValueChange={(val) => setValue('business.address.country', val)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='us'>USA</SelectItem>
                  <SelectItem value='ca'>Canada</SelectItem>
                  <SelectItem value='bd'>Bangladesh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>State</Label>
              <Input {...register('business.address.state', { required: true })} placeholder='State' />
            </div>
            <div>
              <Label>City</Label>
              <Input {...register('business.address.city', { required: true })} placeholder='City' />
            </div>
            <div>
              <Label>ZIP Code</Label>
              <Input {...register('business.address.zip', { required: true })} placeholder='24598' />
            </div>
          </div>
          <div className='mt-4'>
            <Label>Address</Label>
            <Input {...register('business.address.line1', { required: true })} placeholder='214 Texas, USA' />
          </div>
        </div>

        <div>
          <Label>Upload Documents</Label>
          <div className='mt-2 border rounded-md p-6 text-center text-sm text-gray-500 bg-gray-50'>
            <input type='file' {...register('business.documents')} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}