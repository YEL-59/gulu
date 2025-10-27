"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ordersData from "@/lib/data/orders.json";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatGrid from "@/components/dashboard/StatGrid";
import SalesLineChart from "@/components/dashboard/charts/SalesLineChart";
import RevenueAreaChart from "@/components/dashboard/charts/RevenueAreaChart";
import CustomersDonut from "@/components/dashboard/charts/CustomersDonut";
import OrdersTable from "@/components/dashboard/OrdersTable";
import MonthDropdown from "@/components/dashboard/MonthDropdown";

export default function WholesalerDashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState("October");

  const stats = useMemo(
    () => ({
      revenue: 82000,
      customers: 5000,
      transactions: 25000,
      products: 2000,
    }),
    []
  );

  const orders = useMemo(() => {
    return Array.isArray(ordersData) ? ordersData.slice(0, 9) : [];
  }, []);

  return (
    <DashboardShell base="wholesaler">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Wholesaler Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <MonthDropdown
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            <Button className="bg-[#F36E16] hover:bg-[#e06212]">Export</Button>
          </div>
        </div>
        <StatGrid stats={stats} selectedMonth={selectedMonth} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="lg:col-span-2">
            <CardContent>
              <SalesLineChart
                labels={["1", "5", "10", "15", "20", "25", "30"]}
                data={[10, 20, 18, 25, 22, 30, 28]}
                selectedMonth={selectedMonth}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <CustomersDonut selectedMonth={selectedMonth} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card>
            <CardContent>
              <RevenueAreaChart
                labels={["10", "20", "30", "40", "50", "60", "70"]}
                sales={[30, 40, 35, 50, 45, 55, 50]}
                profit={[20, 25, 22, 30, 28, 35, 33]}
                selectedMonth={selectedMonth}
              />
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable orders={orders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
