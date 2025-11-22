import type { Column, Header, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";

export type ColumnContentProps<TData> = {
  column: Column<TData>;
  table: Table<TData>;
};

export const ColumnContent = <TData,>({
  column,
  table,
}: ColumnContentProps<TData>) => {
  return (
    <div className="flex items-center gap-1">
      {column.parent && (
        <>
          <ColumnContent table={table} column={column.parent} />
          <ChevronRightIcon className="size-3 rtl:rotate-180" />
        </>
      )}
      {flexRender(column.columnDef.header, {
        table,
        column,
        header: { column } as Header<TData, unknown>,
      })}
    </div>
  );
};
