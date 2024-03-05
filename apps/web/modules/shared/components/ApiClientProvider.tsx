"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";
import superjson from "superjson";
import { apiClient } from "../lib/api-client";

export function ApiClientProvider({ children }: PropsWithChildren<{}>) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    apiClient.createClient({
      links: [
        httpBatchLink({
          url: baseUrl + "/api",
          transformer: superjson,
        }),
      ],
    }),
  );
  return (
    <apiClient.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </apiClient.Provider>
  );
}
