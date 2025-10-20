"use client";

import orders from "@/lib/data/orders.json";
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Barcode } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function InvoicePage({ params }) {
  // Next.js 15: params is a Promise, unwrap with React.use()
  const { id } = React.use(params);
  const order = useMemo(() => orders.find((o) => o.id === id), [id]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Invoice</h1>
          <p className="text-muted-foreground mt-2">
            No order found for ID {id}.
          </p>
        </div>
      </div>
    );
  }

  const items = order.items ?? [];
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-10">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Store", href: "/store" },
          { label: "Order Tracking", href: "/store/order-tracking" },
          { label: "Invoice", href: `/store/invoice/${id}` },
        ]}
      />
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">INVOICE</h1>
          <div className="flex items-center gap-2 text-sm">
            <Barcode className="size-5" />{" "}
            <span className="font-medium">{id}</span>
          </div>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">Adam smith</div>
              <div className="text-muted-foreground">123 Main Street</div>
              <div className="text-muted-foreground">Austin, TX 78702</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">Express Express</div>
              <div className="text-muted-foreground">+1 (555) 123-4567</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Order Date</div>
              <div className="font-medium">{order.orderDate}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Order ID</div>
              <div className="font-medium">{order.id}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-6 gap-2 text-[13px] font-medium border-b pb-2">
              <div className="col-span-2">Description</div>
              <div>Price</div>
              <div>Qty</div>
              <div>Subtotal</div>
              <div>Tax</div>
            </div>
            <div className="divide-y">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-6 gap-2 py-2 text-[13px]"
                >
                  <div className="col-span-2">{it.name}</div>
                  <div>${it.price.toFixed(2)}</div>
                  <div>{it.quantity}</div>
                  <div>${(it.price * it.quantity).toFixed(2)}</div>
                  <div>—</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end text-sm">
            <div className="w-48 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">TOTAL</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Note: This is a system-generated invoice. All amounts are shown in
            USD.
          </div>
        </Card>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => window.print()} variant="outline">
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
