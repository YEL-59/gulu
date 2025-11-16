"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DropshippingOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadOrders();
    
    // In production, use API polling or websockets
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    try {
      // In production, fetch from API
      // For now, check if there are any orders in localStorage
      const stored = localStorage.getItem("dropshippingOrders");
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Mock data for demonstration
        setOrders([]);
      }
    } catch (error) {
      console.error("Error loading dropshipping orders:", error);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !searchQuery ||
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const variants = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", icon: Clock },
      processing: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: Package },
      shipped: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", icon: Truck },
      delivered: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: AlertCircle },
    };
    
    const variant = variants[status] || variants.pending;
    const Icon = variant.icon;
    
    return (
      <Badge
        variant="outline"
        className={`${variant.bg} ${variant.text} ${variant.border} flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = useMemo(() => {
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === "pending").length,
      processing: filteredOrders.filter((o) => o.status === "processing").length,
      shipped: filteredOrders.filter((o) => o.status === "shipped").length,
      totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      totalProfit: filteredOrders.reduce((sum, o) => sum + (o.profitAmount || 0), 0),
    };
  }, [filteredOrders]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">No dropshipping orders yet</p>
        <p className="text-sm text-gray-500">
          Orders for your dropshipped products will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders by ID, product, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-700">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Total Profit</p>
          <p className="text-2xl font-bold text-purple-700">
            ${stats.totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Your Profit</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <p className="font-mono text-sm text-gray-900">#{order.orderId}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {order.productImage && (
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    )}
                    <p className="text-sm text-gray-900">{order.productName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-900">{order.customerName}</p>
                  {order.customerEmail && (
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{order.quantity}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-semibold text-gray-900">
                    ${order.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-semibold text-green-600">
                    ${order.profitAmount?.toFixed(2) || "0.00"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-700">{order.supplierName}</p>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <p className="text-xs text-gray-500">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "—"}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

