"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, DollarSign, ShoppingCart, CheckCircle2 } from "lucide-react";
import resellerPurchasesData from "@/lib/data/resellerPurchases.json";
import ordersJson from "@/lib/data/orders.json";

export default function WithdrawalsPage() {
  const [mounted, setMounted] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
  const [resellerPurchases, setResellerPurchases] = useState(resellerPurchasesData);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setResellerPurchases(loadPurchases());

    // Update purchases when localStorage changes
    const handleStorageChange = () => {
      setResellerPurchases(loadPurchases());
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

  // Get pending purchases that need to be fulfilled
  const pendingPurchases = useMemo(() => {
    return resellerPurchases.filter((p) => p.status === "pending");
  }, [resellerPurchases]);

  // Calculate total pending amount
  const totalPendingAmount = useMemo(() => {
    return pendingPurchases.reduce((sum, purchase) => {
      return sum + purchase.wholesalerPrice * purchase.quantity;
    }, 0);
  }, [pendingPurchases]);

  // Get completed orders total (money available for withdrawal)
  const availableBalance = useMemo(() => {
    const completedOrders = ordersJson.filter(
      (order) => order.status === "completed" || order.status === "confirmed"
    );
    return completedOrders.reduce((sum, order) => {
      const item = order.items?.[0];
      if (!item) return sum;
      return sum + Number(item.price) * Number(item.quantity ?? 1);
    }, 0);
  }, []);

  // Calculate net available (after subtracting pending purchases)
  const netAvailable = Math.max(0, availableBalance - totalPendingAmount);

  const canWithdraw = pendingPurchases.length === 0 && netAvailable > 0;

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > netAvailable) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmWithdraw = () => {
    // In a real app, call API here
    console.log("Withdrawing:", withdrawAmount);
    setShowConfirmDialog(false);
    setShowSuccessDialog(true);
    setWithdrawAmount("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">Withdrawals</h1>
      </div>

      {/* Balance Card */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">${availableBalance.toFixed(2)}</p>
            </div>
            <div className="p-3 sm:p-4 bg-blue-100 rounded-full flex-shrink-0">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          {totalPendingAmount > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Pending Purchases</span>
                <span className="font-semibold text-red-600">-${totalPendingAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-900 font-medium text-sm sm:text-base">Net Available</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">${netAvailable.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Alert if pending purchases exist */}
      {pendingPurchases.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <AlertTitle className="text-sm sm:text-base">Cannot Withdraw</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            You have {pendingPurchases.length} pending purchase(s) from wholesalers totaling ${totalPendingAmount.toFixed(2)}.
            You must purchase these products from wholesalers before you can withdraw money.
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = "/reseller/dashboard/purchases"}
                className="mt-2 w-full sm:w-auto text-xs sm:text-sm"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                View Pending Purchases
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Withdrawal Form */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Request Withdrawal</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              Withdrawal Amount
            </label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              max={netAvailable}
              min="0"
              step="0.01"
              disabled={!canWithdraw}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum available: ${netAvailable.toFixed(2)}
            </p>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={!canWithdraw || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > netAvailable}
            className="w-full bg-[#F36E16] hover:bg-[#e06212] text-sm"
          >
            Request Withdrawal
          </Button>

          {!canWithdraw && pendingPurchases.length === 0 && (
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              No funds available for withdrawal
            </p>
          )}
        </div>
      </Card>

      {/* Pending Purchases List */}
      {pendingPurchases.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Pending Purchases from Wholesalers</h2>
          <div className="space-y-3">
            {pendingPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-sm sm:text-base break-words">{purchase.productName}</span>
                    <Badge variant="outline" className="text-xs">
                      Order #{purchase.orderId}
                    </Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Quantity: {purchase.quantity} × ${purchase.wholesalerPrice.toFixed(2)} = $
                    {(purchase.wholesalerPrice * purchase.quantity).toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/reseller/dashboard/purchases"}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Purchase Now
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Withdrawal</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Are you sure you want to withdraw ${withdrawAmount}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="w-full sm:w-auto text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmWithdraw}
              className="bg-[#F36E16] hover:bg-[#e06212] w-full sm:w-auto text-sm"
            >
              Confirm
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
              Withdrawal Request Submitted
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Your withdrawal request of ${withdrawAmount} has been submitted and will be processed within 2-3 business days.
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
