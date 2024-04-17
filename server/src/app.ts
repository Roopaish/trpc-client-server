import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { appRouter } from "./router";
import { createContext } from "./trpc";

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:5173" }));

// 3. Make a endpoint from where every trpc call will be handled
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
