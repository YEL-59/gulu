"use client";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardShell({ children, base = "wholesaler" }) {
  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />
      <div className="flex">
        <DashboardSidebar base={base} />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
