import { CalendarRangeIcon } from "lucide-react";

import { EventsScheduler } from "./events-scheduler";

export const personalWidgets = {
  eventsScheduler: {
    id: "events-scheduler",
    size: 4,
    icon: CalendarRangeIcon,
    preview: CalendarRangeIcon,
    content: EventsScheduler,
  },
};
