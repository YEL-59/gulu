"use client";
import DashboardShell from '@/components/dashboard/DashboardShell'
import AnalyticsDashboard from '@/components/dashboard/analytics/AnalyticsDashboard'

export default function ResellerAnalyticsPage() {
  return (
    <DashboardShell base="reseller">
      <AnalyticsDashboard />
    </DashboardShell>
  )
}