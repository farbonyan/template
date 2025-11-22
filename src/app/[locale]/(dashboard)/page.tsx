"use client";

import * as React from "react";

import type { SystemLink } from "~/contexts/tab-manager";
import {
  TabList,
  useTabContext,
  useTabOpener,
  useTabPages,
} from "~/contexts/tab-manager";
import { useSearchParamState } from "~/hooks/search-param-state";
import { getCookie, removeCookie, setCookie } from "~/utils/cookie";
import { TabComponent } from "./_components/tab-component";

export default function Home() {
  const initialRender = React.useRef(true);
  const { tabs, closeTab, activeTabId, updateTab } = useTabContext();
  const [page, setPage] = useSearchParamState("page");

  const tabPages = useTabPages();
  const openTab = useTabOpener();

  React.useEffect(() => {
    if (!initialRender.current) return;
    initialRender.current = false;
    void openTab("dashboard", undefined, undefined, false);
    if (!page || page === "dashboard") return;
    const pageParams = getCookie("pageParams");
    if (!pageParams) return;
    const currentPage =
      page in tabPages ? tabPages[page as SystemLink[0]] : undefined;
    if (!currentPage) return;
    openTab(
      page as SystemLink[0],
      (!["undefined", "null"].includes(pageParams)
        ? JSON.parse(pageParams)
        : undefined) as SystemLink[1],
    ).catch((e) => console.error(e));
  }, [openTab, page, tabPages]);

  React.useEffect(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (!activeTab) {
      setPage(undefined);
      removeCookie("pageParams");
      return;
    }
    const [name, params] = JSON.parse(activeTab.tabKey) as SystemLink;
    setPage(name);
    setCookie({ name: "pageParams", value: JSON.stringify(params) });
  }, [tabs, activeTabId, setPage]);

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <TabList />
      <div className="flex-1 overflow-hidden">
        {tabs.map((tab) => {
          return (
            <TabComponent
              key={tab.id}
              tab={tab}
              activeTabId={activeTabId}
              closeTab={closeTab}
              updateTab={updateTab}
            />
          );
        })}
      </div>
    </div>
  );
}
