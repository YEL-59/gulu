"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const demoCustomers = [
  { id: "C-1001", name: "Acme Retail", email: "buyer@acme.com", orders: 12 },
  { id: "C-1002", name: "Northwind Traders", email: "sales@northwind.com", orders: 8 },
  { id: "C-1003", name: "Contoso", email: "contact@contoso.com", orders: 5 },
];

export default function CustomersTable() {
  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoCustomers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.orders}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}