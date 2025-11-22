import * as React from "react";

import { useDebounce } from "./debounce";

/**
 * React hook to get current amount of a value after a delay of the changed
 *
 * @param value Value to get after the delay
 * @param ms Delay in millisecond
 * @returns Delayed value
 */
export const useDebounceValue = <T>(value: T, ms = 0): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useDebounce(() => setDebouncedValue(value), ms, [value]);

  return debouncedValue;
};
