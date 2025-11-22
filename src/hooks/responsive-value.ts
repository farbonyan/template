import { useResponsive } from "./responsive";

export type ResponsiveValues<T> = {
  xs: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
};

/**
 * Get a value based on window size
 *
 * @param values Values that will be returned on certain sizes
 * @returns Value based on values and window size
 */
export const useResponsiveValue = <T>(values: ResponsiveValues<T>) => {
  const { isSmUp, isMdUp, isLgUp, isXlUp, is2xlUp } = useResponsive();
  if (is2xlUp && typeof values["2xl"] !== "undefined") return values["2xl"];
  if (isXlUp && typeof values.xl !== "undefined") return values.xl;
  if (isLgUp && typeof values.lg !== "undefined") return values.lg;
  if (isMdUp && typeof values.md !== "undefined") return values.md;
  if (isSmUp && typeof values.sm !== "undefined") return values.sm;
  return values.xs;
};
