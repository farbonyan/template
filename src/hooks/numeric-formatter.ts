import * as React from "react";
import { useFormatter } from "next-intl";

/**
 * Default formatter, gets a number value and parse it to a localized string
 * This formatter parse numeric strings to localized numbers
 *
 * @returns Number formatter
 */
export const useNumericFormatter = () => {
  const formatter = useFormatter();

  const numberFormatter = React.useCallback(
    (value: string | undefined | null) => {
      return (
        value
          ?.split("")
          .map((ch) => {
            const n = Number.parseInt(ch);
            return Number.isNaN(n) ? ch : formatter.number(n);
          })
          .join("") ?? ""
      );
    },
    [formatter],
  );

  return numberFormatter;
};
