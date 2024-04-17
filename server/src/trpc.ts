import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

// 1. Instantiate TRPC
// const t = initTRPC.create();

// 3. Creating Context
// // Init TRPC Context
export function createContext({ req, res }: CreateExpressContextOptions) {
  return { req, session: { user: { id: 1 } } };
}

// // Instantiate TRPC with typed Context
export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create();

// 4. Middlewares
const isLoggedIn = t.middleware(({ ctx, next }) => {
  // Some logic to handle user auth
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { user: { id: 1 } } });
});

export const protectedProcedure = t.procedure.use(isLoggedIn);
