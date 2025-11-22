"use client";

import * as React from "react";
import { ClipboardListIcon, LayoutDashboardIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { z } from "~/lib/zod";
import {
  DashboardTab,
  dashboardTabProps,
} from "~/tabs/dashboard/dashboard-tab";
import { TemplateTab } from "~/tabs/template/template-tab";

const createTab = <Params, Result>(config: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: z.ZodType<Params, any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return: z.ZodType<Result, any, any>;
  icon: (params: Params) => React.ComponentType<{ className?: string }>;
  title: (params: Params) => string | Promise<string>;
  component: (params: Params) => React.ReactNode | Promise<React.ReactNode>;
}) => {
  return config;
};

const createGroup = <Name extends string, Tabs extends object>(
  name: Name,
  tabs: Tabs,
) => {
  return Object.fromEntries(
    Object.entries(tabs).map(([key, tab]) => [`${name}.${key}`, tab]),
  ) as {
    [K in keyof Tabs as `${Name}.${Extract<K, string>}`]: Tabs[K];
  };
};

export const useTabPages = () => {
  const t = useTranslations();

  return React.useMemo(
    () =>
      ({
        dashboard: createTab({
          params: dashboardTabProps,
          return: z.void(),
          icon: () => LayoutDashboardIcon,
          title: () => t("pages.index.title"),
          component: () => <DashboardTab />,
        }),
        ...createGroup("template", {
          create: createTab({
            params: z.undefined(),
            return: z.undefined(),
            icon: () => ClipboardListIcon,
            title: () => {
              return t("pages.template.title");
            },
            component: () => <TemplateTab />,
          }),
        }),
      }) as const,
    [t],
  );
};
