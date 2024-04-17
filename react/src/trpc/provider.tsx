import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import { type AppRouter } from "../../../server/src/router";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        wsLink({
          client: createWSClient({
            url: "ws://localhost:3001",
          }),
        }),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: wsLink({
            client: createWSClient({
              url: "ws://localhost:3001",
            }),
          }),
          false: httpBatchLink({
            url: "http://localhost:3000/trpc",
          }),
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
