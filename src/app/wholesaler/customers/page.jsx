"use client";

import DashboardShell from "@/components/wholesaler/dashboard/DashboardShell";
import CustomersTable from "@/components/reseller/dashboard/CustomersTable";
import { Card } from "@/components/ui/card";

export default function WholesalerCustomersPage() {
  return (
    <DashboardShell base="wholesaler">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Card className="p-4">
          <CustomersTable />
        </Card>
      </div>
    </DashboardShell>
  );
}