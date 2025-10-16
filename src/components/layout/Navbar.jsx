"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
import { Settings, LogOut, Store, Package, BarChart3 } from "lucide-react";
import { USER_ROLES } from "@/constants/roles";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const getRoleColor = (role) => {
    switch (role) {
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
    switch (role) {
      case USER_ROLES.ADMIN:
        return "/admin";
      case USER_ROLES.WHOLESALER:
        return "/wholesaler";
      case USER_ROLES.RESELLER:
        return "/reseller";
      default:
        return "/profile";
    }
  };

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
            <Link href="/wishlist" className="relative">
              <HeartIcon className="w-6 h-6 text-white hover:text-orange-300 transition-colors" />
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                style={{ backgroundColor: "#F36E16" }}
              >
                3
              </span>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative">
              <CartIcon className="w-6 h-6 text-white hover:text-orange-300 transition-colors" />
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                style={{ backgroundColor: "#F36E16" }}
              >
                5
              </span>
            </Link>

            {/* Authentication */}
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {/* Role Badge */}
                <Badge className={getRoleColor(session.user.role)}>
                  {session.user.role}
                </Badge>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink(session.user.role)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === USER_ROLES.RESELLER && (
                      <DropdownMenuItem asChild>
                        <Link href="/my-store">
                          <Store className="mr-2 h-4 w-4" />
                          My Store
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {session.user.role === USER_ROLES.WHOLESALER && (
                      <DropdownMenuItem asChild>
                        <Link href="/my-products">
                          <Package className="mr-2 h-4 w-4" />
                          My Products
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-600 focus:text-red-600"
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
                {/* <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link> */}
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

              {session ? (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {session.user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {session.user.email}
                      </div>
                    </div>
                    <Badge
                      className={`ml-auto ${getRoleColor(session.user.role)}`}
                    >
                      {session.user.role}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link
                      href={getDashboardLink(session.user.role)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Button
                      onClick={() => {
                        signOut();
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
