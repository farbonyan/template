import bcrypt from "bcrypt";

import { z } from "~/lib/zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      select: {
        id: true,
        avatarId: true,
        name: true,
        username: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }),
  dropdown: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }),
  single: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findUnique({
        select: {
          id: true,
          name: true,
          username: true,
          position: true,
          avatar: { select: { id: true, name: true, path: true } },
        },
        where: {
          id: input,
          deletedAt: null,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        avatar: z.object({ id: z.string().uuid() }).nullish(),
        name: z.string().trim().min(1),
        username: z.string().trim().min(1),
        position: z.string().trim().min(1),
        password: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const salt = await bcrypt.genSalt(10);
      return await ctx.db.user.create({
        select: { id: true },
        data: {
          avatarId: input.avatar?.id,
          name: input.name,
          username: input.username,
          position: input.position,
          password: await bcrypt.hash(input.password, salt),
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        avatar: z.object({ id: z.string().uuid() }).nullish(),
        name: z.string().trim().min(1).optional(),
        position: z.string().trim().min(1).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        select: { id: true },
        where: { id: input.id },
        data: {
          avatarId: input.avatar?.id,
          name: input.name,
          position: input.position,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.user.update({
        select: { id: true },
        where: { id: input },
        data: { deletedAt: new Date() },
      });
    }),
});
