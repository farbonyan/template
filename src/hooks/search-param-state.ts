"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { usePathname, useRouter } from "~/i18n/routing";

/**
 * Use a state stored in search parameters of url
 *
 * @param name Name of state
 * @param defaultValue Default value of state
 * @returns Value and setter of state
 */
export const useSearchParamState = (name: string, defaultValue?: string) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const value = searchParams.get(name) ?? defaultValue;

  const setValue = React.useCallback(
    (value: string | undefined) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      value ? current.set(name, value) : current.delete(name);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [name, pathname, router, searchParams],
  );

  return [value, setValue] as const;
};
