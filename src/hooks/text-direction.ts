import { useIsRtl } from "./is-rtl";

/**
 * Get the locale text direction
 *
 * @param locale Locale
 * @returns "rtl" or "ltr"
 */
export const useTextDirection = (locale?: string) => {
  const isRtl = useIsRtl(locale);
  return isRtl ? "rtl" : "ltr";
};
