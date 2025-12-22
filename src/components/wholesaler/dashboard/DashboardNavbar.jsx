"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, LogOut, ShoppingBag, Settings, HelpCircle, Bell, Package, Store } from "lucide-react";
import { useSignOut } from "@/hooks/auth.hook";
import { axiosPrivate } from "@/lib/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DashboardNavbar() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  // Load user data from localStorage and fetch profile on mount
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

    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get("/me");
        if (response.data?.success && response.data?.data?.profile) {
          setUserProfile(response.data.data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    loadUser();
    fetchProfile();

    // Listen for auth changes
    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
  }, []);

  // Get user's display name
  const userName = userProfile?.display_name || userProfile?.full_name ||
    (user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "") ||
    userProfile?.username || "User";

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userName || userName === "User") return "U";
    return userName.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-white flex items-center shadow-sm">
      <div className="w-full px-6 flex items-center justify-between">
        {/* Left: Wobuy branding with user info */}
        <div className="flex items-center gap-4">
          <Link href="/wholesaler/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">Wobuy</span>
          </Link>
          <div className="hidden lg:flex flex-col ml-6">
            <span className="text-xs text-gray-500">Welcome back!</span>
            <span className="text-sm font-semibold">{userName}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {/* <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Search className="w-5 h-5" />
          </Button> */}

          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button> */}

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-orange-200">
                  <AvatarImage
                    src={userProfile?.profile_image}
                    alt={userName}
                  />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.email || user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/wholesaler/dashboard" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wholesaler/dashboard/products" className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  My Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wholesaler/dashboard/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wholesaler/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/store/customer-support" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isSigningOut}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isSigningOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

