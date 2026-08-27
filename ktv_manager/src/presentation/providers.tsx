"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState, type ReactNode, useEffect } from "react";
import { useAuthStore } from "@/shared/stores/use-auth-store";

function AuthSync() {
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const handler = () => clearUser();
    window.addEventListener("auth-logout", handler);
    return () => window.removeEventListener("auth-logout", handler);
  }, [clearUser]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthSync />
        {children}
        <Toaster position="top-right" richColors closeButton />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
