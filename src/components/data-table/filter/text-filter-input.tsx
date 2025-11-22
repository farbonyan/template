import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { useTranslations } from "next-intl";

import { DebouncedTextInput } from "~/components/ui/debounced-text-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { defaultTextFilterOption, parseTextFilterValue } from "../utils";

type Props<TData> = {
  column: Column<TData, unknown>;
};

const changeValue = (
  filterValue: string | undefined,
  newValue: string | undefined,
) => {
  const [filterOption] = parseTextFilterValue(filterValue);
  return JSON.stringify([filterOption, newValue]);
};

const changeFilterOption = (
  filterValue: string | undefined,
  newFilterOption: string | undefined,
) => {
  const [, value] = parseTextFilterValue(filterValue);
  return JSON.stringify([newFilterOption ?? defaultTextFilterOption, value]);
};

export const TextFilterInput = <TData,>({ column }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.filters.text");

  const columnFilterValue = column.getFilterValue() as string | undefined;
  const [filterOption, value] = parseTextFilterValue(columnFilterValue);

  const handleChange = React.useCallback(
    (value: string | undefined) => {
      if (!value && !columnFilterValue) {
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
      {
        label: t("contains"),
        value: "includesString",
      },
      {
        label: t("not-contains"),
        value: "notIncludesString",
      },
      {
        label: t("equals"),
        value: "equalsString",
      },
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
      <DebouncedTextInput
        type="text"
        value={value ?? ""}
        className="min-w-20 flex-1 placeholder:text-muted-foreground/30"
        onChange={handleChange}
        wrapperClassName="w-full"
      />
    </div>
  );
};
