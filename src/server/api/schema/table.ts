import { z } from "~/lib/zod";

export const tableColumnSchema = z.object({
  name: z.string(),
  type: z.string(),
  optional: z.boolean(),
  description: z.string().nullable(),
  order: z.number(),
  relation: z.string().nullable(),
  primary: z.boolean(),
});

export type TableColumnSchema = z.infer<typeof tableColumnSchema>;

export const tableSchema = z.object({
  name: z.string(),
  columns: tableColumnSchema.array(),
});

export type TableSchema = z.infer<typeof tableSchema>;
