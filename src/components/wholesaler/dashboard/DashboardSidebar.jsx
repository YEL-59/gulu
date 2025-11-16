"use client";

import { usePathname } from "next/navigation";
import {
  Store,
  Users,
  LineChart,
  LayoutDashboard,
  ArrowUpDown,
  Package,
  ShoppingBag,
  Eye,
  Truck,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

function getNavItems() {
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: "/wholesaler/dashboard" },
    { label: "Analytics", icon: LineChart, href: "/wholesaler/dashboard/analytics" },
    { label: "Store", icon: Store, href: "/wholesaler/dashboard/store" },
    { label: "Dropshipping", icon: Truck, href: "/wholesaler/dashboard/dropshipping" },
    { label: "Product Tracking", icon: Eye, href: "/wholesaler/dashboard/product-tracking" },
    { label: "Reseller Orders", icon: ShoppingBag, href: "/wholesaler/dashboard/orders" },
    { label: "Resellers", icon: Users, href: "/wholesaler/dashboard/resellers" },
    { label: "Transactions", icon: ArrowUpDown, href: "/wholesaler/dashboard/transactions" },
    { label: "Withdrawals", icon: Package, href: "/wholesaler/dashboard/withdrawals" },
  ];
}

export default function WholesalerDashboardSidebar() {
  const pathname = usePathname();
  const navItems = getNavItems();

  return (
    <aside className="w-full h-full bg-white">
      <nav className="px-4 py-6 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          // Check if current pathname matches the href exactly
          // For dashboard, only match exact path
          // For other routes, match exact or if pathname starts with href + "/"
          let isActive = false;
          if (href === "/wholesaler/dashboard") {
            isActive = pathname === href;
          } else {
            isActive = pathname === href || (pathname?.startsWith(href + "/"));
          }
          return (
            <SidebarNavItem
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={isActive}
            />
          );
        })}
      </nav>
    </aside>
  );
}

