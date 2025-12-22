"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SvgIcon, {
  SearchIcon,
  UserIcon,
  HeartIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  TelegramIcon,
  ChevronDownIcon,
  PinterestIcon,
  LogoIcon,
} from "@/components/icons/SvgIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  LogOut,
  Store,
  Package,
  BarChart3,
  User,
  ShoppingCart,
  HeartPlusIcon,
  ClipboardCheckIcon,
  MapPin,
  KeyRound,
  LifeBuoy,
} from "lucide-react";
import { USER_ROLES } from "@/constants/roles";
import { axiosPrivate } from "@/lib/api/axios";
import { deleteCookie } from "@/lib/utils/cookies";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // User profile state
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and fetch user profile
  const checkAuthAndFetchProfile = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    // Check if token exists and is not expired
    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry, 10)) {
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);

    try {
      const response = await axiosPrivate.get("/me");
      if (response.data?.success && response.data?.data?.profile) {
        setUserProfile(response.data.data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // If we get 401, user is not authenticated
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    localStorage.removeItem("data");

    // Clear sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiry");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("data");

    // Clear cookies
    deleteCookie("token");
    deleteCookie("user");

    // Update state
    setIsAuthenticated(false);
    setUserProfile(null);

    // Dispatch auth change event
    window.dispatchEvent(new Event("auth-change"));

    // Redirect to home
    router.push("/");
  };

  useEffect(() => {
    checkAuthAndFetchProfile();

    // Listen for auth changes (login/logout from other components)
    const handleAuthChange = () => {
      checkAuthAndFetchProfile();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userProfile) return "U";
    const name = userProfile.display_name || userProfile.full_name || userProfile.username;
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Get user's stored role from localStorage
  const getUserRole = () => {
    if (typeof window === "undefined") return null;
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      return userData?.role?.toUpperCase() || null;
    } catch {
      return null;
    }
  };

  const getRoleColor = (role) => {
    const normalizedRole = role?.toUpperCase();
    switch (normalizedRole) {
      case USER_ROLES.ADMIN:
        return "bg-red-100 text-red-800";
      case USER_ROLES.WHOLESALER:
        return "bg-blue-100 text-blue-800";
      case USER_ROLES.RESELLER:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDashboardLink = (role) => {
    const normalizedRole = role?.toUpperCase();
    switch (normalizedRole) {
      case USER_ROLES.ADMIN:
        return "/admin";
      case USER_ROLES.WHOLESALER:
        return "/wholesaler/dashboard";
      case USER_ROLES.RESELLER:
        return "/reseller/dashboard";
      default:
        return "/store/account/profile";
    }
  };

  const userRole = getUserRole();

  return (
    <nav className="bg-primary-500 shadow-lg">
      {/* Top Bar with Social Icons */}
      <div className="bg-primary-500 text-white py-0 text-sm border-b border-[#3688ff]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">Follow us:</span>
              <div className="flex space-x-3">
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-pink-300 transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-blue-300 transition-colors">
                  <PinterestIcon className="w-4 h-4" />
                </a>
                <a href="#" className="hover:text-red-300 transition-colors">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                {/* <a href="#" className="hover:text-blue-300 transition-colors">
                  <TelegramIcon className="w-4 h-4" />
                </a> */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger className="w-20 h-6 text-xs  border-0 shadow-none ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD </SelectItem>
                    <SelectItem value="BDT">BDT </SelectItem>
                    <SelectItem value="EUR">EUR </SelectItem>
                    <SelectItem value="GBP">GBP </SelectItem>
                    <SelectItem value="INR">INR </SelectItem>
                    <SelectItem value="CNY">CNY </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <LogoIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Wobuy</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full h-12 pl-4 pr-12 bg-white rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-accent-500 focus:outline-none"
              />
              <button className="absolute right-2 top-2 h-8 w-8  rounded-md flex items-center justify-center transition-colors">
                <SearchIcon className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist */}
            <Link href="/store/wishlist" className="relative">
              <HeartIcon className="w-6 h-6 text-white hover:text-orange-300 transition-colors" />
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                style={{ backgroundColor: "#F36E16" }}
              >
                3
              </span>
            </Link>

            {/* Shopping Cart */}
            <Link href="/store/cart" className="relative">
              <CartIcon className="w-6 h-6 text-white hover:text-orange-300 transition-colors" />
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                style={{ backgroundColor: "#F36E16" }}
              >
                5
              </span>
            </Link>

            {/* Authentication */}
            {isLoading ? (
              <div className="animate-pulse bg-white/20 h-8 w-20 rounded"></div>
            ) : isAuthenticated && userProfile ? (
              <div className="flex items-center space-x-4">
                {userRole && (
                  <Badge className={getRoleColor(userRole)}>
                    {userRole}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userProfile.profile_image}
                          alt={userProfile.display_name || userProfile.username}
                        />
                        <AvatarFallback>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userProfile.display_name || userProfile.full_name || userProfile.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userProfile.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userRole && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.WHOLESALER || userRole === USER_ROLES.RESELLER) && (
                      <DropdownMenuItem asChild>
                        <Link href={getDashboardLink(userRole)}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/store/account/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/account/address">
                        <MapPin className="mr-2 h-4 w-4" />
                        Address
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/account/change-password">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Change Password
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/customer-support">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/wishlist">
                        <HeartPlusIcon className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/my-order">
                        <ClipboardCheckIcon className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {userRole === USER_ROLES.RESELLER && (
                      <DropdownMenuItem asChild>
                        <Link href="/reseller/dashboard">
                          <Store className="mr-2 h-4 w-4" />
                          My Store
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userRole === USER_ROLES.WHOLESALER && (
                      <DropdownMenuItem asChild>
                        <Link href="/wholesaler/dashboard">
                          <Package className="mr-2 h-4 w-4" />
                          My Products
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-white font-normal">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/products"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/stores"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stores
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>

              {isAuthenticated && userProfile ? (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={userProfile.profile_image}
                        alt={userProfile.display_name || userProfile.username}
                      />
                      <AvatarFallback>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {userProfile.display_name || userProfile.full_name || userProfile.username}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {userProfile.email}
                      </div>
                    </div>
                    {userRole && (
                      <Badge
                        className={`ml-auto ${getRoleColor(userRole)}`}
                      >
                        {userRole}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userRole && (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.WHOLESALER || userRole === USER_ROLES.RESELLER) && (
                      <Link
                        href={getDashboardLink(userRole)}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/store/account/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/store/account/address"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Address
                    </Link>
                    <Link
                      href="/store/account/change-password"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Change Password
                    </Link>
                    <Link
                      href="/store/customer-support"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Support
                    </Link>
                    <Link
                      href="/store/wishlist"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      href="/store/my-order"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600"
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200 space-y-1 px-2">
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
