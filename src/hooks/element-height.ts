import * as React from "react";

import { useResizeObserver } from "./resize-observer";

/**
 * Get client and scroll height of an element
 *
 * @returns Element reference and element height
 */
export const useElementHeight = <T extends Element>() => {
  const [elementHeight, setElementHeight] = React.useState({
    clientHeight: 0,
    scrollHeight: 0,
  });

  const observer = React.useCallback((entry: ResizeObserverEntry) => {
    setElementHeight({
      clientHeight: entry.target.clientHeight,
      scrollHeight: entry.target.scrollHeight,
    });
  }, []);

  const elementRef = useResizeObserver<T>(observer);

  React.useLayoutEffect(() => {
    if (!elementRef.current) return;
    setElementHeight({
      clientHeight: elementRef.current.clientHeight,
      scrollHeight: elementRef.current.scrollHeight,
    });
  }, [elementRef]);

  return [elementRef, elementHeight] as const;
};
