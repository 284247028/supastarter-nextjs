import { TRPCError, initTRPC } from "@trpc/server";
import { UserRoleSchema } from "database";
import superjson from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthenticatedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session!,
    },
  });
});

const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (ctx.user.role !== UserRoleSchema.Values.ADMIN)
    throw new TRPCError({ code: "FORBIDDEN" });

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session!,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticatedMiddleware);
export const adminProcedure = t.procedure.use(isAdminMiddleware);
