import { z } from "~/lib/zod";

export const columnSchema = z
  .object({
    order: z.number(),
    name: z.string().trim().min(1),
    label: z.string().trim().min(1),
    primary: z.boolean(),
    title: z.boolean(),
    parent: z.boolean(),
    optional: z.boolean(),
    table: z.boolean(),
    hide: z.boolean(),
    grouped: z.boolean(),
    search: z.boolean(),
    form: z.boolean(),
    related: z
      .object({
        field: z.string().trim().min(1),
        value: z.string().trim().min(1),
      })
      .nullable(),
  })
  .and(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("number"),
        variant: z.enum(["int", "bigint", "float"]),
      }),
      z.object({
        type: z.literal("string"),
        variant: z.discriminatedUnion("type", [
          z.object({ type: z.literal("text") }),
          z.object({
            type: z.literal("select"),
            options: z.string().trim().min(1).array().min(1),
          }),
        ]),
      }),
      z.object({
        type: z.literal("date"),
        variant: z.enum(["date", "datetime"]),
      }),
      z.object({
        type: z.literal("boolean"),
        variant: z.enum(["checkbox", "switch"]),
      }),
      z.object({
        type: z.literal("relation"),
        target: z.object({
          table: z.string().trim().min(1),
          column: z.string().trim().min(1),
        }),
      }),
    ]),
  );

export type ColumnSchema = z.infer<typeof columnSchema>;
