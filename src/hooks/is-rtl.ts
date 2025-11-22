import * as React from "react";
import { useLocale } from "next-intl";
import { isRtlLang } from "rtl-detect";

/**
 * Get if locale is right-to-left
 *
 * @param locale Locale
 * @returns True if locale is right-to-left
 */
export const useIsRtl = (locale?: string) => {
  const defaultLocale = useLocale();
  if (!locale) locale = defaultLocale;

  return React.useMemo(() => {
    return isRtlLang(locale);
  }, [locale]);
};
