"use client";

import { Line } from "react-chartjs-2";
import ChartSetup from "./ChartSetup";
import { getMonthData } from "@/lib/data/monthlyData";

const RevenueAreaChart = ({ selectedMonth = "October" }) => {
  // Initialize Chart.js
  ChartSetup();

  // Get monthly data
  const monthData = getMonthData(selectedMonth);
  const revenueData = monthData.revenue;

  // Prepare chart data
  const data = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Sales",
        data: revenueData.daily.sales.map((value) => Math.round(value / 1000)), // Convert to thousands
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: "Profit",
        data: revenueData.daily.profit.map((value) => Math.round(value / 1000)), // Convert to thousands
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context) => `${selectedMonth} ${context[0].label}`,
          label: (context) =>
            `${context.dataset.label}: $${(
              context.parsed.y * 1000
            ).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          callback: (value) => `${value}k`,
        },
        min: 0,
        max: Math.max(...revenueData.daily.sales.map((v) => v / 1000)) * 1.1,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueAreaChart;
