import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { useTranslations } from "next-intl";

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

export const SelectFilterInput = <TData,>({ column }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.filters.select");

  const options = React.useMemo(
    () => [...column.getFacetedUniqueValues().keys()] as string[],
    [column],
  );

  const filterValue = (column.getFilterValue() as string | undefined) ?? "";

  return (
    <div className="flex items-center gap-1">
      <Select
        value={filterValue}
        onValueChange={(option) => column.setFilterValue(option)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
