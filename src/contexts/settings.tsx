"use client";

import type { NestedKeyOf, NestedValueOf } from "next-intl";
import * as React from "react";

import { api } from "~/trpc/react";

type SettingsType = {
  displayMenu: "slider" | "sticky";
  widgets: string[][];
  tables: Record<
    string,
    {
      columnVisibility: Record<string, boolean>;
      columnOrder: string[];
    }
  >;
};

type SettingContextType = {
  settings: SettingsType;
  loading: boolean;
};

const SettingContext = React.createContext<SettingContextType | undefined>(
  undefined,
);

export type SettingProviderProps = { children: React.ReactNode };

export const defaultSettings: SettingsType = {
  displayMenu: "sticky",
  widgets: [["events-scheduler"]],
  tables: {},
};

export const SettingProvider = ({ children }: SettingProviderProps) => {
  const settingsQuery = api.setting.all.useQuery(undefined, {
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  return (
    <SettingContext.Provider
      value={{
        loading: settingsQuery.isPending,
        settings: { ...defaultSettings, ...settingsQuery.data },
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSettings = () => {
  const context = React.useContext(SettingContext);
  if (!context) {
    throw new Error("useSetting must be used within a SettingsProvider");
  }
  return context;
};

export const useSetting = <K extends NestedKeyOf<SettingsType>>(
  key: K,
  defaultValue?: NestedValueOf<SettingsType, K>,
) => {
  const { settings, loading } = useSettings();
  const utils = api.useUtils();

  const setSettingMutation = api.setting.set.useMutation({
    async onMutate({ key: k, value: v }) {
      try {
        const previous = utils.setting.all.getData();
        if (previous) {
          const next = { ...previous, [k]: v as unknown };
          utils.setting.all.setData(undefined, next);
        }
        return { previous };
      } catch {
        return { previous: undefined };
      }
    },
    onError(_err, _vars, context) {
      if (context?.previous) {
        utils.setting.all.setData(undefined, context.previous);
      }
    },
    onSettled: async () => {
      await utils.setting.all.refetch();
    },
  });

  const readFromSettings = (s: unknown, k: string) => {
    if (!s || typeof s !== "object") return undefined;
    if ((s as Record<string, unknown>)[k] !== undefined) {
      return (s as Record<string, unknown>)[k];
    }
    const parts = k.split(".");
    let cur: object | undefined = s;
    for (const p of parts) {
      if (typeof cur === "object" && p in cur) {
        cur = cur[p as keyof typeof cur];
      } else {
        cur = undefined;
        break;
      }
    }
    return cur;
  };

  const value = React.useMemo(() => {
    const raw = readFromSettings(settings, String(key));
    return (raw as NestedValueOf<SettingsType, K> | undefined) ?? defaultValue;
  }, [settings, key, defaultValue]);

  const setSetting = (
    updater: React.SetStateAction<NestedValueOf<SettingsType, K>>,
  ) => {
    const newValue =
      typeof updater === "function"
        ? (
            updater as (
              prev: NestedValueOf<SettingsType, K> | undefined,
            ) => NestedValueOf<SettingsType, K>
          )(value)
        : updater;
    setSettingMutation.mutate({ key, value: newValue });
  };

  return [value, setSetting, loading] as const;
};
