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
import SidebarNavItem from './SidebarNavItem'

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/wholesaler/dashboard" },
  {
    label: "Analytics",
    icon: LineChart,
    href: "/wholesaler/dashboard/analytics",
  },
  { label: "Store", icon: Store, href: "/wholesaler/store" },
  { label: "Customers", icon: Users, href: "/wholesaler/customers" },
  {
    label: "Transactions",
    icon: ShoppingCart,
    href: "/wholesaler/transactions",
  },
];

export default function DashboardSidebar({ base = "wholesaler" }) {
  const pathname = usePathname();
  const items = navItems.map((i) => ({
    ...i,
    href: i.href.replace("/wholesaler", `/${base}`),
  }));

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
        {items.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          const variant = label === 'Analytics' ? 'analytics' : 'default'
          return (
            <SidebarNavItem key={href} href={href} label={label} icon={Icon} active={active} variant={variant} />
          );
        })}
      </nav>
    </aside>
  );
}
