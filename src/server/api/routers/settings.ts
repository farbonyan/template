import { z } from "~/lib/zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db.setting.findMany({
      where: { userId: ctx.session.user.id },
    });
    return Object.fromEntries(
      settings.map((setting) => [setting.key, JSON.parse(setting.value)]),
    );
  }),
  set: protectedProcedure
    .input(z.object({ key: z.string(), value: z.any() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.setting.upsert({
        where: { key_userId: { userId: ctx.session.user.id, key: input.key } },
        create: {
          userId: ctx.session.user.id,
          key: input.key,
          value: JSON.stringify(input.value),
        },
        update: { value: JSON.stringify(input.value) },
      });
    }),
});
