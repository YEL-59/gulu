"use client";

import DashboardShell from "@/components/reseller/dashboard/DashboardShell";
import AnalyticsDashboard from "@/components/reseller/dashboard/analytics/AnalyticsDashboard";

export default function ResellerAnalyticsPage() {
  return (
    <DashboardShell>
      <AnalyticsDashboard />
    </DashboardShell>
  );
}