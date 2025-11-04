"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Store,
  Users,
  LineChart,
  LayoutDashboard,
  ArrowUpDown,
  Wallet,
  ShoppingCart,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

function getNavItems() {
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: "/reseller/dashboard" },
    { label: "Analytics", icon: LineChart, href: "/reseller/dashboard/analytics" },
    { label: "Store", icon: Store, href: "/reseller/dashboard/store" },
    { label: "Customers", icon: Users, href: "/reseller/dashboard/customers" },
    { label: "Transaction", icon: ArrowUpDown, href: "/reseller/dashboard/transactions" },
    { label: "Purchases", icon: ShoppingCart, href: "/reseller/dashboard/purchases" },
    { label: "Withdrawals", icon: Wallet, href: "/reseller/dashboard/withdrawals" },
  ];
}

export default function DashboardSidebar({ base }) {
  const segments = useSelectedLayoutSegments();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const currentTopSegment = segments?.[0] || ""; // under /reseller/dashboard, this is "", "analytics", "store", etc.
  const navItems = getNavItems();

  return (
    <aside className="w-full h-full bg-white">
      <nav className="px-4 py-6 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          // Derive the first segment after /reseller/dashboard
          let itemTopSegment = "";
          if (href === "/reseller/dashboard") {
            itemTopSegment = "";
          } else if (href.startsWith("/reseller/dashboard/")) {
            itemTopSegment = href.split("/")[3] || "";
          }
          // Avoid hydration mismatches by only computing active after mount
          const active = mounted && currentTopSegment === itemTopSegment;
          return (
            <SidebarNavItem
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={active}
            />
          );
        })}
      </nav>
    </aside>
  );
}
