import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUniqueOrThrow({
      select: {
        id: true,
        name: true,
        username: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: ctx.session.user.id, deletedAt: null },
    });
  }),
});
