"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Package, AlertCircle, Eye } from "lucide-react";
import resellerPurchasesData from "@/lib/data/resellerPurchases.json";

export default function WholesalerOrdersPage() {
  // Load purchases (orders from resellers) from localStorage
  const loadOrders = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('resellerPurchases');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.length > 0 ? parsed : resellerPurchasesData;
        }
      }
    } catch (e) {
      console.warn('Error loading orders:', e);
    }
    return resellerPurchasesData;
  };

  const [orders, setOrders] = useState(loadOrders());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Update orders when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setOrders(loadOrders());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      const interval = setInterval(handleStorageChange, 1000);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  // Filter orders for this wholesaler (in production, this would filter by logged-in wholesaler ID)
  const wholesalerOrders = useMemo(() => {
    // For demo, show all orders. In production, filter by wholesalerId from session
    return orders;
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return wholesalerOrders.filter((o) => o.status === "pending");
  }, [wholesalerOrders]);

  const completedOrders = useMemo(() => {
    return wholesalerOrders.filter((o) => o.status === "completed");
  }, [wholesalerOrders]);

  const totalPendingRevenue = pendingOrders.reduce((sum, o) => {
    return sum + o.wholesalerPrice * o.quantity;
  }, 0);

  const totalCompletedRevenue = completedOrders.reduce((sum, o) => {
    return sum + o.wholesalerPrice * o.quantity;
  }, 0);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reseller Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage orders from resellers purchasing your products
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pendingOrders.length}
              </p>
              <p className="text-lg font-semibold text-blue-600 mt-1">
                ${totalPendingRevenue.toFixed(2)}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {completedOrders.length}
              </p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                ${totalCompletedRevenue.toFixed(2)}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gray-50 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${(totalPendingRevenue + totalCompletedRevenue).toFixed(2)}
              </p>
            </div>
            <Package className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Pending Orders</h2>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.productName}</h3>
                      <Badge variant="outline" className="text-xs">
                        Order #{order.orderId}
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        Pending Payment
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Reseller:</span>{" "}
                        <span className="text-gray-900">Reseller #{order.resellerId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Unit Price:</span> $
                        {order.wholesalerPrice.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          ${(order.wholesalerPrice * order.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Order created: {new Date(order.createdAt).toLocaleDateString()}
                    </div>

                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          Waiting for reseller to complete purchase. This order will be fulfilled once payment is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleViewOrder(order)}
                    className="whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed Orders</h2>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <Card key={order.id} className="p-5 bg-green-50 border-green-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.productName}</h3>
                      <Badge variant="outline" className="text-xs">
                        Order #{order.orderId}
                      </Badge>
                      <Badge variant="default" className="bg-green-600 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Paid & Completed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Reseller:</span>{" "}
                        <span className="text-gray-900">Reseller #{order.resellerId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Unit Price:</span> $
                        {order.wholesalerPrice.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Total Paid:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          ${(order.wholesalerPrice * order.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {order.completedAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        Completed: {new Date(order.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleViewOrder(order)}
                    className="whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pendingOrders.length === 0 && completedOrders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600">
            When resellers purchase your products, orders will appear here.
          </p>
        </Card>
      )}

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedOrder.status === "completed" ? "default" : "destructive"}>
                      {selectedOrder.status === "completed" ? "Completed" : "Pending"}
                    </Badge>
                    <span className="text-sm text-gray-600">Order #{selectedOrder.orderId}</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.productName}</p>
                      <p className="text-sm text-gray-600">Product ID: {selectedOrder.productId}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reseller:</span>
                        <span className="font-medium">Reseller #{selectedOrder.resellerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{selectedOrder.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-medium">
                          ${selectedOrder.wholesalerPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total Amount:</span>
                        <span>
                          ${(selectedOrder.wholesalerPrice * selectedOrder.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      {selectedOrder.completedAt && (
                        <p>Completed: {new Date(selectedOrder.completedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

