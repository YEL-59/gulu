"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import resellerPurchasesData from "@/lib/data/resellerPurchases.json";
import sellersData from "@/lib/data/sellers.json";

export default function WholesalerResellersPage() {
  // Load purchases to get reseller activity
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

  const purchases = loadPurchases();

  // Get unique resellers from purchases
  const resellers = useMemo(() => {
    const resellerMap = new Map();
    
    purchases.forEach((purchase) => {
      const resellerId = purchase.resellerId;
      if (!resellerMap.has(resellerId)) {
        const seller = sellersData.find((s) => s.id === resellerId && s.type === "reseller");
        if (seller) {
          resellerMap.set(resellerId, {
            ...seller,
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            completedRevenue: 0,
            pendingRevenue: 0,
          });
        }
      }
      
      const reseller = resellerMap.get(resellerId);
      if (reseller) {
        reseller.totalOrders++;
        const orderValue = purchase.wholesalerPrice * purchase.quantity;
        reseller.totalRevenue += orderValue;
        
        if (purchase.status === "completed") {
          reseller.completedOrders++;
          reseller.completedRevenue += orderValue;
        } else {
          reseller.pendingOrders++;
          reseller.pendingRevenue += orderValue;
        }
      }
    });

    return Array.from(resellerMap.values());
  }, [purchases]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Resellers</h1>
          <p className="text-sm text-gray-600 mt-1">
            View resellers who purchase products from you
          </p>
        </div>
      </div>

      {resellers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resellers.map((reseller) => (
            <Card key={reseller.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{reseller.name}</h3>
                  <p className="text-sm text-gray-600">{reseller.location}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-medium">{reseller.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <Badge variant="default" className="bg-green-600">
                      {reseller.completedOrders}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending:</span>
                    <Badge variant="destructive">{reseller.pendingOrders}</Badge>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Revenue:</span>
                      <span className="text-green-600">
                        ${reseller.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Completed:</span>
                      <span>${reseller.completedRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Pending:</span>
                      <span>${reseller.pendingRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600">
            No resellers have purchased from you yet.
          </p>
        </Card>
      )}
    </div>
  );
}

