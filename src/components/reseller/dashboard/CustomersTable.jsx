"use client";

import { useMemo, useState } from "react";
import ordersJson from "@/lib/data/orders.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ChevronUp, ChevronDown, Eye, Printer, Link as LinkIcon, Pencil, Trash2, Download } from "lucide-react";

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

const contacts = [
  { email: "leslie@exmaple.com", phone: "+972-334-9044" },
  { email: "courtney@example.com", phone: "+972-334-9045" },
  { email: "cameron@example.com", phone: "+972-334-9046" },
  { email: "brooklyn@example.com", phone: "+972-334-9047" },
  { email: "kathryn@example.com", phone: "+972-334-9048" },
  { email: "theresa@example.com", phone: "+972-334-9049" },
  { email: "devon@example.com", phone: "+972-334-9050" },
  { email: "eleanor@example.com", phone: "+972-334-9051" },
  { email: "guy@example.com", phone: "+972-334-9052" },
  { email: "kristin@example.com", phone: "+972-334-9053" },
];

const addresses = [
  "2873 Wrentham Ave, Spring Area, Illinois 28456",
  "5230 Pinehurst Rd, Austin, TX 73301",
  "92 Henry St, San Diego, CA 92101",
  "3791 Meadowview Dr, Denver, CO 80202",
  "17 Parkside Ln, Miami, FL 33101",
  "40 Beacon Hill, Boston, MA 02108",
  "73 Maple Ave, Seattle, WA 98101",
  "26 Rose Ct, Phoenix, AZ 85001",
  "58 Oakwood St, Dallas, TX 75201",
  "15 Cedar Way, Portland, OR 97201",
];

function safeDate(d) {
  const ts = Date.parse(d);
  return isNaN(ts) ? 0 : ts;
}

const formatCurrency = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);

export default function CustomersTable({ orders = [] }) {
  const hydratedOrders = useMemo(() => {
    const base = orders && orders.length ? orders : ordersJson;
    return base.map((o, idx) => ({
      ...o,
      customer: o.customer ?? customerNames[idx % customerNames.length],
      contact: contacts[idx % contacts.length],
      address: addresses[idx % addresses.length],
    }));
  }, [orders]);

  const [overrides, setOverrides] = useState({}); // { [name]: { contact, address } }
  const [deletedNames, setDeletedNames] = useState(new Set());
  const aggregated = useMemo(() => {
    const map = new Map();
    hydratedOrders.forEach((o) => {
      const name = o.customer || "Unknown";
      if (deletedNames.has(name)) return;
      const prev = map.get(name) || {
        name,
        totalSpent: 0,
        orderCount: 0,
        lastOrderDate: "",
        lastOrderId: "",
        contact: o.contact,
        address: o.address,
      };
      const orderValue = Array.isArray(o.items)
        ? o.items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)
        : 0;

      const isNewer = safeDate(o.orderDate) > safeDate(prev.lastOrderDate);
      const override = overrides[name];
      map.set(name, {
        name,
        totalSpent: prev.totalSpent + orderValue,
        orderCount: prev.orderCount + 1,
        lastOrderDate: isNewer ? o.orderDate : prev.lastOrderDate,
        lastOrderId: isNewer ? o.id : prev.lastOrderId,
        contact: override?.contact ?? prev.contact,
        address: override?.address ?? prev.address,
      });
    });
    return Array.from(map.values());
  }, [hydratedOrders, overrides, deletedNames]);

  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  const rows = useMemo(() => {
    const copy = [...aggregated];
    const dir = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortKey) {
        case "totalSpent":
          return (a.totalSpent - b.totalSpent) * dir;
        case "orderCount":
          return (a.orderCount - b.orderCount) * dir;
        case "lastOrderDate":
          return (safeDate(a.lastOrderDate) - safeDate(b.lastOrderDate)) * dir;
        case "name":
        default:
          return String(a.name).localeCompare(String(b.name)) * dir;
      }
    });
    return copy;
  }, [aggregated, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const [query, setQuery] = useState("");
  const SortIcon = ({ active }) =>
    sortDir === "asc" ? (
      <ChevronUp className={`inline size-4 ${active ? "opacity-100" : "opacity-40"}`} />
    ) : (
      <ChevronDown className={`inline size-4 ${active ? "opacity-100" : "opacity-40"}`} />
    );

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((c) =>
      [
        c.name,
        c.contact?.email,
        c.contact?.phone,
        c.address,
        c.lastOrderId ? String(c.lastOrderId) : "",
        c.lastOrderDate || "",
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  // View modal state
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const openView = (c) => {
    setSelected(c);
    setViewOpen(true);
  };

  const customerOrders = useMemo(() => {
    if (!selected) return [];
    return hydratedOrders.filter((o) => (o.customer || "Unknown") === selected.name);
  }, [hydratedOrders, selected]);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", phone: "", address: "" });
  const openEdit = (c) => {
    setSelected(c);
    setEditForm({
      email: c.contact?.email || "",
      phone: c.contact?.phone || "",
      address: c.address || "",
    });
    setEditOpen(true);
  };
  const saveEdit = () => {
    if (!selected) return;
    setOverrides((prev) => ({
      ...prev,
      [selected.name]: {
        contact: { email: editForm.email, phone: editForm.phone },
        address: editForm.address,
      },
    }));
    setEditOpen(false);
  };

  // Actions
  const copyLink = async (c) => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/reseller/customers?customer=${encodeURIComponent(c.name)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_) {}
  };

  const confirmDelete = (c) => {
    const ok = typeof window !== "undefined" ? window.confirm(`Delete ${c.name}?`) : true;
    if (!ok) return;
    setDeletedNames((prev) => new Set([...prev, c.name]));
  };

  const printRow = () => {
    if (typeof window !== "undefined") window.print();
  };

  const exportCsv = (c) => {
    const orders = hydratedOrders.filter((o) => (o.customer || "Unknown") === c.name);
    const headers = ["Order ID", "Order Date", "Item", "Price", "Qty"];
    const lines = [headers.join(",")];
    orders.forEach((o) => {
      (o.items || []).forEach((it) => {
        lines.push([o.id, o.orderDate, it.name, it.price, it.quantity].join(","));
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.name}-orders.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <Input
          placeholder="Search for id, name product"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[320px]"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#F36E16] text-[#F36E16]">Filter</Button>
          <Button className="bg-[#F36E16] hover:bg-[#e06212]">Export</Button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="h-10 px-2 text-left w-10"></th>
            <th className="h-10 px-2 text-left cursor-pointer" onClick={() => toggleSort("name")}>
              Customer <SortIcon active={sortKey === "name"} />
            </th>
            <th className="h-10 px-2 text-left">Content</th>
            <th className="h-10 px-2 text-left cursor-pointer" onClick={() => toggleSort("totalSpent")}>
              Purchases <SortIcon active={sortKey === "totalSpent"} />
            </th>
            <th className="h-10 px-2 text-left cursor-pointer" onClick={() => toggleSort("orderCount")}>
              Order Qty <SortIcon active={sortKey === "orderCount"} />
            </th>
            <th className="h-10 px-2 text-left">Address</th>
            <th className="h-10 px-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((c) => (
            <tr key={c.name} className="border-b hover:bg-muted/50">
              <td className="p-2 align-middle">
                <input type="checkbox" className="size-4" aria-label={`Select ${c.name}`} />
              </td>
              <td className="p-2">
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded bg-muted" />
                  <div>
                    <a href="#" className="text-primary font-medium hover:underline">{c.lastOrderId ? `ID ${c.lastOrderId}` : "—"}</a>
                    <div className="text-sm text-muted-foreground">{c.name}</div>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <div className="leading-tight">
                  <div className="text-foreground/90 text-sm">{c.contact?.email || "—"}</div>
                  <div className="text-muted-foreground text-xs">{c.contact?.phone || "—"}</div>
                </div>
              </td>
              <td className="p-2 font-medium">{formatCurrency(c.totalSpent)}</td>
              <td className="p-2">{c.orderCount} {c.orderCount === 1 ? "order" : "orders"}</td>
              <td className="p-2">
                <div className="text-sm text-foreground/90">{c.address}</div>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" aria-label="View" onClick={() => openView(c)}><Eye className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Link" onClick={() => copyLink(c)}><LinkIcon className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openEdit(c)}><Pencil className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => confirmDelete(c)}><Trash2 className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Print" onClick={printRow}><Printer className="size-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Export" onClick={() => exportCsv(c)}><Download className="size-4" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-xl">
          {selected && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>Customer details and recent orders</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Customer ID</div>
                  <div className="font-medium">{selected.lastOrderId ? `ID ${selected.lastOrderId}` : "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Order</div>
                  <div className="font-medium">{selected.lastOrderDate || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{selected.contact?.email || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Phone</div>
                  <div className="font-medium">{selected.contact?.phone || "—"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Address</div>
                  <div className="font-medium">{selected.address || "—"}</div>
                </div>
              </div>
              <div className="border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="p-2 text-left">Order ID</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Items</th>
                      <th className="p-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((o) => {
                      const total = (o.items || []).reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
                      return (
                        <tr key={o.id} className="border-t">
                          <td className="p-2">{o.id}</td>
                          <td className="p-2">{o.orderDate}</td>
                          <td className="p-2">{(o.items || []).map((it) => it.name).join(", ")}</td>
                          <td className="p-2 font-medium">{formatCurrency(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
                <Button onClick={() => exportCsv(selected)} className="bg-[#F36E16] hover:bg-[#e06212]">Export</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update contact and address</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            <Input placeholder="Phone" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input placeholder="Address" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} className="bg-[#F36E16] hover:bg-[#e06212]">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}