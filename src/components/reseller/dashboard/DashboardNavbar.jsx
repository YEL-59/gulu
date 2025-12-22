"use client";

import { useState, useEffect } from "react";
import { Search, User, LogOut, ShoppingBag } from "lucide-react";
import { useSignOut } from "@/hooks/auth.hook";

export default function DashboardNavbar() {
  const [user, setUser] = useState(null);
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUser();

    // Listen for auth changes
    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
  }, []);

  // Get user's full name or fallback
  const userName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User"
    : "User";

  const handleLogout = () => {
    signOut();
  };

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
            <span className="text-sm font-semibold">{userName}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />

          <div className="hidden md:flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">{userName}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isSigningOut}
            className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">
              {isSigningOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
