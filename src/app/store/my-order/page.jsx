"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import orders from "@/lib/data/orders.json";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

const OverviewCard = ({ icon: Icon, label, value, bg, fg }) => (
  <Card className={`flex items-center gap-3 p-4 ${bg}`}>
    <div className={`size-9 flex items-center justify-center rounded-md ${fg}`}>
      <Icon className="size-5" />
    </div>
    <div>
      <div className="text-xl font-semibold leading-tight">{value}</div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  </Card>
);

const MyOrder = () => {
  const router = useRouter();

  const totals = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const handleTrack = (id) => {
    router.push(`/store/order-tracking?orderId=${id}`);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Breadcrumb className="mb-6" />
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          icon={Package}
          label="Total Orders"
          value={totals.total}
          bg="bg-blue-50"
          fg="bg-blue-100 text-blue-700"
        />
        <OverviewCard
          icon={Clock}
          label="Pending Orders"
          value={totals.pending}
          bg="bg-orange-50"
          fg="bg-orange-100 text-orange-700"
        />
        <OverviewCard
          icon={CheckCircle2}
          label="Completed Orders"
          value={totals.completed}
          bg="bg-emerald-50"
          fg="bg-emerald-100 text-emerald-700"
        />
        <OverviewCard
          icon={XCircle}
          label="Cancelled Orders"
          value={totals.cancelled}
          bg="bg-rose-50"
          fg="bg-rose-100 text-rose-700"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Products</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const item = order.items[0];
              const total = (item.price * item.quantity).toFixed(2);
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={52}
                        height={52}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground text-xs">
                          Order ID: {order.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">
                        $90
                      </span>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${total}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleTrack(order.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      TRACK ORDER
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default MyOrder;
