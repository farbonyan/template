import { z } from "~/lib/zod";

export const locales = ["fa", "en"] as const;

export const localeCountryCodes = {
  fa: "IR",
  en: "US",
} as const;

export const localeSchema = z.enum(locales);

export type LocaleSchema = z.infer<typeof localeSchema>;
