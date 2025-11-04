"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import StatGrid from "@/components/wholesaler/dashboard/StatGrid";
import SalesLineChart from "@/components/wholesaler/dashboard/charts/SalesLineChart";
import RevenueAreaChart from "@/components/wholesaler/dashboard/charts/RevenueAreaChart";
import CustomersDonut from "@/components/wholesaler/dashboard/charts/CustomersDonut";
import OrdersTable from "@/components/wholesaler/dashboard/OrdersTable";
import MonthDropdown from "@/components/wholesaler/dashboard/MonthDropdown";

export default function WholesalerDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("October");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Wholesaler Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of your business operations</p>
      </div>
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
  );
}
