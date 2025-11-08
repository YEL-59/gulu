import { useFormContext, useWatch } from 'react-hook-form'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { COUNTRIES } from '@/constants/countries'
import { INDUSTRIES } from '@/constants/industries'
import { Building2, MapPin, FileText, Briefcase, Search, Globe, Check } from 'lucide-react'

export default function StepBusiness() {
  const { register, control, setValue, watch } = useFormContext()
  const type = useWatch({ control, name: 'business.type', defaultValue: 'individual' })
  const selectedCountry = watch('business.address.country')
  const selectedIndustry = watch('business.industry')
  
  const [countrySearch, setCountrySearch] = useState('')
  const [industrySearch, setIndustrySearch] = useState('')
  
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES
    return COUNTRIES.filter(country => 
      country.label.toLowerCase().includes(countrySearch.toLowerCase())
    )
  }, [countrySearch])
  
  const filteredIndustries = useMemo(() => {
    if (!industrySearch) return INDUSTRIES
    return INDUSTRIES.filter(industry => 
      industry.label.toLowerCase().includes(industrySearch.toLowerCase())
    )
  }, [industrySearch])
  
  const selectedCountryLabel = COUNTRIES.find(c => c.value === selectedCountry)?.label || 'Select Country'
  const selectedIndustryLabel = INDUSTRIES.find(i => i.value === selectedIndustry)?.label || 'Select Industry'

  return (
    <Card className='border-2 shadow-xl bg-white'>
      <CardHeader className='bg-gradient-to-r from-blue-50 to-orange-50 border-b'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-[#F36E16] rounded-lg'>
            <Building2 className='h-5 w-5 text-white' />
          </div>
          <div>
            <CardTitle className='text-2xl'>Business Information</CardTitle>
            <CardDescription>Details about your business</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-8 space-y-8'>
        <div>
          <Label className='mb-4 block text-sm font-semibold flex items-center gap-2'>
            <Briefcase className='h-4 w-4 text-gray-500' />
            Business Type
          </Label>
          <div className='flex gap-4'>
            <button
              type='button'
              className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                type === 'individual' 
                  ? 'border-[#F36E16] bg-orange-50 shadow-md scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setValue('business.type', 'individual')}
            >
              <div className='font-semibold text-gray-900'>Individual</div>
              <div className='text-xs text-gray-600 mt-1'>Sole proprietor or freelancer</div>
            </button>
            <button
              type='button'
              className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                type === 'company' 
                  ? 'border-[#F36E16] bg-orange-50 shadow-md scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => setValue('business.type', 'company')}
            >
              <div className='font-semibold text-gray-900'>Company</div>
              <div className='text-xs text-gray-600 mt-1'>Registered business entity</div>
            </button>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label className='text-sm font-semibold'>{type === 'company' ? 'Business/Company Name' : 'Business Name'}</Label>
            <Input 
              {...register('business.name', { required: true })} 
              placeholder='Enter business name' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
          {type === 'company' && (
            <div className='space-y-2'>
              <Label className='text-sm font-semibold flex items-center gap-2'>
                <FileText className='h-4 w-4 text-gray-500' />
                Registration Number / Tax ID
              </Label>
              <Input 
                {...register('business.registration', { required: true })} 
                placeholder='Enter registration number' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
          )}
          <div className='space-y-2'>
            <Label className='text-sm font-semibold flex items-center gap-2'>
              <Briefcase className='h-4 w-4 text-gray-500' />
              Industry/Category
            </Label>
            <div className='relative'>
              <Select 
                value={selectedIndustry} 
                onValueChange={(val) => {
                  setValue('business.industry', val)
                  setIndustrySearch('')
                }}
              >
                <SelectTrigger className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100 bg-white hover:bg-gray-50 transition-colors'>
                  <div className='flex items-center gap-2'>
                    <Briefcase className='h-4 w-4 text-gray-400' />
                    <SelectValue placeholder='Select Industry'>
                      {selectedIndustry ? (
                        <span className='text-gray-900'>{selectedIndustryLabel}</span>
                      ) : (
                        <span className='text-gray-400'>Select Industry</span>
                      )}
                    </SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent className='max-h-[400px] p-0'>
                  <div className='sticky top-0 bg-white border-b p-2 z-10'>
                    <div className='relative'>
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                      <Input
                        placeholder='Search industries...'
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        className='pl-9 h-9 border-2 focus:border-[#F36E16] focus:ring-1'
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className='max-h-[350px] overflow-y-auto'>
                    {filteredIndustries.length > 0 ? (
                      filteredIndustries.map((industry) => (
                        <SelectItem 
                          key={industry.value} 
                          value={industry.value}
                          className='cursor-pointer hover:bg-orange-50 focus:bg-orange-50 py-2.5'
                        >
                          <div className='flex items-center justify-between w-full'>
                            <span>{industry.label}</span>
                            {selectedIndustry === industry.value && (
                              <Check className='h-4 w-4 text-[#F36E16]' />
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className='px-2 py-4 text-center text-sm text-gray-500'>
                        No industries found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <Label className='text-sm font-semibold flex items-center gap-2 mb-4 block'>
            <MapPin className='h-4 w-4 text-gray-500' />
            Business Address
          </Label>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label className='text-sm font-medium flex items-center gap-2'>
                <Globe className='h-4 w-4 text-gray-500' />
                Country
              </Label>
              <div className='relative'>
                <Select 
                  value={selectedCountry} 
                  onValueChange={(val) => {
                    setValue('business.address.country', val)
                    setCountrySearch('')
                  }}
                >
                  <SelectTrigger className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100 bg-white hover:bg-gray-50 transition-colors w-full'>
                    <div className='flex items-center gap-2 flex-1'>
                      <Globe className='h-4 w-4 text-gray-400 flex-shrink-0' />
                      <SelectValue placeholder='Select Country'>
                        {selectedCountry ? (
                          <span className='text-gray-900 truncate'>{selectedCountryLabel}</span>
                        ) : (
                          <span className='text-gray-400'>Select Country</span>
                        )}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px] p-0 w-full">
                    <div className='sticky top-0 bg-white border-b p-2 z-10'>
                      <div className='relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                        <Input
                          placeholder='Search countries...'
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className='pl-9 h-9 border-2 focus:border-[#F36E16] focus:ring-1'
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className='max-h-[350px] overflow-y-auto'>
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <SelectItem 
                            key={country.value} 
                            value={country.value}
                            className='cursor-pointer hover:bg-orange-50 focus:bg-orange-50 py-2.5'
                          >
                            <div className='flex items-center justify-between w-full'>
                              <span className='truncate'>{country.label}</span>
                              {selectedCountry === country.value && (
                                <Check className='h-4 w-4 text-[#F36E16] flex-shrink-0 ml-2' />
                              )}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className='px-2 py-4 text-center text-sm text-gray-500'>
                          No countries found
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>State/Province</Label>
              <Input 
                {...register('business.address.state', { required: true })} 
                placeholder='Enter state or province' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>City</Label>
              <Input 
                {...register('business.address.city', { required: true })} 
                placeholder='Enter city' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>ZIP/Postal Code</Label>
              <Input 
                {...register('business.address.zip', { required: true })} 
                placeholder='Enter ZIP code' 
                className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Street Address</Label>
            <Input 
              {...register('business.address.line1', { required: true })} 
              placeholder='Enter street address' 
              className='h-12 border-2 focus:border-[#F36E16] focus:ring-2 focus:ring-orange-100'
            />
          </div>
        </div>

        <div className='space-y-4'>
          <Label className='text-sm font-semibold flex items-center gap-2'>
            <FileText className='h-4 w-4 text-gray-500' />
            Upload Documents
          </Label>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:border-[#F36E16] transition-colors'>
            <FileText className='h-12 w-12 text-gray-400 mx-auto mb-3' />
            <p className='text-sm font-medium text-gray-700 mb-1'>Upload business documents</p>
            <p className='text-xs text-gray-500 mb-4'>Business license, tax documents, etc.</p>
            <input 
              type='file' 
              {...register('business.documents')} 
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F36E16] file:text-white hover:file:bg-[#e06212] cursor-pointer'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}