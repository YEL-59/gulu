import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Store, Mail, Phone, FileText, Image as ImageIcon, Upload } from 'lucide-react'

export default function StepStoreSetup() {
  const { register } = useFormContext()

  return (
    <Card className='border-2 shadow-xl bg-white'>
      <CardHeader className='bg-gradient-to-r from-blue-50 to-orange-50 border-b'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-[#F36E16] rounded-lg'>
            <Store className='h-5 w-5 text-white' />
          </div>
          <div>
            <CardTitle className='text-2xl'>Store Setup</CardTitle>
            <CardDescription>Configure your store settings and branding</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-8 space-y-8'>
        <div className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label className='text-sm font-semibold flex items-center gap-2'>
                <Store className='h-4 w-4 text-gray-500' />
                Store Name
              </Label>
              <Input 
                {...register('store.name', { required: true })} 
                placeholder='Enter your store name' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-semibold flex items-center gap-2'>
                <Mail className='h-4 w-4 text-gray-500' />
                Contact Email
              </Label>
              <Input 
                type='email' 
                {...register('store.contactEmail', { required: true })} 
                placeholder='store@example.com' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
            <div className='space-y-2 md:col-span-2'>
              <Label className='text-sm font-semibold flex items-center gap-2'>
                <FileText className='h-4 w-4 text-gray-500' />
                Store Description
              </Label>
              <Textarea 
                {...register('store.description')} 
                placeholder='Write a short description about your store, products, categories, and your brand values...' 
                className='min-h-[120px] border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100 resize-none'
              />
              <p className='text-xs text-gray-500'>This will be displayed on your store page</p>
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-semibold flex items-center gap-2'>
                <Phone className='h-4 w-4 text-gray-500' />
                Contact Phone <span className='text-gray-400 font-normal'>(Optional)</span>
              </Label>
              <Input 
                {...register('store.contactPhone')} 
                placeholder='+1 234 567 8900' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <Label className='text-sm font-semibold flex items-center gap-2 mb-4 block'>
            <Upload className='h-4 w-4 text-gray-500' />
            Upload Branding
          </Label>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <Label className='text-sm font-medium flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-gray-500' />
                Store Logo
              </Label>
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:border-[#F36E16] transition-colors'>
                <ImageIcon className='h-10 w-10 text-gray-400 mx-auto mb-2' />
                <p className='text-sm font-medium text-gray-700 mb-1'>Upload Logo</p>
                <p className='text-xs text-gray-500 mb-3'>Recommended: 200x200px, PNG or JPG</p>
                <input 
                  type='file' 
                  {...register('store.logo')} 
                  accept='image/*'
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F36E16] file:text-white hover:file:bg-[#e06212] cursor-pointer'
                />
              </div>
            </div>
            <div className='space-y-3'>
              <Label className='text-sm font-medium flex items-center gap-2'>
                <ImageIcon className='h-4 w-4 text-gray-500' />
                Store Banner Image
              </Label>
              <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:border-[#F36E16] transition-colors'>
                <ImageIcon className='h-10 w-10 text-gray-400 mx-auto mb-2' />
                <p className='text-sm font-medium text-gray-700 mb-1'>Upload Banner</p>
                <p className='text-xs text-gray-500 mb-3'>Recommended: 1200x300px, PNG or JPG</p>
                <input 
                  type='file' 
                  {...register('store.banner')} 
                  accept='image/*'
                  className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F36E16] file:text-white hover:file:bg-[#e06212] cursor-pointer'
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}