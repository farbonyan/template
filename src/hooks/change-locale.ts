import type { LocaleSchema } from "~/utils/types";
import { usePathname, useRouter } from "~/i18n/routing";

/**
 * Get change locale function
 *
 * @returns Function to change locale
 */
export const useChangeLocale = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (locale: LocaleSchema) => router.replace(pathname, { locale });
};
