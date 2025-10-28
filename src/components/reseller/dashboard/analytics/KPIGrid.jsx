import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Users, Activity, MousePointerClick } from 'lucide-react'

const items = [
  { key: 'impressions', label: 'Impressions', icon: Activity, bg: 'bg-blue-50', fg: 'bg-blue-100 text-blue-700' },
  { key: 'involvements', label: 'Involvements', icon: MousePointerClick, bg: 'bg-orange-50', fg: 'bg-orange-100 text-orange-700' },
  { key: 'totalAudience', label: 'Total Audiences', icon: Users, bg: 'bg-emerald-50', fg: 'bg-emerald-100 text-emerald-700' },
  { key: 'audienceInteractions', label: 'Audience interactions', icon: TrendingUp, bg: 'bg-purple-50', fg: 'bg-purple-100 text-purple-700' },
]

export default function KPIGrid({ kpi }) {
  const formatCompact = (n) => {
    if (typeof n !== 'number') return n
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {items.map(({ key, label, icon: Icon, bg, fg }) => {
        const metric = kpi?.[key] ?? { value: 0, change: 0 }
        const isUp = metric.change >= 0
        const lastWeek = metric.value && Number.isFinite(metric.change)
          ? Math.round(metric.value / (1 + metric.change / 100))
          : 0
        return (
          <Card key={key} className={`border bg-gray-50 ${bg}`}>
            <CardContent className='p-5'>
              {/* Top: icon and label */}
              <div className='flex items-center gap-3'>
                <div className={`size-9 flex items-center justify-center rounded-md ${fg}`}>
                  <Icon className='size-5' />
                </div>
                <div className='text-sm text-gray-600'>{label}</div>
              </div>

              {/* Bottom: value left, change + last week right */}
              <div className='mt-6 flex items-end justify-between'>
                <div className='text-2xl font-semibold leading-tight'>{formatCompact(metric.value)}</div>
                <div className='text-right'>
                  <div className={`text-sm ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isUp ? '↗' : '↘'} {Math.abs(metric.change)}%
                  </div>
                  <div className='text-xs text-muted-foreground'>Last week {formatCompact(lastWeek)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}