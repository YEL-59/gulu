"use client";

import { useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import WholesalerDashboardSidebar from "./DashboardSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function WholesalerDashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 shadow-lg bg-white"
        >
          <Menu className="size-4" />
          <span className="text-sm">Menu</span>
        </Button>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar - Fixed on the left */}
        <aside className="hidden lg:block w-64 bg-white border-r fixed h-[calc(100vh-4rem)] top-16 overflow-y-auto">
          <WholesalerDashboardSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64">
          <div className="h-full overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 py-8 lg:px-6 lg:py-8">
              <div className="pt-12 lg:pt-0">{children}</div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <WholesalerDashboardSidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
