"use client";

import type {
  Column,
  ColumnPinningPosition,
  Header,
  Table,
} from "@tanstack/react-table";
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  FilterIcon,
  GroupIcon,
  PanelLeftOpenIcon,
  PanelRightOpenIcon,
  PinIcon,
  XSquareIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useDrag, useDrop } from "react-dnd";

import type { ColumnDefType } from "./types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { TableHead } from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { move } from "~/utils/array";
import { FilterValue } from "./filter/filter-value";
import { getCommonPinningStyles } from "./utils";

type Props<TData> = {
  table: Table<TData>;
  header: Header<TData, unknown>;
  rowSpan?: number;
  enableHeaderBorder?: boolean;
  enableColumnOrdering?: boolean;
  enableGrouping?: boolean;
};

const sortIcons = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
  false: ArrowUpDownIcon,
};

const sortContextIcons = {
  asc: ArrowDownNarrowWideIcon,
  desc: ArrowDownWideNarrowIcon,
};

export const DataTableHead = <TData,>({
  table,
  header,
  rowSpan = 1,
  enableHeaderBorder = false,
  enableColumnOrdering = true,
  enableGrouping = true,
}: Props<TData>) => {
  const t = useTranslations("components.data-table.header.actions");
  const ref = React.useRef<React.ComponentRef<typeof TableHead>>(null);

  const [, drop] = useDrop<Column<TData>>({
    accept: "column",
    drop: (draggedColumn) => {
      if (draggedColumn.id === header.column.id) return;
      table.setColumnOrder((columnOrder) => {
        const srcColumnIndex = columnOrder.indexOf(draggedColumn.id);
        const targetColumnIndex = columnOrder.indexOf(header.column.id);
        return move(columnOrder, srcColumnIndex, targetColumnIndex);
      });
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: "column",
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    item: () => header.column,
  });

  const canGroup = header.column.getCanGroup();
  const isGrouped = header.column.getIsGrouped();
  const canSort = header.column.getCanSort();
  const isSorted = header.column.getIsSorted();
  const canPin = header.column.getCanPin();
  const isPinned = header.column.getIsPinned();
  const isFiltered = header.column.getIsFiltered();

  const handlePin = React.useCallback(
    (pos: ColumnPinningPosition) => {
      if (isPinned === pos) {
        header.column.pin(false);
        return;
      }
      table.resetColumnPinning();
      header.column.pin(pos);
    },
    [header.column, isPinned, table],
  );

  const actions = React.useMemo(
    () => [
      {
        title: t("sort.asc"),
        icon: sortContextIcons.asc,
        selected: isSorted === "asc",
        disabled: !canSort,
        onClick: () =>
          isSorted === "asc"
            ? header.column.clearSorting()
            : header.column.toggleSorting(false, false),
      },
      {
        title: t("sort.desc"),
        icon: sortContextIcons.desc,
        selected: isSorted === "desc",
        disabled: !canSort,
        onClick: () =>
          isSorted === "desc"
            ? header.column.clearSorting()
            : header.column.toggleSorting(true, false),
      },
      {
        title: isPinned === "left" ? t("unpin-left") : t("pin-left"),
        icon: isPinned === "left" ? XSquareIcon : PanelLeftOpenIcon,
        separator: true,
        selected: isPinned === "left",
        disabled: !canPin,
        onClick: () => handlePin("left"),
      },
      {
        title: isPinned === "right" ? t("unpin-right") : t("pin-right"),
        icon: isPinned === "right" ? XSquareIcon : PanelRightOpenIcon,
        selected: isPinned === "right",
        disabled: !canPin,
        onClick: () => handlePin("right"),
      },
      {
        title: isGrouped ? t("ungroup") : t("group"),
        icon: GroupIcon,
        separator: true,
        selected: false,
        disabled: !canGroup,
        onClick: header.column.getToggleGroupingHandler(),
      },
    ],
    [
      t,
      header.column,
      canGroup,
      canPin,
      canSort,
      isGrouped,
      isPinned,
      isSorted,
      handlePin,
    ],
  );

  React.useEffect(() => {
    if (enableColumnOrdering) {
      drag(drop(preview(ref)));
      return;
    }
    if (enableGrouping) {
      drag(preview(ref));
    }
  }, [enableColumnOrdering, enableGrouping, drag, drop, preview]);

  const SuffixIcon = canSort
    ? sortIcons[isSorted as keyof typeof sortIcons]
    : undefined;

  return (
    <TableHead
      ref={ref}
      rowSpan={rowSpan}
      colSpan={header.colSpan}
      className={cn(
        "bg-border p-0 sm:p-0",
        enableHeaderBorder && "py-px pe-px sm:py-px sm:pe-px",
        isDragging && "opacity-50",
        canSort || canGroup
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-auto",
      )}
      style={{
        ...getCommonPinningStyles(header.column),
        top: -1,
        maxWidth: header.column.columnDef.maxSize,
        minWidth: header.column.columnDef.minSize,
      }}
      onClick={header.column.getToggleSortingHandler()}
    >
      <ContextMenu>
        <ContextMenuTrigger
          className="flex h-full w-full items-center justify-center bg-table-header ~px-2/4"
          onContextMenu={(e) => e.stopPropagation()}
        >
          <div className="flex flex-1 items-center gap-2">
            {isPinned && <PinIcon className="size-4 fill-inherit" />}
            <span
              data-placement="header"
              className={cn("group", enableHeaderBorder && "mx-auto")}
            >
              {!(header.column.columnDef as ColumnDefType<TData>)
                .disableHeader &&
                flexRender(header.column.columnDef.header, header.getContext())}
            </span>
            {SuffixIcon && <SuffixIcon className="size-4 shrink-0" />}
            {isGrouped && <GroupIcon className="size-4 shrink-0" />}
            {isFiltered && (
              <Tooltip>
                <TooltipTrigger>
                  <FilterIcon className="size-3 shrink-0 fill-current" />
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={20}>
                  <FilterValue column={header.column} />
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            {actions.map((action) => {
              if (action.disabled) return null;
              return (
                <React.Fragment key={action.title}>
                  {action.separator && <ContextMenuSeparator />}
                  <ContextMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                  >
                    <action.icon className="size-4" />
                    <span className="ms-2">{action.title}</span>
                  </ContextMenuItem>
                </React.Fragment>
              );
            })}
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </TableHead>
  );
};
