import type { Formats } from "next-intl";

export const formats: Partial<Formats> = {
  dateTime: {
    date: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    hm: {
      hour: "2-digit",
      minute: "2-digit",
    },
  },
};
