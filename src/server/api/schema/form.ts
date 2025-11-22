import { z } from "~/lib/zod";
import { columnSchema } from "./column";

export const formSchema = z.object({
  name: z.object({
    singular: z.string().trim().min(1),
    plural: z.string().trim().min(1),
  }),
  label: z.object({
    singular: z.string().trim().min(1),
    plural: z.string().trim().min(1),
  }),
  table: z.object({
    name: z.string().trim().min(1),
    columns: columnSchema.array(),
  }),
});

export type FormSchema = z.infer<typeof formSchema>;
