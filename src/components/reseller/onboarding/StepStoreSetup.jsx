import { useFormContext } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function StepStoreSetup() {
  const { register } = useFormContext()

  return (
    <Card>
      <CardContent className='p-6 space-y-6'>
        <div>
          <Label className='mb-2 block'>Store setup</Label>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <Label>Store Name</Label>
              <Input {...register('store.name', { required: true })} placeholder='Enter store name' />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input type='email' {...register('store.contactEmail', { required: true })} placeholder='store@example.com' />
            </div>
            <div className='md:col-span-2'>
              <Label>Store Description</Label>
              <Textarea {...register('store.description')} placeholder='Write a short description about your store, products, categories, and your brand values.' />
            </div>
            <div>
              <Label>Contact Phone (Optional)</Label>
              <Input {...register('store.contactPhone')} placeholder='Enter phone number' />
            </div>
          </div>
        </div>

        <div>
          <Label>Upload Branding</Label>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <Label>Store Logo</Label>
              <input type='file' {...register('store.logo')} className='mt-2 block w-full border rounded-md p-2' />
            </div>
            <div>
              <Label>Store Banner Image</Label>
              <input type='file' {...register('store.banner')} className='mt-2 block w-full border rounded-md p-2' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}