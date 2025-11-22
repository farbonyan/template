import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { templateSchema } from "../schema/template";
import { getSchema } from "../utils/schema";
import { generateTemplate } from "../utils/template";

export const templateRouter = createTRPCRouter({
  tables: protectedProcedure.query(async ({ ctx }) => {
    return await getSchema(ctx.db);
  }),
  create: protectedProcedure
    .input(templateSchema)
    .mutation(async ({ input, ctx }) => {
      const schema = await getSchema(ctx.db);
      await generateTemplate(schema, input);
      return { success: true };
    }),
});
