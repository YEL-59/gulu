"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getMonthlyChanges } from "@/lib/data/monthlyData";

const StatGrid = ({ selectedMonth = "October" }) => {
  const monthlyData = getMonthlyChanges(selectedMonth);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${monthlyData.revenue.value.toLocaleString()}`,
      change: `${monthlyData.revenue.change > 0 ? "+" : ""}${
        monthlyData.revenue.change
      }%`,
      trend: monthlyData.revenue.change >= 0 ? "up" : "down",
      period: "vs last month",
      icon: "💰",
    },
    {
      title: "Total Customer",
      value: monthlyData.customers.value.toLocaleString(),
      change: `${monthlyData.customers.change > 0 ? "+" : ""}${
        monthlyData.customers.change
      }%`,
      trend: monthlyData.customers.change >= 0 ? "up" : "down",
      period: "vs last month",
      icon: "👥",
    },
    {
      title: "Total Transactions",
      value: monthlyData.transactions.value.toLocaleString(),
      change: `${monthlyData.transactions.change > 0 ? "+" : ""}${
        monthlyData.transactions.change
      }%`,
      trend: monthlyData.transactions.change >= 0 ? "up" : "down",
      period: "vs last month",
      icon: "💳",
    },
    {
      title: "Total Product",
      value: monthlyData.products.value.toLocaleString(),
      change: `${monthlyData.products.change > 0 ? "+" : ""}${
        monthlyData.products.change
      }%`,
      trend: monthlyData.products.change >= 0 ? "up" : "down",
      period: "vs last month",
      icon: "📦",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="text-xl sm:text-2xl">{stat.icon}</div>
            <Badge
              variant={stat.trend === "up" ? "default" : "destructive"}
              className="flex items-center gap-1 text-xs"
            >
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stat.change}
            </Badge>
          </div>

          <div className="mt-3 sm:mt-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 break-words">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatGrid;

