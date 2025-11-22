import * as React from "react";

import type { Tab } from "~/contexts/tab-manager";
import { Card, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading";
import { TabInstanceProvider } from "~/contexts/tab-manager";
import { cn } from "~/lib/utils";

export type TabComponentProps = {
  tab: Tab;
  activeTabId?: string;
  closeTab: (id: string, result?: unknown, force?: boolean) => void;
  updateTab: (id: string, params: Partial<Tab>) => void;
};

export const TabComponent = ({
  tab,
  activeTabId,
  closeTab,
  updateTab,
}: TabComponentProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = React.useState(true);

  const closeSelf = React.useCallback(
    (result?: unknown, force?: boolean) => {
      closeTab(tab.id, result, force);
    },
    [closeTab, tab.id],
  );

  const updateSelf = React.useCallback(
    (params: Partial<Tab>) => {
      updateTab(tab.id, params);
    },
    [updateTab, tab.id],
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!ref.current) return;
      const empty = ref.current.innerHTML.trim() === "";
      setIsEmpty(empty);
    });
    if (ref.current) {
      observer.observe(ref.current, {
        childList: true,
        subtree: true,
      });
    }
    if (ref.current) {
      const empty = ref.current.innerHTML.trim() === "";
      setIsEmpty(empty);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("h-full", tab.id !== activeTabId && "hidden")}>
      {isEmpty && (
        <Card className="h-full rounded-lg">
          <CardContent className="flex h-full items-center justify-center p-0 text-center">
            <LoadingSpinner className="m-0 stroke-primary ~size-12/24" />
          </CardContent>
        </Card>
      )}
      <div
        ref={ref}
        className={cn("h-full overflow-hidden", isEmpty && "hidden")}
      >
        <TabInstanceProvider
          value={{
            active: tab.id === activeTabId,
            tabId: tab.id,
            closeSelf,
            updateSelf,
          }}
        >
          {tab.component}
        </TabInstanceProvider>
      </div>
    </div>
  );
};
