"use client";

import * as React from "react";
import {
  CircleUserIcon,
  ClipboardListIcon,
  FileImageIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { z } from "~/lib/zod";
import {
  DashboardTab,
  dashboardTabProps,
} from "~/tabs/dashboard/dashboard-tab";
import {
  DocumentPreviewTab,
  documentPreviewTabProps,
} from "~/tabs/preview/preview";
import { TemplateTab } from "~/tabs/template/template-tab";
import { UserTab, userTabProps } from "~/tabs/users/user-tab";
import { UsersTab } from "~/tabs/users/users-tab";

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
        preview: createTab({
          params: documentPreviewTabProps,
          return: z.void(),
          icon: () => FileImageIcon,
          title: (params) => params.document.name,
          component: (params) => <DocumentPreviewTab {...params} />,
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
        ...createGroup("users", {
          list: createTab({
            params: z.undefined(),
            return: z.void(),
            icon: () => CircleUserIcon,
            title: () => t("pages.users.title"),
            component: () => <UsersTab />,
          }),
          single: createTab({
            params: userTabProps,
            return: z.string(),
            icon: () => CircleUserIcon,
            title: (params) => {
              if (params.user) {
                return t("pages.users.single.update-title", {
                  name: params.user.name,
                });
              }
              return t("pages.users.single.create-title");
            },
            component: (params) => <UserTab {...params} />,
          }),
        }),
      }) as const,
    [t],
  );
};
