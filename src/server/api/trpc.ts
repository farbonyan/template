import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";

import { ZodError } from "~/lib/zod";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { generateUUID } from "~/utils/uuid";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  const traceId = generateUUID();

  return {
    traceId,
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        cause: error.cause,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !(ctx.session.user as object | undefined)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
