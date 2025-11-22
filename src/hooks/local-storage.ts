"use client";

import * as React from "react";

const store = <TValue>(key: string, value: TValue) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const load = <TValue>(key: string, fallback: TValue) => {
  if (typeof window === "undefined") return fallback;
  const stringValue = localStorage.getItem(key);
  if (!stringValue) {
    store(key, fallback);
    return fallback;
  }
  try {
    return JSON.parse(stringValue) as TValue;
  } catch {
    return fallback;
  }
};

/**
 * Store state in local storage
 *
 * @param key Key to store variable in local storage
 * @param initialValue Initial value of the state
 * @returns Value and setter to change the value
 */
export const useLocalStorage = <
  TValue extends string | number | boolean | object,
>(
  key: string,
  initialValue: TValue,
) => {
  const [value, setValue] = React.useState(() => load(key, initialValue));

  const set = React.useCallback(
    (updater: React.SetStateAction<TValue>) => {
      setValue((value) => {
        const newValue =
          typeof updater === "function" ? (updater(value) as TValue) : updater;
        store(key, newValue);
        return newValue;
      });
    },
    [key],
  );

  const handleStorage = React.useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(
          event.newValue
            ? (JSON.parse(event.newValue) as TValue)
            : initialValue,
        );
      }
    },
    [key, value, initialValue],
  );

  React.useEffect(() => {
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [handleStorage]);

  return [value, set] as const;
};
