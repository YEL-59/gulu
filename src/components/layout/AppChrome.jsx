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
    pathname?.startsWith("/reseller/dashboard");

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
