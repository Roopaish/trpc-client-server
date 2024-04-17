import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "../../server/src/router";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>Client</div>
  <button id="btn">Say hello</button>
`;

const client = createTRPCProxyClient<AppRouter>({
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

const btn = document.getElementById("btn");

btn?.addEventListener("click", greet);

async function greet() {
  const res = await client.hello.query({ name: "hello" });
  console.log(res);

  client.onHello.subscribe(undefined, {
    onData: (data) => {
      console.log("WS: ", data);
    },
  });
}

greet();
