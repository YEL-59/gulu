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

  const [resellerPurchases, setResellerPurchases] = useState(loadPurchases());

  // Update purchases when localStorage changes
  useEffect(() => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Withdrawals</h1>
      </div>

      {/* Balance Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">${availableBalance.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {totalPendingAmount > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending Purchases</span>
                <span className="font-semibold text-red-600">-${totalPendingAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-900 font-medium">Net Available</span>
                <span className="text-2xl font-bold text-gray-900">${netAvailable.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Alert if pending purchases exist */}
      {pendingPurchases.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cannot Withdraw</AlertTitle>
          <AlertDescription>
            You have {pendingPurchases.length} pending purchase(s) from wholesalers totaling ${totalPendingAmount.toFixed(2)}. 
            You must purchase these products from wholesalers before you can withdraw money.
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/reseller/dashboard/purchases"}
                className="mt-2"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Pending Purchases
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Withdrawal Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Request Withdrawal</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
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
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum available: ${netAvailable.toFixed(2)}
            </p>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={!canWithdraw || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > netAvailable}
            className="w-full bg-[#F36E16] hover:bg-[#e06212]"
          >
            Request Withdrawal
          </Button>

          {!canWithdraw && pendingPurchases.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No funds available for withdrawal
            </p>
          )}
        </div>
      </Card>

      {/* Pending Purchases List */}
      {pendingPurchases.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Purchases from Wholesalers</h2>
          <div className="space-y-3">
            {pendingPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{purchase.productName}</span>
                    <Badge variant="outline" className="text-xs">
                      Order #{purchase.orderId}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Quantity: {purchase.quantity} × ${purchase.wholesalerPrice.toFixed(2)} = $
                    {(purchase.wholesalerPrice * purchase.quantity).toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/reseller/dashboard/purchases"}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw ${withdrawAmount}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmWithdraw}
              className="bg-[#F36E16] hover:bg-[#e06212]"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Withdrawal Request Submitted
            </DialogTitle>
            <DialogDescription>
              Your withdrawal request of ${withdrawAmount} has been submitted and will be processed within 2-3 business days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
