import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "../../../server/src/router";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    // loggerLink(),
    // wsLink({
    //   client: createWSClient({
    //     url: "ws://localhost:3001",
    //   }),
    // }),
    // httpBatchLink({
    //   url: "http://localhost:3000/trpc",
    //   // headers: {
    //   //   Authorization: "TOKEN",
    //   // },
    // }), // End link, nothing can come after it
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
});
