import { z } from "~/lib/zod";
import { formSchema } from "./form";

export const templateSchema = z.object({
  icon: z.string().min(1),
  main: formSchema,
  children: formSchema.array().optional(),
});

export type TemplateSchema = z.infer<typeof templateSchema>;
