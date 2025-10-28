"use client";
import DashboardShell from '@/components/wholesaler/dashboard/DashboardShell'
import AnalyticsDashboard from '@/components/wholesaler/dashboard/analytics/AnalyticsDashboard'

export default function WholesalerAnalyticsPage() {
  return (
    <DashboardShell base="wholesaler">
      <AnalyticsDashboard />
    </DashboardShell>
  )
}