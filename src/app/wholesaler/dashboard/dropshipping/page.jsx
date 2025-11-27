"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, Search, Plus, TrendingUp, Link2, Globe } from "lucide-react";
import DropshippingBrowse from "@/components/wholesaler/dashboard/dropshipping/DropshippingBrowse";
import DropshippedProductsTable from "@/components/wholesaler/dashboard/dropshipping/DropshippedProductsTable";
import DropshippingOrdersTable from "@/components/wholesaler/dashboard/dropshipping/DropshippingOrdersTable";
import PlatformConnections from "@/components/wholesaler/dashboard/dropshipping/PlatformConnections";
import ProductImporter from "@/components/wholesaler/dashboard/dropshipping/ProductImporter";

export default function DropshippingPage() {
  const [activeTab, setActiveTab] = useState("platforms");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Dropshipping</h1>
          <p className="text-sm text-gray-600">
            Import products from external platforms (Daraz, AliBaba, AliExpress, etc.) and sell without inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">Active Dropshipped Products</p>
            <p className="text-2xl font-bold text-[#F36E16]">0</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pending Orders</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">$0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Avg. Profit Margin</p>
              <p className="text-2xl font-bold">0%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="platforms">
              <Globe className="h-4 w-4 mr-2" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="import">
              <Link2 className="h-4 w-4 mr-2" />
              Import Products
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="h-4 w-4 mr-2" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <TrendingUp className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="mt-6">
            <PlatformConnections />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <ProductImporter />
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            <DropshippingBrowse />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <DropshippedProductsTable />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <DropshippingOrdersTable />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

