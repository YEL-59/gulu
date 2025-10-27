"use client";

import { Search, Bell, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardNavbar({ period = "October" }) {
  return (
    <header className="h-16 border-b bg-primary-600 text-white flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative w-80">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full h-10 pl-10 pr-3 bg-white text-black rounded-md border-0 focus:ring-2 focus:ring-accent-500"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-white text-black">
            {period}
          </Badge>
          <Button size="sm" className="bg-[#F36E16] hover:bg-[#e06212]">
            Export
          </Button>
          <Bell className="w-5 h-5" />
          <UserCircle className="w-6 h-6" />
        </div>
      </div>
    </header>
  );
}
