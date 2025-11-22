import * as React from "react";

import screenfull from "~/utils/screenfull";

export const useFullScreen = <T extends Element>() => {
  const elementRef = React.useRef<T>(null);
  const [isFullscreen, setFullScreen] = React.useState(screenfull.isFullscreen);

  const toggle = React.useCallback(() => {
    if (!elementRef.current) return;
    return screenfull.toggle(elementRef.current);
  }, []);

  React.useEffect(() => {
    screenfull.on("change", () => {
      setFullScreen(screenfull.isFullscreen);
    });
  }, []);

  return [elementRef, isFullscreen, toggle] as const;
};
