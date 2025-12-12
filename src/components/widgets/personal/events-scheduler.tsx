"use client";

import * as React from "react";
import { BellRingIcon, Calendar1Icon } from "lucide-react";

import type { WidgetProps } from "~/contexts/systems";
import { Button } from "~/components/ui/button";
import { Scheduler } from "~/components/ui/scheduler";
import { cn } from "~/lib/utils";

export const EventsScheduler = ({ isZoomFullScreen }: WidgetProps) => {
  const [value, setValue] = React.useState<"reminder" | "interaction">(
    "interaction",
  );

  return (
    <div className="~px-4/6 ~pb-4/6 relative flex h-full w-full items-center justify-center">
      <Scheduler
        events={[]}
        weekends={[6]}
        holidays={[]}
        className={cn("p-2", isZoomFullScreen ? "h-[90%]" : "h-[28rem]")}
      />
      <Button
        type="button"
        size="icon"
        variant="default"
        className="absolute bottom-2 end-2 rounded-full"
        onClick={() =>
          setValue((value) =>
            value === "interaction" ? "reminder" : "interaction",
          )
        }
      >
        {value === "reminder" ? (
          <BellRingIcon className="size-4" />
        ) : (
          <Calendar1Icon className="size-4" />
        )}
      </Button>
    </div>
  );
};
