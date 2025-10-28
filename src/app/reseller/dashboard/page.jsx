"use client";

import { useState } from "react";
import DashboardShell from "@/components/reseller/dashboard/DashboardShell";
import StatGrid from "@/components/reseller/dashboard/StatGrid";
import SalesLineChart from "@/components/reseller/dashboard/charts/SalesLineChart";
import RevenueAreaChart from "@/components/reseller/dashboard/charts/RevenueAreaChart";
import CustomersDonut from "@/components/reseller/dashboard/charts/CustomersDonut";
import OrdersTable from "@/components/reseller/dashboard/OrdersTable";
import MonthDropdown from "@/components/reseller/dashboard/MonthDropdown";
import { Card } from "@/components/ui/card";

export default function ResellerDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("October");

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Stats Grid */}
        <StatGrid selectedMonth={selectedMonth} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Details Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sales Details</h3>
                <MonthDropdown
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>
              <SalesLineChart selectedMonth={selectedMonth} />
            </Card>
          </div>

          {/* Customers Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Customers</h3>
            </div>
            <CustomersDonut selectedMonth={selectedMonth} />
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <MonthDropdown
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
          <RevenueAreaChart selectedMonth={selectedMonth} />
        </Card>

        {/* Orders Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <OrdersTable />
        </Card>
      </div>
    </DashboardShell>
  );
}
