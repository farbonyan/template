"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { toast } from "~/components/ui/toast";
import { move } from "~/utils/array";

export type Tab = {
  id: string;
  tabKey: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  closable?: boolean;
  component: React.ReactNode;
  from?: string;
  onClose?: (result?: unknown) => void;
  onBeforeClose?: () => boolean | Promise<boolean>;
};

type TabContextType = {
  tabs: Tab[];
  activeTabId: string | undefined;
  openTab: (tab: Tab) => void;
  closeTab: (id: string, result?: unknown, force?: boolean) => Promise<void>;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;
  changeTab: (id: string) => void;
  moveTabs: (dragged: string, dropped: string) => void;
  updateTab: (id: string, params: Partial<Tab>) => void;
};

const TabContext = React.createContext<TabContextType | undefined>(undefined);

export type TabProviderProps = {
  children: React.ReactNode;
  limit: number;
};

export const TabProvider = ({ children, limit }: TabProviderProps) => {
  const t = useTranslations("components.tab-manager");
  const [tabs, setTabs] = React.useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = React.useState<string>();

  const openTab = React.useCallback(
    (tab: Tab) => {
      const existedTab = tabs.find((t) => t.tabKey === tab.tabKey);
      if (existedTab) {
        setActiveTabId(existedTab.id);
        return;
      }
      if (tabs.length >= limit) {
        toast.error(t("tab-limit-error"));
        return;
      }
      setTabs((tabs) => [
        ...tabs,
        {
          ...tab,
          from: activeTabId,
        },
      ]);
      setActiveTabId(tab.id);
    },
    [t, tabs, limit, activeTabId],
  );

  const closeTab = React.useCallback(
    async (id: string, result?: unknown, force?: boolean) => {
      const tabToClose = tabs.find((tab) => tab.id === id);
      if (!tabToClose?.closable) return;
      if (!force && tabToClose.onBeforeClose) {
        const shouldClose = await tabToClose.onBeforeClose();
        if (!shouldClose) return;
      }
      setTabs((tabs) => {
        const tabIndex = tabs.findIndex((tab) => tab.id === id);
        const newTabs = tabs.filter((tab) => tab.id !== id);
        tabToClose.onClose?.(result);
        if (activeTabId === id) {
          const activeTab = tabs.find((tab) => tab.id === activeTabId);
          if (
            activeTab?.from &&
            newTabs.find((tab) => tab.id === activeTab.from)
          ) {
            setActiveTabId(activeTab.from);
          } else {
            const t =
              newTabs[
                tabIndex >= newTabs.length ? newTabs.length - 1 : tabIndex
              ];
            t && setActiveTabId(t.id);
          }
        }
        return newTabs;
      });
    },
    [tabs, activeTabId],
  );

  const closeAllTabs = React.useCallback(() => {
    setTabs((tabs) => {
      const newTabs = tabs.filter((tab) => !tab.closable);
      const currentTab = newTabs.find((tab) => tab.id === activeTabId);
      setActiveTabId(currentTab?.id ?? newTabs.at(-1)?.id);
      return newTabs;
    });
  }, [activeTabId]);

  const closeOtherTabs = React.useCallback(
    (id: string) => {
      setTabs((tabs) => {
        const newTabs = tabs.filter((tab) => !tab.closable || tab.id === id);
        const currentTab = newTabs.find((tab) => tab.id === activeTabId);
        setActiveTabId(currentTab?.id ?? newTabs.at(-1)?.id);
        return newTabs;
      });
    },
    [activeTabId],
  );

  const changeTab = React.useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const updateTab = React.useCallback((id: string, params: Partial<Tab>) => {
    setTabs((tabs) =>
      tabs.map((tab) => {
        if (tab.id !== id) return tab;
        return { ...tab, ...params };
      }),
    );
  }, []);

  const moveTabs = React.useCallback((dragged: string, dropped: string) => {
    setTabs((tabs) => {
      const draggedTabIndex = tabs.findIndex((tab) => tab.id === dragged);
      const droppedTabIndex = tabs.findIndex((tab) => tab.id === dropped);
      return move(tabs, draggedTabIndex, droppedTabIndex);
    });
  }, []);

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        closeAllTabs,
        closeOtherTabs,
        changeTab,
        moveTabs,
        updateTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = (): TabContextType => {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};
