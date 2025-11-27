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
    <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {items.map(({ key, label, icon: Icon, bg, fg }) => {
        const metric = kpi?.[key] ?? { value: 0, change: 0 }
        const isUp = metric.change >= 0
        const lastWeek = metric.value && Number.isFinite(metric.change)
          ? Math.round(metric.value / (1 + metric.change / 100))
          : 0
        return (
          <Card key={key} className={`border bg-gray-50 ${bg}`}>
            <CardContent className='p-4 sm:p-5'>
              {/* Top: icon and label */}
              <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5'>
                <div className={`size-8 sm:size-9 flex items-center justify-center rounded-md ${fg} flex-shrink-0`}>
                  <Icon className='size-4 sm:size-5' />
                </div>
                <div className='text-xs sm:text-sm text-gray-600 font-medium min-w-0'>{label}</div>
              </div>

              {/* Bottom: value left, change + last week right */}
              <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3'>
                <div className='text-2xl sm:text-3xl font-bold leading-tight text-gray-900 min-w-0'>{formatCompact(metric.value)}</div>
                <div className='flex flex-col items-start sm:items-end gap-0.5 sm:gap-1 flex-shrink-0'>
                  <div className={`text-sm sm:text-base font-semibold ${isUp ? 'text-emerald-600' : 'text-rose-600'} flex items-center gap-1`}>
                    <span>{isUp ? '↗' : '↘'}</span>
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                  <div className='text-xs sm:text-sm text-gray-500'>Last week {formatCompact(lastWeek)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

