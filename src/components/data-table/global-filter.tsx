import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { DebouncedTextInput } from "~/components/ui/debounced-text-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ColumnContent } from "./column-content";

export type GlobalFilterProps<TData> = {
  table: Table<TData>;
  disabled?: boolean;
  enableGlobalFilter?: boolean;
};

export const GlobalFilter = <TData,>({
  table,
  disabled,
  enableGlobalFilter,
}: GlobalFilterProps<TData>) => {
  const t = useTranslations("components.data-table.header.actions");

  const globalFilterableColumns = React.useMemo(() => {
    return table
      .getAllLeafColumns()
      .filter((column) =>
        disabled
          ? !("enableGlobalFilter" in column.columnDef) ||
            column.columnDef.enableColumnFilter
          : column.getCanGlobalFilter(),
      );
  }, [table, disabled]);

  if (!enableGlobalFilter) return null;

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-input-border">
      <DebouncedTextInput
        className="max-w-56 rounded-none border-none focus-visible:ring-0"
        value={table.getState().globalFilter as string}
        onChange={(value: string | undefined) =>
          table.setGlobalFilter(value?.trim())
        }
        placeholder={t("filter-all")}
      />
      {!!globalFilterableColumns.length && (
        <Popover modal>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-0.5 rounded-none border-y-0 border-e-0 focus-visible:ring-0"
            >
              <ChevronDownIcon className="size-4" />
              <SearchIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="max-w-min ~p-2/4">
            <h3 className="text-nowrap font-medium">
              {t("filter-on-columns")}
            </h3>
            <ul className="mt-2 space-y-1">
              {globalFilterableColumns.map((column) => (
                <li
                  key={column.id}
                  className="text-nowrap text-sm font-normal text-muted-foreground"
                >
                  <ColumnContent column={column} table={table} />
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
