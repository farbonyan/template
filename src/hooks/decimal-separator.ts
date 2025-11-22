import * as React from "react";
import { useFormatter } from "next-intl";

/**
 * Get localized decimal separator
 *
 * @returns Localized decimal separator
 */
export const useDecimalSeparator = () => {
  const formatter = useFormatter();

  return React.useMemo(() => {
    return formatter.number(1.1, { compactDisplay: "short" })[1]!;
  }, [formatter]);
};
