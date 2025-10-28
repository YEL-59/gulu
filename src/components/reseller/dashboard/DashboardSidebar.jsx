"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Store,
  Users,
  ShoppingCart,
  LineChart,
  LayoutDashboard,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

function getNavItems(base = "reseller") {
  const prefix = base === "wholesaler" ? "/wholesaler" : "/reseller";
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: `${prefix}/dashboard` },
    { label: "Analytics", icon: LineChart, href: `${prefix}/dashboard/analytics` },
    { label: "Store", icon: Store, href: `${prefix}/store` },
    { label: "Customers", icon: Users, href: `${prefix}/customers` },
    { label: "Transactions", icon: ShoppingCart, href: `${prefix}/transactions` },
  ];
}

export default function DashboardSidebar({ base }) {
  const pathname = usePathname();
  const navItems = getNavItems(base);

  return (
    <aside className="w-64 border-r bg-white">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-bold">Wobuy</span>
        </div>
      </div>
      <nav className="px-2 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          const variant = label === "Analytics" ? "analytics" : "default";
          return (
            <SidebarNavItem
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={active}
              variant={variant}
            />
          );
        })}
      </nav>
    </aside>
  );
}
