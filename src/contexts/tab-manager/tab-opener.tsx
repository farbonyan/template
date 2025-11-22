"use client";

import * as React from "react";

import type { z } from "~/lib/zod";
import { generateUUID } from "~/utils/uuid";
import { useTabContext } from "./tab-context";
import { useTabPages } from "./tab-pages";

export type TabPages = ReturnType<typeof useTabPages>;

export type SystemLink = Parameters<ReturnType<typeof useTabOpener>>;

export type TabPageName = keyof TabPages;

export type ParamsFor<T extends TabPageName> = z.infer<TabPages[T]["params"]>;

export type ResultFor<T extends TabPageName> = z.infer<TabPages[T]["return"]>;

export const useTabOpener = () => {
  const { openTab } = useTabContext();
  const tabPages = useTabPages();

  return React.useCallback(
    async <T extends TabPageName>(
      name: T,
      params: ParamsFor<T>,
      onClose?: (result?: ResultFor<T>) => void,
      closable = true,
    ) => {
      const page = tabPages[name];
      const validation = page.params.safeParse(params);
      if (!validation.success) {
        throw new Error(
          `Invalid params for ${name} tab: ${validation.error.message}`,
        );
      }
      const [pageIcon, pageTitle, pageComponent] = await Promise.all([
        page.icon(params as never),
        page.title(params as never),
        page.component(params as never),
      ]);
      openTab({
        id: generateUUID(),
        closable: closable,
        tabKey: JSON.stringify([name, params]),
        icon: pageIcon,
        title: pageTitle,
        component: pageComponent,
        onClose: onClose as never,
      });
    },
    [tabPages, openTab],
  );
};
