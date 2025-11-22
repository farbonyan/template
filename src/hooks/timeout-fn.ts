import * as React from "react";

/**
 * Calls given function after specified amount of milliseconds.
 *
 * @param fn Function that will be called
 * @param ms Delay in milliseconds
 * @returns
 *  isReady: function returning current timeout state:
 *    false - pending
 *    true - called
 *    null - cancelled
 *  reset: Reset the timeout
 *  set: Start the timeout
 */
export const useTimeoutFn = (fn: () => void, ms = 0) => {
  const ready = React.useRef<boolean | null>(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const callback = React.useRef(fn);

  const isReady = React.useCallback(() => ready.current, []);

  const set = React.useCallback(() => {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);

  const clear = React.useCallback(() => {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // update ref when function changes
  React.useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  React.useEffect(() => {
    set();

    return clear;
  }, [ms, set, clear]);

  return [isReady, clear, set] as const;
};
