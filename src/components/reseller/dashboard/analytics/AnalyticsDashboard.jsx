"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAnalyticsController from './useAnalyticsController'
import KPIGrid from './KPIGrid'
import PerformanceLine from './PerformanceLine'
import UsersVisitsBar from './UsersVisitsBar'
import AudienceInsightBar from './AudienceInsightBar'
import SalesLocationCard from './SalesLocationCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AnalyticsDashboard({ initialRange }) {
  const { range, setRange, ranges, data } = useAnalyticsController(initialRange)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold'>Analytics</h2>
          <p className='text-muted-foreground'>Monitor progress regularly to increase sales</p>
        </div>
        <div className='flex items-center gap-2'>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ranges.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button className='rounded-md bg-[#F36E16] text-white px-3 py-2 text-sm'>Export</button>
        </div>
      </div>

      <KPIGrid kpi={data.kpi} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceLine labels={data.labels} values={data.performance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersVisitsBar labels={data.usersVisits.labels} values={data.usersVisits.values} />
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Audience Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <AudienceInsightBar labels={data.audienceInsight.labels} men={data.audienceInsight.men} women={data.audienceInsight.women} other={data.audienceInsight.other} />
          </CardContent>
        </Card>
        <SalesLocationCard data={data.salesLocation} />
      </div>
    </div>
  )
}