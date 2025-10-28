"use client";

import CustomersTable from "@/components/reseller/dashboard/CustomersTable";
import { Card } from "@/components/ui/card";

export default function ResellerCustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <Card className="p-4">
        <CustomersTable />
      </Card>
    </div>
  );
}
