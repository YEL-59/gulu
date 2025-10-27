import ChartSetup from '@/components/dashboard/charts/ChartSetup'
import { Bar } from 'react-chartjs-2'

export default function AudienceInsightBar({ labels, men, women, other }) {
  ChartSetup()

  const maxVal = Math.max(
    ...(men || []),
    ...(women || []),
    ...(other || [])
  )

  const formatTicks = (v) => {
    if (v >= 1000000) return '1.0M'
    return `${Math.round(v / 1000)}K`
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Men',
        data: men,
        backgroundColor: '#1d4ed8',
        borderRadius: 6,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
      {
        label: 'Woman',
        data: women,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
      {
        label: 'Not Specific',
        data: other,
        backgroundColor: '#bfdbfe',
        borderRadius: 6,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: { usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatTicks(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: { stacked: false, grid: { display: false } },
      y: {
        stacked: false,
        grid: { color: 'rgba(0,0,0,0.05)' },
        beginAtZero: true,
        ticks: { stepSize: 100000, callback: formatTicks },
        suggestedMax: Math.max(Math.ceil(maxVal / 100000) * 100000, 1000000),
      },
    },
  }

  return (
    <div className='h-64'>
      <Bar data={data} options={options} />
    </div>
  )
}