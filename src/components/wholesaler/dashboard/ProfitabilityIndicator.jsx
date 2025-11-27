"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Percent, Package, ShoppingCart } from "lucide-react";

// Mock data - In real app, this would come from API
const calculateProfitability = () => {
  // Example: 1,000 pcs in stock, 300 pcs sold
  const totalStock = 1000;
  const soldQuantity = 300;
  const buyPrice = 50; // Average buy price per unit
  const sellPrice = 75; // Average sell price per unit
  
  const profitPerUnit = sellPrice - buyPrice;
  const totalProfit = soldQuantity * profitPerUnit;
  const totalRevenue = soldQuantity * sellPrice;
  const totalCost = soldQuantity * buyPrice;
  const margin = ((sellPrice - buyPrice) / sellPrice) * 100;
  
  // Monthly performance (assuming current month)
  const monthlyPerformance = (soldQuantity / totalStock) * 100;
  
  // Annual performance (projected based on current month)
  const monthsInYear = 12;
  const projectedAnnualSales = soldQuantity * monthsInYear;
  const annualPerformance = (projectedAnnualSales / totalStock) * 100;
  
  return {
    totalStock,
    soldQuantity,
    remainingStock: totalStock - soldQuantity,
    totalProfit,
    totalRevenue,
    totalCost,
    margin,
    monthlyPerformance,
    annualPerformance,
    profitPerUnit,
  };
};

export default function ProfitabilityIndicator() {
  const data = calculateProfitability();

  return (
    <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance Indicator</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Profitability & Business Performance</p>
        </div>
        <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
        {/* Total Profit */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Total Profit</span>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-700 break-words">
            ${data.totalProfit.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ${data.profitPerUnit.toFixed(2)} per unit
          </p>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Monthly Performance</span>
            <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-700">
            {data.monthlyPerformance.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data.soldQuantity} of {data.totalStock} units
          </p>
        </div>

        {/* Annual Performance */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Annual Performance</span>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-700">
            {data.annualPerformance.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Projected annual sales
          </p>
        </div>

        {/* Profit Margin */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Profit Margin</span>
            <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-700">
            {data.margin.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Average margin per unit
          </p>
        </div>
      </div>

      {/* Stock & Sales Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600">Total Stock</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{data.totalStock.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Units in inventory</p>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600">Units Sold</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-700">{data.soldQuantity.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600">Remaining Stock</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-blue-700">{data.remainingStock.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Available for sale</p>
        </div>
      </div>

      {/* Performance Badge */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-700">Store Performance</p>
            <p className="text-xs text-gray-500 mt-1">
              Based on stock changes, sales data, pricing, and customer demand
            </p>
          </div>
          <Badge 
            variant={data.monthlyPerformance >= 30 ? "default" : "secondary"}
            className="bg-green-600 text-white text-xs sm:text-sm whitespace-nowrap"
          >
            {data.monthlyPerformance >= 30 ? "Excellent" : data.monthlyPerformance >= 20 ? "Good" : "Needs Improvement"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

