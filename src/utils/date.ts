// import arabicCalendar from "react-date-object/calendars/arabic";
import gregoryCalendar from "react-date-object/calendars/gregorian";
// import indianCalendar from "react-date-object/calendars/indian";
import persianCalendar from "react-date-object/calendars/persian";
// import arabicArLocale from "react-date-object/locales/arabic_ar";
import arabicEnLocale from "react-date-object/locales/arabic_en";
import arabicFaLocale from "react-date-object/locales/arabic_fa";
// import arabicHiLocale from "react-date-object/locales/arabic_hi";
// import gregoryArLocale from "react-date-object/locales/gregorian_ar";
import gregoryEnLocale from "react-date-object/locales/gregorian_en";
import gregoryFaLocale from "react-date-object/locales/gregorian_fa";
// import gregoryHiLocale from "react-date-object/locales/gregorian_hi";
// import indianArLocale from "react-date-object/locales/indian_ar";
import indianEnLocale from "react-date-object/locales/indian_en";
import indianFaLocale from "react-date-object/locales/indian_fa";
// import indianHiLocale from "react-date-object/locales/indian_hi";
// import persianArLocale from "react-date-object/locales/persian_ar";
import persianEnLocale from "react-date-object/locales/persian_en";
import persianFaLocale from "react-date-object/locales/persian_fa";

// import persianHiLocale from "react-date-object/locales/persian_hi";

/** Map of all calendars */
export const calendars = {
  // arabic: arabicCalendar,
  gregory: gregoryCalendar,
  // indian: indianCalendar,
  persian: persianCalendar,
};

/** Calendars that are supported */
export type TCalendar = keyof typeof calendars;

/** Map of all locales */
export const locales = {
  // ar: {
  //   arabic: arabicArLocale,
  //   gregory: gregoryArLocale,
  //   indian: indianArLocale,
  //   persian: persianArLocale,
  // },
  en: {
    arabic: arabicEnLocale,
    gregory: gregoryEnLocale,
    indian: indianEnLocale,
    persian: persianEnLocale,
  },
  // hi: {
  //   arabic: arabicHiLocale,
  //   gregory: gregoryHiLocale,
  //   indian: indianHiLocale,
  //   persian: persianHiLocale,
  // },
  fa: {
    arabic: arabicFaLocale,
    gregory: gregoryFaLocale,
    indian: indianFaLocale,
    persian: persianFaLocale,
  },
};

/** Default calendar for each locale */
export const localeDefaultCalendar = {
  // ar: "arabic",
  // hi: "indian",
  fa: "persian",
  en: "gregory",
} as const;

/**
 * Get default calendar for locale
 *
 * @param locale Locale
 * @returns Default calendar of that locale
 */
export const getLocaleDefaultCalendar = (locale: string) => {
  switch (locale) {
    // case "ar":
    //   return "arabic";
    // case "hi":
    //   return "indian";
    case "fa":
      return "persian";
    default:
      return "gregory";
  }
};

/**
 * Get calendar and locale object by keys
 *
 * @param locale Locale
 * @param calendar Calendar
 * @returns Locale and calendar objects
 */
export const getCalendarAndLocale = (locale: string, calendar?: TCalendar) => {
  if (locale in localeDefaultCalendar) {
    const existedLocale = locale as keyof typeof localeDefaultCalendar;
    const _calendar = calendar ?? localeDefaultCalendar[existedLocale];
    return {
      locale: locales[existedLocale][_calendar],
      calendar: calendars[_calendar],
    };
  }
  return { locale: locales.en.gregory, calendar: calendars.gregory };
};

/**
 * Parse date to an Date object without timezone selected
 *
 * @param date Given date
 */
export const getUTCDateWithoutTimezone = (date: Date) => {
  const localDate = new Date(date);

  // Calculate the timezone offset in minutes and convert it to milliseconds
  const timezoneOffset = localDate.getTimezoneOffset() * 60000;

  // Create a new Date object that represents the same local time, but in UTC (offset 0)
  const utcDate = new Date(localDate.getTime() - timezoneOffset);

  return utcDate;
};

export { DateObject } from "react-multi-date-picker";

export const defaultMinDate = new Date(1921, 2, 21);

export const defaultMaxDate = new Date(2072, 2, 19);
