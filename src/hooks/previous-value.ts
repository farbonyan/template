"use client";

import * as React from "react";

export const usePreviousValue = <T>(
  value: T,
  callback?: (prev: T, cur: T) => void,
) => {
  const [prev, setPrev] = React.useState(value);

  if (prev !== value) {
    callback?.(prev, value);
    setPrev(value);
  }

  return prev;
};
