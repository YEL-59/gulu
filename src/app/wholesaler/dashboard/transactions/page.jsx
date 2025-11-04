"use client";

import OrdersTable from "@/components/wholesaler/dashboard/OrdersTable";
import { Card } from "@/components/ui/card";

export default function WholesalerTransactionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <Card className="p-4">
        <OrdersTable />
      </Card>
    </div>
  );
}