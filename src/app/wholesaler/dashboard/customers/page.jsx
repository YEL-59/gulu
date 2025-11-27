"use client";

import CustomersTable from "@/components/wholesaler/dashboard/CustomersTable";
import { Card } from "@/components/ui/card";

export default function WholesalerCustomersPage() {
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">Customers</h1>
      <Card className="p-3 sm:p-4 md:p-6">
        <CustomersTable />
      </Card>
    </div>
  );
}
