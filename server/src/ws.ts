import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { appRouter } from "./router";
import { createContext } from "./trpc";

const wss = new ws.Server({
  port: 3001,
});

applyWSSHandler({
  wss: wss,
  router: appRouter,
  // @ts-expect-error
  createContext: createContext,
});

wss.on("connection", (ws) => {
  console.log(`Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`Connection (${wss.clients.size})`);
  });
});
