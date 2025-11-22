"use client";

import * as React from "react";

/**
 * Check if window size matches the query
 *
 * @param query Query to match window size
 * @returns True if window size matches the query
 */
export const useMediaQuery = (query: string) => {
  const queryRef = React.useRef(query);
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const matchQueryList = window.matchMedia(queryRef.current);
    setMatches(matchQueryList.matches);
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    matchQueryList.addEventListener("change", handleChange);
    return () => matchQueryList.removeEventListener("change", handleChange);
  }, []);

  return matches;
};
