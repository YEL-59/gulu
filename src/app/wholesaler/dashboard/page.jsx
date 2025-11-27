"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import StatGrid from "@/components/wholesaler/dashboard/StatGrid";
import ProfitabilityIndicator from "@/components/wholesaler/dashboard/ProfitabilityIndicator";
import SalesLineChart from "@/components/wholesaler/dashboard/charts/SalesLineChart";
import RevenueAreaChart from "@/components/wholesaler/dashboard/charts/RevenueAreaChart";
import CustomersDonut from "@/components/wholesaler/dashboard/charts/CustomersDonut";
import OrdersTable from "@/components/wholesaler/dashboard/OrdersTable";
import MonthDropdown from "@/components/wholesaler/dashboard/MonthDropdown";

export default function WholesalerDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("October");

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1 sm:mb-2">Wholesaler Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-600">Overview of your business operations</p>
      </div>
      {/* Stats Grid */}
      <StatGrid selectedMonth={selectedMonth} />

      {/* Profitability Indicator */}
      <ProfitabilityIndicator />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Sales Details Chart */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Sales Details</h3>
              <MonthDropdown
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </div>
            <SalesLineChart selectedMonth={selectedMonth} />
          </Card>
        </div>

        {/* Customers Chart */}
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Customers</h3>
          </div>
          <CustomersDonut selectedMonth={selectedMonth} />
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold">Revenue</h3>
          <MonthDropdown
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
        <RevenueAreaChart selectedMonth={selectedMonth} />
      </Card>

      {/* Orders Table */}
      <Card className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold">Recent Orders</h3>
        </div>
        <OrdersTable />
      </Card>
    </div>
  );
}
