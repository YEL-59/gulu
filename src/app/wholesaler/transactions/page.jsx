"use client";

import DashboardShell from "@/components/wholesaler/dashboard/DashboardShell";
import OrdersTable from "@/components/wholesaler/dashboard/OrdersTable";
import { Card } from "@/components/ui/card";

export default function WholesalerTransactionsPage() {
  return (
    <DashboardShell base="wholesaler">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Card className="p-4">
          <OrdersTable />
        </Card>
      </div>
    </DashboardShell>
  );
}