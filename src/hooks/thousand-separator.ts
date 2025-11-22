import * as React from "react";
import { useFormatter } from "next-intl";

/**
 * Get localized thousand separator
 *
 * @returns Localized thousand separator
 */
export const useThousandSeparator = () => {
  const formatter = useFormatter();

  return React.useMemo(() => {
    return formatter.number(1000, { compactDisplay: "short" })[1]!;
  }, [formatter]);
};
