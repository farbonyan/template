import { useLocale, useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useChangeLocale } from "~/hooks/change-locale";
import { locales } from "~/utils/types";

/** Switch between locales component */
export const SwitchLocales = () => {
  const t = useTranslations("pages.index.header.locales");
  const currentLocale = useLocale();
  const change = useChangeLocale();

  return (
    <div className="flex items-center justify-between gap-2">
      {locales.map((locale) => {
        return (
          <Button
            key={locale}
            variant={currentLocale === locale ? "outline" : "ghost"}
            className="w-full"
            onClick={() => change(locale)}
          >
            {t(locale)}
          </Button>
        );
      })}
    </div>
  );
};
