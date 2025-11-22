import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import type { LocaleSchema } from "~/utils/types";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as LocaleSchema)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      (await import(`../../messages/${locale}.json`)) as {
        default: AbstractIntlMessages;
      }
    ).default,
  };
});
