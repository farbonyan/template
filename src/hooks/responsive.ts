"use client";

import { useMediaQuery } from "./media-query";

/**
 * Get booleans of window sizes conditions
 *
 * @returns Window sizes booleans (like: isSmUp is true when window width is bigger than 640px)
 */
export const useResponsive = () => {
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const isXlUp = useMediaQuery("(min-width: 1280px)");
  const is2xlUp = useMediaQuery("(min-width: 1536px)");
  const isSmDown = useMediaQuery("(max-width: 640px)");
  const isMdDown = useMediaQuery("(max-width: 768px)");
  const isLgDown = useMediaQuery("(max-width: 1024px)");
  const isXlDown = useMediaQuery("(max-width: 1280px)");
  const is2xlDown = useMediaQuery("(max-width: 1536px)");

  return {
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    is2xlUp,
    isSmDown,
    isMdDown,
    isLgDown,
    isXlDown,
    is2xlDown,
  };
};
