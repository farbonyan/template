import * as React from "react";

import { useResizeObserver } from "./resize-observer";

/**
 * Get client and scroll width of an element
 *
 * @returns Element reference and element width
 */
export const useElementWidth = <T extends Element>() => {
  const [elementWidth, setElementWidth] = React.useState({
    clientWidth: 0,
    scrollWidth: 0,
  });

  const observer = React.useCallback((entry: ResizeObserverEntry) => {
    setElementWidth({
      clientWidth: entry.target.clientWidth,
      scrollWidth: entry.target.scrollWidth,
    });
  }, []);

  const elementRef = useResizeObserver<T>(observer);

  React.useLayoutEffect(() => {
    if (!elementRef.current) return;
    setElementWidth({
      clientWidth: elementRef.current.clientWidth,
      scrollWidth: elementRef.current.scrollWidth,
    });
  }, [elementRef]);

  return [elementRef, elementWidth] as const;
};
