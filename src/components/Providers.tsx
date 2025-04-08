"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider refetchInterval={15 * 60}>
      <QueryClientProvider client={queryClient}>
        <SessionLoader>{children}</SessionLoader>
        <Toaster position="top-center" reverseOrder={false} />
        <ReactQueryDevtools initialIsOpen={false} position="top" />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;

export const SessionLoader = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 dark:border-gray-400 border-gray-500"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 dark:border-white border-black  animate-spin"></div>
        </div>
      </div>
    );
  }

  return children;
};
