"use client";

import type DateObject from "react-date-object";
import type { CalendarProps as __CalendarProps } from "react-multi-date-picker";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Calendar as __Calendar } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

import { cn } from "~/lib/utils";
import { getCalendarAndLocale } from "~/utils/date";
import { Button } from "./button";

type CustomButtonProps = {
  direction?: "left" | "right";
  disabled?: boolean;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
};

const CustomButton = ({
  direction = "right",
  disabled = false,
  handleClick,
  onKeyDown,
}: CustomButtonProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={onKeyDown}
      className="size-6 rounded-full"
    >
      <Icon className="size-4 rtl:rotate-180" />
    </Button>
  );
};

type BaseCalendarProps = Omit<
  __CalendarProps,
  "locale" | "calendar" | "range" | "value" | "onChange"
>;

type SingleCalendarProps = BaseCalendarProps & {
  range?: false;
  value: Date | null | undefined;
  onChange: (value: DateObject | null) => void;
};

type RangeCalendarProps = BaseCalendarProps & {
  range: true;
  value: (Date | null | undefined)[];
  onChange: (value: DateObject[] | null) => void;
};

type CalendarProps = SingleCalendarProps | RangeCalendarProps;

const Calendar = ({ className, ...props }: CalendarProps) => {
  const locale = useLocale();

  return (
    <__Calendar
      {...getCalendarAndLocale(locale)}
      monthYearSeparator="-"
      className={cn(
        "!bg-popover [&_*]:text-popover-foreground [&_.rmdp-border-bottom]:border-border [&_.rmdp-day-picker]:!bg-popover [&_.rmdp-day]:leading-[0] [&_.rmdp-disabled>span]:!text-muted-foreground [&_.rmdp-month-picker]:!bg-popover [&_.rmdp-year-picker]:!bg-popover",
        className,
      )}
      renderButton={<CustomButton />}
      {...(props as unknown as __CalendarProps)}
    />
  );
};
Calendar.displayName = "Calendar";

export {
  Calendar,
  TimePicker,
  type BaseCalendarProps,
  type CalendarProps,
  type RangeCalendarProps,
  type SingleCalendarProps,
};
