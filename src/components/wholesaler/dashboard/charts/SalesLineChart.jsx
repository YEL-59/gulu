"use client";

import { Line } from "react-chartjs-2";
import ChartSetup from "./ChartSetup";
import { getMonthData } from "@/lib/data/monthlyData";

const SalesLineChart = ({ selectedMonth = "October" }) => {
  // Initialize Chart.js
  ChartSetup();

  // Get monthly data
  const monthData = getMonthData(selectedMonth);
  const salesData = monthData.sales;

  // Prepare chart data
  const data = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Sales",
        data: salesData.daily.map((value) => (value / 1000).toFixed(1)), // Convert to percentage-like values
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
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
        display: false,
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
        displayColors: false,
        callbacks: {
          title: (context) => `${selectedMonth} ${context[0].label}`,
          label: (context) => `$${(context.parsed.y * 1000).toLocaleString()}`,
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
          callback: (value) => `${value}%`,
        },
        min: 0,
        max: Math.max(...salesData.daily.map((v) => v / 1000)) * 1.1,
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

export default SalesLineChart;
