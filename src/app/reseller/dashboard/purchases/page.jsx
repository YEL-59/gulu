"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { CheckCircle2, ShoppingCart, AlertCircle } from "lucide-react";
import resellerPurchasesData from "@/lib/data/resellerPurchases.json";
import ordersJson from "@/lib/data/orders.json";

export default function PurchasesPage() {
  const [mounted, setMounted] = useState(false);

  // Load purchases from localStorage (merged with default data)
  const loadPurchases = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('resellerPurchases');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.length > 0 ? parsed : resellerPurchasesData;
        }
      }
    } catch (e) {
      console.warn('Error loading purchases:', e);
    }
    return resellerPurchasesData;
  };

  // Initialize with default data to avoid hydration mismatch
  const [purchases, setPurchases] = useState(resellerPurchasesData);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setPurchases(loadPurchases());

    // Update purchases when localStorage changes
    const handleStorageChange = () => {
      setPurchases(loadPurchases());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      // Also check periodically in case same-window updates occur
      const interval = setInterval(handleStorageChange, 1000);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const pendingPurchases = useMemo(() => {
    return purchases.filter((p) => p.status === "pending");
  }, [purchases]);

  const completedPurchases = useMemo(() => {
    return purchases.filter((p) => p.status === "completed");
  }, [purchases]);

  const handlePurchaseClick = (purchase) => {
    setSelectedPurchase(purchase);
    setShowConfirmDialog(true);
  };

  const confirmPurchase = () => {
    if (!selectedPurchase) return;

    // Update purchase status
    const updatedPurchases = purchases.map((p) =>
      p.id === selectedPurchase.id ? { ...p, status: "completed", completedAt: new Date().toISOString() } : p
    );

    setPurchases(updatedPurchases);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('resellerPurchases', JSON.stringify(updatedPurchases));
      } catch (e) {
        console.warn('Could not save purchases to localStorage:', e);
      }
    }

    setShowConfirmDialog(false);
    setShowSuccessDialog(true);
    setSelectedPurchase(null);
  };

  const getOrderDetails = (orderId) => {
    return ordersJson.find((o) => o.id === orderId);
  };

  const totalPending = pendingPurchases.reduce((sum, p) => {
    return sum + p.wholesalerPrice * p.quantity;
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Purchase from Wholesalers</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Purchase products from wholesalers to fulfill your customer orders
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-gray-600">Total Pending Purchases</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              {pendingPurchases.length} items
            </p>
            <p className="text-base sm:text-lg font-semibold text-blue-600 mt-1">
              ${totalPending.toFixed(2)}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-blue-100 rounded-full flex-shrink-0">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
      </Card>

      {/* Pending Purchases */}
      {pendingPurchases.length > 0 && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Pending Purchases</h2>
          <div className="space-y-3 sm:space-y-4">
            {pendingPurchases.map((purchase) => {
              const order = getOrderDetails(purchase.orderId);
              return (
                <Card key={purchase.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{purchase.productName}</h3>
                        <Badge variant="outline" className="text-xs">
                          Order #{purchase.orderId}
                        </Badge>
                        <Badge variant="destructive" className="text-xs">
                          Pending
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Quantity:</span> {purchase.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Unit Price:</span> $
                          {purchase.wholesalerPrice.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Total Cost:</span>{" "}
                          <span className="font-semibold text-gray-900">
                            ${(purchase.wholesalerPrice * purchase.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Your Sale Price:</span> $
                          {purchase.resellerPrice.toFixed(2)}
                        </div>
                      </div>

                      {order && (
                        <div className="text-xs text-gray-500 mb-3">
                          Customer order placed on: {order.orderDate}
                        </div>
                      )}

                      <div className="mt-3 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-yellow-800">
                            You received payment from customer, but haven't purchased this product
                            from the wholesaler yet. Purchase now to fulfill the order.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePurchaseClick(purchase)}
                      className="bg-[#F36E16] hover:bg-[#e06212] whitespace-nowrap w-full sm:w-auto text-sm"
                    >
                      Purchase Now
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Purchases */}
      {completedPurchases.length > 0 && (
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Completed Purchases</h2>
          <div className="space-y-3 sm:space-y-4">
            {completedPurchases.map((purchase) => {
              const order = getOrderDetails(purchase.orderId);
              return (
                <Card key={purchase.id} className="p-4 sm:p-5 bg-green-50 border-green-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{purchase.productName}</h3>
                        <Badge variant="outline" className="text-xs">
                          Order #{purchase.orderId}
                        </Badge>
                        <Badge variant="default" className="bg-green-600 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantity:</span> {purchase.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Total Paid:</span>{" "}
                          <span className="font-semibold text-gray-900">
                            ${(purchase.wholesalerPrice * purchase.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {pendingPurchases.length === 0 && completedPurchases.length === 0 && (
        <Card className="p-8 sm:p-12 text-center">
          <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            No Purchases Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            When you receive orders for products from wholesalers, they will appear here.
          </p>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Purchase</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedPurchase && (
                <>
                  You are about to purchase <strong className="break-words">{selectedPurchase.productName}</strong> from
                  the wholesaler.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div className="mt-4 space-y-3">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-md space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-medium">{selectedPurchase.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span className="font-medium">
                    ${selectedPurchase.wholesalerPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total:</span>
                  <span>
                    ${(selectedPurchase.wholesalerPrice * selectedPurchase.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="w-full sm:w-auto text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPurchase}
              className="bg-[#F36E16] hover:bg-[#e06212] w-full sm:w-auto text-sm"
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              Purchase Completed
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Your purchase has been completed successfully. The product will now be shipped to
              fulfill your customer order.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full sm:w-auto text-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
