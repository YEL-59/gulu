"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/context/store";
import { LoadingProvider } from "@/context/loading";

export function Providers({ children, session }) {
  // Create QueryClient instance that persists across re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <StoreProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "#22c55e",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
          </StoreProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
