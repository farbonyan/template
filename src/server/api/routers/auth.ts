import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

import { z } from "~/lib/zod";
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
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().optional(),
        avatar: z.object({ id: z.string().uuid() }).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        select: {
          id: true,
          name: true,
          username: true,
          position: true,
          createdAt: true,
          updatedAt: true,
          avatar: { select: { id: true } },
        },
        where: { id: ctx.session.user.id, deletedAt: null },
        data: {
          name: input.name,
          avatarId: input.avatar?.id,
        },
      });
    }),
  password: protectedProcedure
    .input(
      z
        .object({
          current: z.string().trim(),
          password: z
            .string()
            .trim()
            .regex(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
            ),
          confirm: z
            .string()
            .trim()
            .regex(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
            ),
        })
        .refine((args) => args.confirm === args.password),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findFirstOrThrow({
        select: { password: true },
        where: { id: ctx.session.user.id, deletedAt: null },
      });
      const isPasswordCorrect = await bcrypt.compare(
        input.current,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const salt = await bcrypt.genSalt(10);
      return await ctx.db.user.update({
        select: {
          id: true,
          name: true,
          username: true,
          position: true,
          createdAt: true,
          updatedAt: true,
        },
        where: { id: ctx.session.user.id, deletedAt: null },
        data: {
          password: await bcrypt.hash(input.password, salt),
        },
      });
    }),
});
