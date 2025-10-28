"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoreHeader from "@/components/store/StoreHeader";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import { usePathname } from "next/navigation";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith("/wholesaler/dashboard") ||
    pathname?.startsWith("/reseller/dashboard") ||
    // Treat role-specific store pages as part of the dashboard chrome
    pathname?.startsWith("/reseller/store") ||
    pathname?.startsWith("/wholesaler/store") ||
    // Customers / Transactions should also use dashboard chrome
    pathname?.startsWith("/reseller/customers") ||
    pathname?.startsWith("/reseller/transactions") ||
    pathname?.startsWith("/wholesaler/customers") ||
    pathname?.startsWith("/wholesaler/transactions");

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && (
        <>
          <Navbar />
          <HeaderWrapper>
            <StoreHeader />
          </HeaderWrapper>
        </>
      )}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  );
}