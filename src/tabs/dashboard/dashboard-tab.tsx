import * as React from "react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { SlideOver } from "~/components/ui/slide-over";
import { useSetting } from "~/contexts/settings";
import { useSearchParamState } from "~/hooks/search-param-state";
import { z } from "~/lib/zod";
import { WidgetList, WidgetPreviewList } from "./widget";

export const dashboardTabProps = z.undefined();

export type DashboardTabProps = z.infer<typeof dashboardTabProps>;

/**
 * Dashboard's tab
 */
export const DashboardTab = () => {
  const [widgets, setWidgets] = useSetting("widgets", [["events-scheduler"]]);
  const [editing, setEditing] = useSearchParamState("editingWidgets");

  return (
    <SlideOver
      open={editing === "true"}
      onClose={() => setEditing(undefined)}
      defaultPinned
      classNames={{
        container: "bg-dashboard p-0",
        slideOver: "sm:w-1/3 md:w-1/4 xl:w-1/5",
      }}
      SliderComponent={
        <WidgetPreviewList widgets={widgets} setWidgets={setWidgets} />
      }
    >
      <ScrollArea className="h-full [&>div>div]:!block">
        <WidgetList
          editing={editing === "true"}
          widgets={widgets}
          setWidgets={setWidgets}
        />
      </ScrollArea>
    </SlideOver>
  );
};
