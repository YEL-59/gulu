"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, DollarSign, Package } from "lucide-react";
import resellerPurchasesData from "@/lib/data/resellerPurchases.json";

export default function WholesalerWithdrawalsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Load purchases to calculate revenue
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

  const [purchases, setPurchases] = useState(loadPurchases());

  useEffect(() => {
    const handleStorageChange = () => {
      setPurchases(loadPurchases());
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

  // Calculate available balance from completed orders
  const availableBalance = useMemo(() => {
    const completed = purchases.filter((p) => p.status === "completed");
    return completed.reduce((sum, purchase) => {
      return sum + purchase.wholesalerPrice * purchase.quantity;
    }, 0);
  }, [purchases]);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > availableBalance) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmWithdraw = () => {
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
              <p className="text-xs text-gray-500 mt-1">
                Revenue from completed reseller orders
              </p>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </Card>

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
              max={availableBalance}
              min="0"
              step="0.01"
              disabled={availableBalance <= 0}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum available: ${availableBalance.toFixed(2)}
            </p>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableBalance}
            className="w-full bg-[#F36E16] hover:bg-[#e06212]"
          >
            Request Withdrawal
          </Button>

          {availableBalance <= 0 && (
            <p className="text-sm text-gray-500 text-center">
              No funds available for withdrawal. Complete reseller orders to receive payments.
            </p>
          )}
        </div>
      </Card>

      {/* Revenue Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Completed Orders:</span>
            <span className="font-medium">
              {purchases.filter((p) => p.status === "completed").length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending Orders:</span>
            <span className="font-medium text-orange-600">
              {purchases.filter((p) => p.status === "pending").length}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total Revenue:</span>
              <span>
                ${purchases.reduce((sum, p) => sum + p.wholesalerPrice * p.quantity, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

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
