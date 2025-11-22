import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { useFormatter, useTranslations } from "next-intl";

import type { MinMax } from "../types";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Props<TData> = {
  column: Column<TData, unknown>;
};

type FilterOption = "lt" | "mt" | "bw";

const FilterInput = ({
  filterOption,
  filterValue,
  onChange,
}: {
  filterOption: FilterOption;
  filterValue: MinMax | undefined;
  onChange: (newValue: MinMax | undefined) => void;
}) => {
  const t = useTranslations("components.data-table.header.filters.date");
  const formatter = useFormatter();
  const minValue = filterValue?.[0];
  const maxValue = filterValue?.[1];

  if (filterOption === "bw") {
    const rangeValue = [] as Date[];
    if (minValue) rangeValue.push(new Date(minValue));
    if (maxValue) rangeValue.push(new Date(maxValue));

    return (
      <DatePicker
        range
        rangeHover
        cancelable
        display={
          minValue && maxValue
            ? formatter.dateTimeRange(minValue, maxValue, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : undefined
        }
        placeholder={t("choose-date")}
        className="overflow-hidden px-2 text-muted-foreground/30 [&>div>span]:text-muted-foreground/30"
        value={rangeValue}
        onChange={(value) => {
          if (!value) {
            onChange(undefined);
            return;
          }
          const min = value[0]?.toDate();
          min?.setHours(0, 0, 0);
          const max = value[1]?.toDate();
          max?.setHours(23, 59, 59);
          onChange([min?.getTime(), max?.getTime()]);
        }}
        onBlur={() => {
          if (rangeValue.length !== 2) {
            onChange(undefined);
          }
        }}
      />
    );
  }

  const numberValue = filterOption === "lt" ? maxValue : minValue;
  const value = numberValue ? new Date(numberValue) : undefined;

  return (
    <DatePicker
      cancelable
      display={
        value
          ? formatter.dateTime(value, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : ""
      }
      placeholder={t("choose-date")}
      value={value}
      className="overflow-hidden text-muted-foreground/30 [&>div>span]:text-muted-foreground/30"
      onChange={(value) => {
        if (Array.isArray(value)) {
          return;
        }
        const dateValue = value?.toDate();
        if (filterOption === "lt") {
          dateValue?.setHours(0, 0, 0);
          onChange([undefined, dateValue?.getTime()]);
          return;
        }
        dateValue?.setHours(23, 59, 59);
        onChange([dateValue?.getTime(), undefined]);
      }}
    />
  );
};

export const DateFilterInput = <TData,>({ column }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.filters.date");
  const filterValue = column.getFilterValue() as MinMax | undefined;

  const [filterOption, setFilterOption] = React.useState<FilterOption>(
    filterValue?.[0] && !filterValue[1]
      ? "mt"
      : !filterValue?.[0] && filterValue?.[1]
        ? "lt"
        : "bw",
  );

  const filterOptions = React.useMemo(() => {
    return [
      {
        label: t("less-than"),
        value: "lt",
      },
      {
        label: t("more-than"),
        value: "mt",
      },
      {
        label: t("between"),
        value: "bw",
      },
    ] as const;
  }, [t]);

  return (
    <div className="flex w-full flex-nowrap items-center gap-1 overflow-hidden *:flex-1">
      <Select
        value={filterOption}
        onValueChange={(option) => {
          column.setFilterValue(undefined);
          setFilterOption(option as FilterOption);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map(({ label, value }) => {
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <FilterInput
        filterOption={filterOption}
        filterValue={filterValue}
        onChange={(value) => column.setFilterValue(value)}
      />
    </div>
  );
};
