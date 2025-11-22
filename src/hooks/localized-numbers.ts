import * as React from "react";
import { useFormatter } from "next-intl";

/**
 * Get localized number array
 *
 * @returns Localized number array
 */
export const useLocalizedNumbers = () => {
  const formatter = useFormatter();

  return React.useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => formatter.number(i));
  }, [formatter]);
};
