"use client";

import { usePathname } from "next/navigation";
import {
  Store,
  Users,
  LineChart,
  LayoutDashboard,
  ArrowUpDown,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

function getNavItems() {
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: "/reseller/dashboard" },
    {
      label: "Analytics",
      icon: LineChart,
      href: "/reseller/analytics",
    },
    { label: "Store", icon: Store, href: "/reseller/store" },
    { label: "Customers", icon: Users, href: "/reseller/customers" },
    { label: "Transaction", icon: ArrowUpDown, href: "/reseller/transactions" },
  ];
}

export default function DashboardSidebar({ base }) {
  const pathname = usePathname();
  const navItems = getNavItems(base);

  return (
    <aside className="w-full h-full bg-white">
      <nav className="px-4 py-6 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
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
