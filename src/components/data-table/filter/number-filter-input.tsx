import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { useTranslations } from "next-intl";

import { DebouncedNumberInput } from "~/components/ui/debounced-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { defaultNumberFilterOption, parseNumberFilterValue } from "../utils";

type Props<TData> = {
  column: Column<TData, unknown>;
};

const changeValue = (
  filterValue: string | undefined,
  newValue: number | undefined,
) => {
  const [filterOption] = parseNumberFilterValue(filterValue);
  return JSON.stringify([filterOption, newValue]);
};

const changeFilterOption = (
  filterValue: string | undefined,
  newFilterOption: string | undefined,
) => {
  const [, value] = parseNumberFilterValue(filterValue);
  return JSON.stringify([newFilterOption ?? defaultNumberFilterOption, value]);
};

export const NumberFilterInput = <TData,>({ column }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.filters.number");

  const columnFilterValue = column.getFilterValue() as string | undefined;
  const [filterOption, value] = parseNumberFilterValue(columnFilterValue);

  const handleChange = React.useCallback(
    (value: number | undefined) => {
      if (typeof value === "undefined" && !columnFilterValue) {
        return;
      }
      column.setFilterValue((filterValue: string) =>
        changeValue(filterValue, value),
      );
    },
    [column, columnFilterValue],
  );

  const filterOptions = React.useMemo(() => {
    return [
      { label: t("equals"), value: "eq" },
      { label: t("not-equals"), value: "ne" },
      { label: t("less-than"), value: "lt" },
      { label: t("less-equals-than"), value: "le" },
      { label: t("greater-than"), value: "gt" },
      { label: t("greater-equals-than"), value: "ge" },
    ];
  }, [t]);

  return (
    <div className="flex w-full items-center gap-1">
      <Select
        value={filterOption}
        onValueChange={(option) => {
          column.setFilterValue((filterValue: string) =>
            changeFilterOption(filterValue, option),
          );
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
      <DebouncedNumberInput
        value={value}
        className="min-w-20 flex-1 placeholder:text-muted-foreground/30"
        onChange={handleChange}
      />
    </div>
  );
};
