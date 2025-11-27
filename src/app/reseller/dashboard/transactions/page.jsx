"use client";

import OrdersTable from "@/components/reseller/dashboard/OrdersTable";
import { Card } from "@/components/ui/card";

export default function ResellerTransactionsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Transactions</h1>
      <Card className="p-3 sm:p-4 md:p-6">
        <OrdersTable />
      </Card>
    </div>
  );
}