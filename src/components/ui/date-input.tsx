"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { useLocale, useNow, useTranslations } from "next-intl";
import DateObject from "react-date-object";
import Toolbar from "react-multi-date-picker/plugins/toolbar";

import type { SingleCalendarProps } from "./calendar";
import { useMediaQuery } from "~/hooks/media-query";
import {
  defaultMaxDate,
  defaultMinDate,
  getCalendarAndLocale,
} from "~/utils/date";
import { Calendar, TimePicker } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { TextInput } from "./text-input";

type DateInputProps = Omit<SingleCalendarProps, "onChange"> &
  React.AriaAttributes & {
    time?: boolean;
    seconds?: boolean;
    placeholder?: string;
    onChange?: (value: Date | null) => void;
  };

const DateInput = ({
  placeholder,
  time,
  seconds,
  value,
  onChange,
  ...props
}: DateInputProps) => {
  const t = useTranslations("components.date-input");
  const isTouch = useMediaQuery("(pointer: coarse)");
  const now = useNow();
  const locale = useLocale();

  const ref = React.useRef<React.ComponentRef<"input">>(null);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [stringDate, setStringDate] = React.useState(
    value
      ? time
        ? new DateObject({
            date: value,
            ...getCalendarAndLocale(locale),
          }).format("HH:mm - YYYY/MM/DD")
        : new DateObject({
            date: value,
            ...getCalendarAndLocale(locale),
          }).format("YYYY/MM/DD")
      : "",
  );

  const plugins = React.useMemo(
    () =>
      [
        <Toolbar
          key="toolbar"
          sort={["today"]}
          names={{
            today: t("today", { date: now }),
            deselect: "",
            close: "",
          }}
          className="w-full px-2 *:w-full *:flex-1 *:text-nowrap"
          position="bottom"
        />,
        time ? (
          <TimePicker position="bottom" hideSeconds={!seconds} />
        ) : undefined,
      ].filter((plugin) => typeof plugin !== "undefined"),
    [now, t, time, seconds],
  );

  return (
    <div className="relative w-full">
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          open && ref.current?.focus();
        }}
      >
        <TextInput
          ref={ref}
          value={stringDate}
          placeholder={placeholder}
          className="pe-8"
          onChange={(value) => {
            setStringDate(value.match(/[\d:/ ]*/g)?.join("") ?? "");
          }}
          aria-invalid={error || props["aria-invalid"]}
          maxLength={10}
          disabled={isTouch}
          onBlur={() => {
            if (!stringDate) {
              onChange?.(null);
              setError(false);
              return;
            }
            const parsedDate = new DateObject({
              date: time
                ? stringDate.split(" - ").reverse().join(" ")
                : stringDate,
              format: "YYYY/MM/DD HH:mm:ss",
              ...getCalendarAndLocale(locale),
            });
            if (parsedDate.toDate().toString() === "Invalid Date") {
              setStringDate("");
              setError(true);
              onChange?.(null);
              return;
            }
            setError(false);
            setStringDate(
              time
                ? parsedDate.format("HH:mm - YYYY/MM/DD")
                : parsedDate.format("YYYY/MM/DD"),
            );
            onChange?.(parsedDate.toDate());
          }}
        />
        <PopoverTrigger className="absolute end-2 top-1/2 -translate-y-1/2">
          <CalendarIcon className="size-4" />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="end"
          tabIndex={-1}
          className="w-auto p-0"
        >
          <Calendar
            range={false}
            value={value}
            onChange={(date) => {
              if (!time) {
                setOpen(false);
              }
              setError(false);
              if (!date) {
                setStringDate("");
                onChange?.(null);
                return;
              }
              const d = date.toDate();
              setStringDate(
                time
                  ? date.format("HH:mm - YYYY/MM/DD")
                  : date.format("YYYY/MM/DD"),
              );
              onChange?.(d);
            }}
            plugins={plugins}
            minDate={defaultMinDate}
            maxDate={defaultMaxDate}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DateInput, type DateInputProps };
