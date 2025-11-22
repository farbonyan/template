import type { Column, Table } from "@tanstack/react-table";
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useDrop } from "react-dnd";

import { Chip } from "~/components/ui/chip";
import { cn } from "~/lib/utils";

type Props<TData> = {
  table: Table<TData>;
  enableGrouping?: boolean;
};

export const GroupedHeaders = <TData,>({
  table,
  enableGrouping = true,
}: Props<TData>) => {
  const ref = React.useRef<React.ComponentRef<"div">>(null);
  const t = useTranslations("components.data-table.header.actions");

  const [{ isOver }, drop] = useDrop<Column<TData>, never, { isOver: boolean }>(
    {
      accept: "column",
      canDrop: (draggedColumn) => draggedColumn.getCanGroup(),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
      drop: (draggedColumn) => {
        if (draggedColumn.getIsGrouped()) return;
        draggedColumn.toggleGrouping();
      },
    },
  );

  React.useEffect(() => {
    drop(ref);
  }, [drop]);

  if (!enableGrouping) {
    return null;
  }

  const groupedHeaders = table
    .getHeaderGroups()
    .flatMap((headerGroup) => headerGroup.headers)
    .filter((header) => !header.isPlaceholder && header.column.getIsGrouped());

  return (
    <div
      ref={ref}
      className={cn(
        "hidden select-none border-b bg-muted/50 px-2 py-3 text-sm text-muted-foreground lg:block",
        isOver && "bg-muted",
      )}
    >
      <div className="flex items-center gap-1">
        {groupedHeaders.length === 0 && <span>{t("drag-to-group")}</span>}
        {groupedHeaders.map((header) => (
          <Chip
            key={header.id}
            label={flexRender(
              header.column.columnDef.header,
              header.getContext(),
            )}
            classes={{
              container: "bg-badge-blue border border-badge-blue-foreground",
              label: "text-badge-blue-foreground",
              icon: "bg-badge-blue-foreground text-badge-blue",
            }}
            onDelete={() => header.column.toggleGrouping()}
          />
        ))}
      </div>
    </div>
  );
};
