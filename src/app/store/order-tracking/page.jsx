"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import orders from "@/lib/data/orders.json";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  FileText,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fromQuery = searchParams.get("orderId");
    if (fromQuery) {
      setOrderId(fromQuery);
      const found = orders.find((o) => o.id === fromQuery);
      if (found) setOrder(found);
    }
  }, [searchParams]);

  const timeline = useMemo(() => order?.timeline ?? [], [order]);
  const activity = useMemo(() => order?.activity ?? [], [order]);

  const statusIcon = (type) => {
    switch (type) {
      case "delivered":
        return <CheckCircle2 className="size-5 text-emerald-600" />;
      case "pickup":
      case "way":
        return <Truck className="size-5 text-orange-600" />;
      case "hub":
        return <Package className="size-5 text-sky-600" />;
      case "verified":
        return <ShieldCheck className="size-5 text-blue-600" />;
      case "confirmed":
      default:
        return <Clock className="size-5 text-gray-500" />;
    }
  };

  const goInvoice = () => {
    if (order) router.push(`/store/invoice/${order.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Breadcrumb
        className="mb-6"
        // items={[
        //   { label: "Home", href: "/" },
        //   { label: "Store", href: "/store" },
        //   { label: "Order Tracking", href: "/store/order-tracking" },
        // ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Order ID: {order?.id ?? (orderId || "—")}
        </h1>
        {order && (
          <Button
            onClick={goInvoice}
            variant="outline"
            className="border-2 hover:text-black"
          >
            <FileText className="mr-2 size-4" /> INVOICE
          </Button>
        )}
      </div>

      {!order && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const found = orders.find((o) => o.id === orderId.trim());
                if (found) setOrder(found);
              }}
              className="flex gap-3"
            >
              <input
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 rounded-md border px-3 py-2"
                required
              />
              <Button type="submit">Track Order</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {order && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              Order date:{" "}
              <span className="text-foreground font-medium">
                {order.orderDate}
              </span>
            </div>
            <div>
              Estimated delivery:{" "}
              <span className="text-foreground font-medium">
                {order.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Horizontal timeline */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <div className="absolute left-0 right-0 top-4 h-[2px] bg-muted" />
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`size-8 rounded-full border-2 bg-background flex items-center justify-center ${
                          step.completed
                            ? "border-emerald-600"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="size-5 text-emerald-600" />
                        ) : (
                          <Clock className="size-5 text-gray-400" />
                        )}
                      </div>
                      <div className="mt-3 font-medium">{step.label}</div>
                      <div className="text-muted-foreground text-sm">
                        {step.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Order Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5">{statusIcon(evt.type)}</div>
                  <div className="flex-1">
                    <div className="text-foreground">{evt.text}</div>
                    <div className="text-muted-foreground text-sm">
                      {evt.date} at {evt.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
