"use client";

import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/context/store";
import { LoadingProvider } from "@/context/loading";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <LoadingProvider>
        <StoreProvider>{children}</StoreProvider>
      </LoadingProvider>
    </SessionProvider>
  );
}
