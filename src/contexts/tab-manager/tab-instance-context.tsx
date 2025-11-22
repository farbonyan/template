"use client";

import * as React from "react";

import type { Tab } from "./tab-context";

type TabInstanceContextType = {
  tabId: string;
  active: boolean;
  closeSelf: (result?: unknown, force?: boolean) => void;
  updateSelf: (params: Partial<Tab>) => void;
};

const TabInstanceContext = React.createContext<
  TabInstanceContextType | undefined
>(undefined);

export const TabInstanceProvider = TabInstanceContext.Provider;

export const useTabInstance = () => {
  const context = React.useContext(TabInstanceContext);
  if (!context) {
    throw new Error(
      "useTabInstance must be used inside a TabInstanceContext.Provider",
    );
  }
  return context;
};
