"use client";

import { useMemo, useState, useEffect, useRef } from "react";
// Use plain img to avoid Next/Image errors for missing local assets
import ordersJson from "@/lib/data/orders.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, Trash2, ChevronUp, ChevronDown, ShoppingCart, ExternalLink } from "lucide-react";
import resellerPurchasesData from "@/lib/data/resellerPurchases.json";

// Load purchases from localStorage or use default data
function loadResellerPurchases() {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resellerPurchases');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed : resellerPurchasesData;
      }
    }
  } catch (e) {
    console.warn('Error loading purchases:', e);
  }
  return resellerPurchasesData;
}

const customerNames = [
  "Leslie Alexander",
  "Courtney Henry",
  "Cameron Williamson",
  "Brooklyn Simmons",
  "Kathryn Murphy",
  "Theresa Webb",
  "Devon Lane",
  "Eleanor Pena",
  "Guy Hawkins",
  "Kristin Watson",
];

function paymentFromStatus(status) {
  switch (status) {
    case "cancelled":
      return "Refunded";
    case "pending":
      return "Pending";
    default:
      return "Paid";
  }
}

function priceOf(order) {
  const item = order?.items?.[0];
  if (!item) return 0;
  return Number(item.price) * Number(item.quantity ?? 1);
}

function asDate(order) {
  // orders.json uses human readable dates; parse safely.
  const d = Date.parse(order.orderDate);
  return isNaN(d) ? 0 : d;
}

export default function OrdersTable({ orders = [] }) {
  const [mounted, setMounted] = useState(false);
  const [resellerPurchases, setResellerPurchases] = useState(resellerPurchasesData);
  const prevDataRef = useRef({ orders: null, purchases: null });

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setResellerPurchases(loadResellerPurchases());
    
    // Update purchases periodically
    const interval = setInterval(() => {
      setResellerPurchases(loadResellerPurchases());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [rows, setRows] = useState(() => {
    // Initialize with default data (no localStorage)
    const base = orders && orders.length > 0 ? orders : ordersJson;
    return base.map((o, idx) => ({
      ...o,
      customer: o.customer ?? customerNames[idx % customerNames.length],
      payment: o.payment ?? paymentFromStatus(o.status),
      hasPendingPurchase: false,
      pendingPurchase: null,
    }));
  });
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc"); // asc | desc
  const [viewing, setViewing] = useState(null);

  // Update rows when resellerPurchases changes (after localStorage loads)
  useEffect(() => {
    if (!mounted) return;

    // Check if data actually changed to prevent infinite loops
    const ordersKey = JSON.stringify(orders);
    const purchasesKey = JSON.stringify(resellerPurchases);
    
    if (
      prevDataRef.current.orders === ordersKey &&
      prevDataRef.current.purchases === purchasesKey
    ) {
      return; // Data hasn't changed, skip update
    }

    // Update ref
    prevDataRef.current.orders = ordersKey;
    prevDataRef.current.purchases = purchasesKey;

    const base = orders && orders.length > 0 ? orders : ordersJson;
    const updatedRows = base.map((o, idx) => {
      const pendingPurchase = resellerPurchases.find(
        (p) => p.orderId === o.id && p.status === "pending"
      );
      return {
        ...o,
        customer: o.customer ?? customerNames[idx % customerNames.length],
        payment: o.payment ?? paymentFromStatus(o.status),
        hasPendingPurchase: !!pendingPurchase,
        pendingPurchase: pendingPurchase || null,
      };
    });
    setRows(updatedRows);
  }, [mounted, resellerPurchases, orders]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "order":
          return (a.id > b.id ? 1 : -1) * dir;
        case "customer":
          return String(a.customer).localeCompare(String(b.customer)) * dir;
        case "price": {
          const pa = priceOf(a);
          const pb = priceOf(b);
          return (pa - pb) * dir;
        }
        case "payment":
          return String(a.payment).localeCompare(String(b.payment)) * dir;
        case "status":
          return String(a.status).localeCompare(String(b.status)) * dir;
        case "date":
        default: {
          const da = asDate(a);
          const db = asDate(b);
          return (da - db) * dir;
        }
      }
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const removeOrder = (id) => {
    setRows((prev) => prev.filter((o) => o.id !== id));
  };

  const SortIcon = ({ active }) =>
    sortDir === "asc" ? (
      <ChevronUp
        className={`inline size-4 ${active ? "opacity-100" : "opacity-40"}`}
      />
    ) : (
      <ChevronDown
        className={`inline size-4 ${active ? "opacity-100" : "opacity-40"}`}
      />
    );

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="h-10 px-2 text-left w-10"></th>
            <th
              className="h-10 px-2 text-left cursor-pointer"
              onClick={() => toggleSort("order")}
            >
              Order <SortIcon active={sortKey === "order"} />
            </th>
            <th
              className="h-10 px-2 text-left cursor-pointer"
              onClick={() => toggleSort("customer")}
            >
              Customer <SortIcon active={sortKey === "customer"} />
            </th>
            <th
              className="h-10 px-2 text-left cursor-pointer"
              onClick={() => toggleSort("price")}
            >
              Price <SortIcon active={sortKey === "price"} />
            </th>
            <th
              className="h-10 px-2 text-left cursor-pointer"
              onClick={() => toggleSort("date")}
            >
              Date <SortIcon active={sortKey === "date"} />
            </th>
            <th
              className="h-10 px-2 text-left cursor-pointer"
              onClick={() => toggleSort("payment")}
            >
              Payment <SortIcon active={sortKey === "payment"} />
            </th>
            <th
              className="h-10 px-2 text-left cursor-pointer"
              onClick={() => toggleSort("status")}
            >
              Status <SortIcon active={sortKey === "status"} />
            </th>
            <th className="h-10 px-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((o) => {
            const item = o.items?.[0];
            const total = priceOf(o);
            return (
              <tr key={o.id} className="border-b hover:bg-muted/50">
                <td className="p-2 align-middle">
                  <input
                    type="checkbox"
                    className="size-4"
                    aria-label={`Select order ${o.id}`}
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.name ?? "Product"}
                        width={28}
                        height={28}
                        className="rounded"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/home/girl.png";
                        }}
                      />
                    ) : (
                      <div className="size-7 rounded bg-muted" />
                    )}
                    <div>
                      <div className="font-medium leading-tight">
                        <span className="text-xs text-muted-foreground">#</span>
                        {o.id}
                      </div>
                      <div className="text-muted-foreground text-xs truncate max-w-[220px]">
                        {item?.name ?? "Product"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-2">{o.customer}</td>
                <td className="p-2">${total.toFixed(2)}</td>
                <td className="p-2">{o.orderDate}</td>
                <td className="p-2">
                  {o.payment === "Paid" && (
                    <Badge
                      className="bg-emerald-100 text-emerald-700"
                      variant="secondary"
                    >
                      Paid
                    </Badge>
                  )}
                  {o.payment === "Pending" && (
                    <Badge
                      className="bg-orange-100 text-orange-700"
                      variant="secondary"
                    >
                      Pending
                    </Badge>
                  )}
                  {o.payment === "Refunded" && (
                    <Badge
                      className="bg-rose-100 text-rose-700"
                      variant="secondary"
                    >
                      Refunded
                    </Badge>
                  )}
                </td>
                <td className="p-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {o.status}
                  </Badge>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    {o.hasPendingPurchase && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        onClick={() => window.location.href = "/reseller/dashboard/purchases"}
                        title="Purchase from wholesaler required"
                      >
                        <ShoppingCart className="size-3 mr-1" />
                        Purchase
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="View"
                      onClick={() => setViewing(o)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => removeOrder(o.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td className="p-3 text-center text-gray-600" colSpan={8}>
                No orders.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="max-w-lg">
          {viewing && (
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle>Order #{viewing.id}</DialogTitle>
                <DialogDescription>
                  {viewing.orderDate} •{" "}
                  <span className="capitalize">{viewing.status}</span>
                  {viewing.hasPendingPurchase && (
                    <span className="block mt-2 text-orange-600 font-medium">
                      ⚠️ Purchase from wholesaler required
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              {viewing.hasPendingPurchase && viewing.pendingPurchase && (
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <ShoppingCart className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">
                        Purchase Required
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        You need to purchase this product from the wholesaler to fulfill this order.
                        Cost: ${(viewing.pendingPurchase.wholesalerPrice * viewing.pendingPurchase.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-orange-600 border-orange-300"
                        onClick={() => {
                          window.location.href = "/reseller/dashboard/purchases";
                        }}
                      >
                        Purchase Now <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {viewing.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.name}
                        width={44}
                        height={44}
                        className="rounded"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/home/girl.png";
                        }}
                      />
                    ) : (
                      <div className="size-11 rounded bg-muted" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-muted-foreground text-sm">
                        ${Number(it.price).toFixed(2)} × {it.quantity} = $
                        {(Number(it.price) * Number(it.quantity)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
