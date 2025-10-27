"use client";

import { Doughnut } from "react-chartjs-2";
import ChartSetup from "./ChartSetup";
import { getMonthData } from "@/lib/data/monthlyData";

const CustomersDonut = ({ selectedMonth = "October" }) => {
  // Initialize Chart.js
  ChartSetup();

  // Get monthly data
  const monthData = getMonthData(selectedMonth);
  const customerData = monthData.customers;

  // Prepare chart data
  const data = {
    labels: ["New Customers", "Repeated Customers"],
    datasets: [
      {
        data: [customerData.new, customerData.repeated],
        backgroundColor: ["#3b82f6", "#e5e7eb"],
        borderWidth: 0,
        cutout: "70%",
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
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  const totalCustomers = customerData.total;
  const newCustomers = customerData.new;
  const repeatedCustomers = customerData.repeated;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-sm font-semibold">
              {totalCustomers.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">New Customers</span>
          <span className="font-semibold ml-auto">
            {newCustomers.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-gray-600">Repeated</span>
          <span className="font-semibold ml-auto">
            {repeatedCustomers.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomersDonut;
