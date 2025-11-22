import * as React from "react";

/**
 * Handle element resize
 *
 * @param callback Callback when element resizes
 * @returns Element reference to check for resize
 */
export const useResizeObserver = <T extends Element>(
  callback: (entry: ResizeObserverEntry) => void,
) => {
  const elementRef = React.useRef<T>(null);

  // Start observing the element when the component is mounted
  React.useLayoutEffect(() => {
    if (!elementRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      entry && callback(entry);
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [callback]);

  return elementRef;
};
