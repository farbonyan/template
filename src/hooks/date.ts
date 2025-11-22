import moment from "moment-jalaali";
import { useLocale } from "next-intl";

import { DateObject, getCalendarAndLocale } from "~/utils/date";

/**
 * Get localized date object of now
 *
 * @returns Now date in date object
 */
export const useDate = () => {
  const locale = useLocale();
  const calendarAndLocale = getCalendarAndLocale(locale);
  return new DateObject(calendarAndLocale);
};

/**
 * Get first day of month date
 */
export const useFirstDayOfMonth = () => {
  const now = useDate();
  return moment(now.toFirstOfMonth().toDate()).startOf("day").toDate();
};

/**
 * Get last day of month date
 */
export const useLastDayOfMonth = () => {
  const now = useDate();
  return moment(now.toLastOfMonth().toDate()).startOf("day").toDate();
};

/**
 * Get first day of year date
 */
export const useFirstDayOfYear = () => {
  const now = useDate();
  return moment(now.toFirstOfYear().toDate()).startOf("day").toDate();
};

/**
 * Get last day of year date
 */
export const useLastDayOfYear = () => {
  const now = useDate();
  return moment(now.toLastOfYear().toDate()).startOf("day").toDate();
};
