import * as React from "react";

import { useTimeoutFn } from "./timeout-fn";

/**
 * React hook that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param fn Function that will be called
 * @param ms Delay in milliseconds
 * @param deps Dependency array
 * @returns
 *  isReady: function returning current debounce state:
 *    false - pending
 *    true - called
 *    null - cancelled
 *  cancel: Cancel the debounce
 */
export const useDebounce = (
  fn: () => void,
  ms = 0,
  deps: React.DependencyList = [],
) => {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  React.useEffect(reset, [reset, ...deps]);

  return [isReady, cancel] as const;
};
