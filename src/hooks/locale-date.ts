import * as React from "react";
import { useLocale, useNow } from "next-intl";

import { DateObject, getCalendarAndLocale } from "~/utils/date";

export const useLocaleDate = (date?: Date) => {
  const now = useNow();
  const locale = useLocale();
  const calendarAndLocale = React.useMemo(() => {
    return getCalendarAndLocale(locale);
  }, [locale]);

  return new DateObject({ date: date ?? now, ...calendarAndLocale });
};
