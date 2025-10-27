"use client";
import DashboardShell from '@/components/dashboard/DashboardShell'
import AnalyticsDashboard from '@/components/dashboard/analytics/AnalyticsDashboard'

export default function WholesalerAnalyticsPage() {
  return (
    <DashboardShell base="wholesaler">
      <AnalyticsDashboard />
    </DashboardShell>
  )
}