import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Edit3Icon,
  Plus,
  TrashIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import type { TCalendar } from "~/utils/date";
import { useResponsive } from "~/hooks/responsive";
import { cn } from "~/lib/utils";
import {
  calendars,
  DateObject,
  getCalendarAndLocale,
  getLocaleDefaultCalendar,
} from "~/utils/date";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from "./hybrid-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./table";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type EventType = {
  id: string;
  title: string;
  color: string;
  date: Date;
  description: string | null;
};

type HolidayType = {
  title: string;
  date: Date;
};

type SchedulerProps = {
  events: EventType[];
  weekends?: number[];
  holidays?: HolidayType[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: (defaultDate?: Date) => void;
  className?: string;
};

const Scheduler = ({
  events,
  weekends,
  holidays,
  onEdit,
  onCreate,
  onDelete,
  className,
}: SchedulerProps) => {
  const t = useTranslations("components.scheduler");
  const formatter = useFormatter();
  const { isSmUp } = useResponsive();
  const locale = useLocale();
  const [calendar, setCalendar] = React.useState<TCalendar>(
    getLocaleDefaultCalendar(locale),
  );
  const [position, setPosition] = React.useState(0);
  const calendarAndLocale = getCalendarAndLocale(locale, calendar);
  const now = React.useMemo(
    () => new DateObject(calendarAndLocale),
    [calendarAndLocale],
  );

  const firstDayOfYear = new DateObject(now).toFirstOfYear();
  const firstDayOfMonth = new DateObject(now)
    .add(position, "months")
    .toFirstOfMonth();
  const monthStartDayIndex = firstDayOfMonth.weekDay.index;
  const firstDayOfWeek = new DateObject(firstDayOfMonth).add(
    -monthStartDayIndex,
    "days",
  );
  const numberOfWeeks = Math.ceil(
    (firstDayOfMonth.month.length + monthStartDayIndex) / 7,
  );

  const parsedEvents = React.useMemo(() => {
    const eventsMap = new Map<number, EventType[]>();
    events.forEach((event) => {
      const date = new DateObject({ date: event.date, ...calendarAndLocale });
      if (
        date.year !== firstDayOfMonth.year ||
        date.monthIndex !== firstDayOfMonth.monthIndex
      ) {
        return;
      }
      const events = eventsMap.get(date.day);
      eventsMap.set(date.day, events ? [...events, event] : [event]);
    });
    return eventsMap;
  }, [events, firstDayOfMonth, calendarAndLocale]);

  const parsedHolidays = React.useMemo(() => {
    const holidaysMap = new Map<string, HolidayType>();
    holidays?.forEach((holiday) => {
      holidaysMap.set(formatter.dateTime(holiday.date, "date"), holiday);
    });
    return holidaysMap;
  }, [formatter, holidays]);

  const [activeDay, setActiveDay] = React.useState<DateObject>();

  React.useEffect(() => {
    if (typeof activeDay === "undefined") return;
    if (!parsedEvents.has(activeDay.day)) {
      setActiveDay(undefined);
    }
  }, [activeDay, parsedEvents]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Dialog
        open={typeof activeDay !== "undefined"}
        onOpenChange={(open) => {
          !open && setActiveDay(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeDay &&
                formatter.dateTime(activeDay.toDate(), {
                  dateStyle: "medium",
                  calendar,
                })}
            </DialogTitle>
          </DialogHeader>
          <Accordion collapsible type="single" className="mt-2 space-y-2">
            {activeDay &&
              parsedEvents.get(activeDay.day)?.map((event, index) => {
                return (
                  <AccordionItem
                    key={index}
                    tabIndex={-1}
                    value={event.id.toString()}
                    style={{ backgroundColor: event.color }}
                    className="rounded-lg p-2"
                  >
                    <div className="flex items-center">
                      <div className="flex gap-2">
                        {onDelete && (
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => onDelete(event.id)}
                          >
                            <TrashIcon className="size-4 text-destructive" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => onEdit(event.id)}
                          >
                            <Edit3Icon className="size-4 text-primary" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <AccordionTrigger
                          disabled={!event.description}
                          className="gap-2 py-2 text-background text-white hover:no-underline disabled:text-background [&:disabled>svg]:hidden"
                        >
                          <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden">
                            <span className="truncate">{event.title}</span>
                          </div>
                        </AccordionTrigger>
                      </div>
                    </div>
                    <AccordionContent className="mt-2 whitespace-pre-wrap p-2">
                      {event.description}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </DialogContent>
      </Dialog>
      <div className="relative flex flex-col items-center gap-2 rounded-md py-1 md:flex-row md:justify-center md:px-1">
        <p className="start-0 md:absolute md:top-1/2 md:-translate-y-1/2">
          {position
            ? formatter.dateTime(firstDayOfMonth.toDate(), {
                month: "short",
                year: "numeric",
                calendar: calendar,
              })
            : t("today", {
                date: formatter.dateTime(now.toDate(), {
                  dateStyle: "medium",
                  calendar,
                }),
                week: formatter.number(
                  Math.ceil((now.dayOfYear + firstDayOfYear.weekDay.index) / 7),
                ),
              })}
        </p>
        <div className="flex w-full items-center justify-between md:justify-center">
          <div className="flex md:gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPosition((p) => p - 1)}
                >
                  <ChevronLeftIcon className="size-4 rtl:rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("prev")}</TooltipContent>
            </Tooltip>
            <Button
              size="sm"
              variant="ghost"
              disabled={!position}
              onClick={() => setPosition(0)}
            >
              <span className="flex-1 truncate text-lg">
                {isSmUp ? t("go-to-today") : t("go-to-today-mobile")}
              </span>
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPosition((p) => p + 1)}
                >
                  <ChevronRightIcon className="size-4 rtl:rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("next")}</TooltipContent>
            </Tooltip>
          </div>
          <div className="end-0 flex items-center gap-2 md:absolute md:top-1/2 md:-translate-y-1/2">
            <Select
              value={calendar}
              onValueChange={(value) => setCalendar(value as TCalendar)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(calendars).map((calendar) => (
                  <SelectItem key={calendar} value={calendar}>
                    {t(`calendars.${calendar as TCalendar}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onCreate && (
              <>
                <Button
                  size="sm"
                  className="hidden sm:block"
                  onClick={() => onCreate()}
                >
                  {t("create")}
                </Button>
                <Button
                  size="sm"
                  className="sm:hidden"
                  onClick={() => onCreate()}
                >
                  <Plus className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col ~mt-2/4">
        <Table className="table-fixed">
          <TableBody>
            <TableRow>
              {firstDayOfMonth.weekDays.map((weekDay) => {
                return (
                  <TableHead key={weekDay.index} className="p-0">
                    <p className="hidden text-center md:block">
                      {weekDay.name}
                    </p>
                    <p className="text-center md:hidden">{weekDay.shortName}</p>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
        <Table className="flex-1 table-fixed">
          <TableBody>
            {Array.from({ length: numberOfWeeks }).map((_, weekIndex) => {
              return (
                <TableRow
                  key={weekIndex}
                  style={{
                    height: `${100 / numberOfWeeks}%`,
                  }}
                >
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dateObject = new DateObject(firstDayOfWeek).add(
                      weekIndex * 7 + dayIndex,
                      "days",
                    );
                    if (dateObject.monthIndex !== firstDayOfMonth.monthIndex) {
                      return <TableCell key={dayIndex}></TableCell>;
                    }
                    const holiday = parsedHolidays.get(
                      formatter.dateTime(dateObject.toDate(), "date"),
                    );
                    const isToday =
                      dateObject.toDate().getTime() === now.toDate().getTime();
                    const isWeekend = !!weekends?.includes(
                      dateObject.weekDay.index,
                    );
                    const events = parsedEvents.get(dateObject.day);
                    const firstEvent = events?.at(0);
                    const color = firstEvent?.color;

                    return (
                      <ContextMenu key={dayIndex}>
                        <ContextMenuTrigger asChild>
                          <TableCell
                            className={cn(
                              "relative border bg-muted/40 p-0 align-top text-base",
                              events && "cursor-pointer",
                            )}
                            onClick={() => {
                              events && setActiveDay(dateObject);
                            }}
                            onDoubleClick={() => {
                              !events && onCreate?.(dateObject.toDate());
                            }}
                          >
                            <div
                              className={cn(
                                "absolute inset-0 flex items-end",
                                events && "border border-e-8",
                              )}
                              style={{
                                borderColor: color,
                                backgroundColor: color
                                  ? `${color}33`
                                  : undefined,
                              }}
                            >
                              {events && (
                                <p className="m-2 hidden text-xs lg:block">
                                  {t("events", { count: events.length })}
                                </p>
                              )}
                              <HybridTooltip>
                                <HybridTooltipTrigger
                                  disabled={!holiday}
                                  className={cn(
                                    "absolute end-1 top-1 line-clamp-1 flex aspect-square size-8 items-center justify-center rounded-lg",
                                    (isWeekend || holiday) &&
                                      "border border-destructive/70 bg-destructive/30 text-destructive",
                                    isToday &&
                                      "border border-success/70 bg-success/30 text-success",
                                    events &&
                                      "pointer-events-none md:pointer-events-auto",
                                  )}
                                >
                                  {formatter.number(dateObject.day)}
                                </HybridTooltipTrigger>
                                {holiday && (
                                  <HybridTooltipContent>
                                    {holiday.title}
                                  </HybridTooltipContent>
                                )}
                              </HybridTooltip>
                            </div>
                          </TableCell>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          {!!events?.length && (
                            <ContextMenuItem
                              onClick={() => setActiveDay(dateObject)}
                            >
                              {t("show")}
                            </ContextMenuItem>
                          )}
                          {onCreate && (
                            <>
                              {!!events?.length && (
                                <ContextMenuSeparator className="mx-2" />
                              )}
                              <ContextMenuItem
                                onClick={() => onCreate(dateObject.toDate())}
                              >
                                {t("create")}
                              </ContextMenuItem>
                            </>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { Scheduler, type SchedulerProps };
