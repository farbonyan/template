import fs from "fs";

import { z } from "~/lib/zod";
import {
  createCallerFactory,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const attachmentRouter = createTRPCRouter({
  single: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input, ctx }) => {
      return await ctx.db.attachment.findUnique({ where: { id: input } });
    }),
  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ input, ctx }) => {
      const attachment = await ctx.db.attachment.delete({
        select: { id: true, path: true },
        where: { id: input },
      });
      fs.unlinkSync(attachment.path);
      return attachment;
    }),
});

export const attachmentCallerFactory = createCallerFactory(attachmentRouter);
