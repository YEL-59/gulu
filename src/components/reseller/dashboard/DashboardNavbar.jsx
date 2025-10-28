"use client";

import { Search, User, LogOut, ShoppingBag } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-white flex items-center shadow-sm">
      <div className="w-full px-6 flex items-center justify-between">
        {/* Left: Wobuy branding with user info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">Wobuy</span>
          </div>
          <div className="hidden lg:flex flex-col ml-6">
            <span className="text-xs text-gray-500">Welcome back!</span>
            <span className="text-sm font-semibold">Adam Smith</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />

          <div className="hidden md:flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Adam Smith</span>
          </div>

          <button className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
