"use client";

import * as React from "react";

import { api } from "~/trpc/react";

type SettingsType = {
  displayMenu: "slider" | "sticky";
  autoplay: boolean;
  fontSize: number;
  widgets: string[][];
  filters: Record<
    string,
    {
      name: string;
      value: string | number | (string | number)[];
    }[]
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
  autoplay: false,
  fontSize: 0.75,
  widgets: [["events-scheduler"]],
  filters: {},
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

export const useSetting = <K extends keyof SettingsType>(key: K) => {
  const { settings, loading } = useSettings();
  const utils = api.useUtils();
  const setSettingMutation = api.setting.set.useMutation({
    onSuccess: async () => {
      await utils.setting.all.refetch();
    },
  });

  const setSetting = React.useCallback(
    (value: SettingsType[K]) => {
      setSettingMutation.mutate({ key, value });
    },
    [key, setSettingMutation],
  );

  return [settings[key], setSetting, loading] as const;
};
