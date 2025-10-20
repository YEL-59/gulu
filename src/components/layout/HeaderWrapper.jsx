"use client";

import { usePathname } from "next/navigation";

export default function HeaderWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/reseller") ||
    pathname?.startsWith("/wholesaler");

  // Don't render children (StoreHeader) if we're on an auth page
  if (isAuthPage) {
    return null;
  }

  // Otherwise, render the StoreHeader
  return <>{children}</>;
}
