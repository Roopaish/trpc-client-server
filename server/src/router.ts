import { observable } from "@trpc/server/observable";
import * as z from "zod";
import { ee } from "./common";
import { protectedProcedure, t } from "./trpc";

// .input((input: { name: string }) => {
//   if (typeof input.name === "string") return input;
//   else throw new Error("Invalid Type");
// })

export const appRouter = t.router({
  hello: t.procedure
    .input(
      z.object({
        name: z.string().min(5, "minimum of 5 characters required"),
      })
    )
    .query(({ input, ctx }) => {
      ee.emit("msg", input.name);
      return `Hello ${input}`;
    }),
  getPrivateMsg: protectedProcedure.query(({ ctx }) => {
    return ctx.user.id;
  }),
  onHello: t.procedure.subscription(() => {
    return observable<string>(({ next }) => {
      ee.on("msg", (msg) => next(msg));

      return () => {
        ee.off("msg", (msg) => next(msg));
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
