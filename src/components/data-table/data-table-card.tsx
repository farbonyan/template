"use client";

import type {
  Cell,
  ColumnFiltersState,
  Header,
  Row,
  Table,
} from "@tanstack/react-table";
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ChevronRight,
  ChevronsDownIcon,
  ChevronsUpIcon,
  MoreVerticalIcon,
  ReceiptTextIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type {
  BatchAction,
  ColumnDefType,
  DetailedRowProps,
  GlobalAction,
  RowAction,
} from "./types";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Loadable } from "~/components/ui/loadable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SlideOver } from "~/components/ui/slide-over";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useAutoAnimate } from "~/hooks/auto-animate";
import { cn } from "~/lib/utils";
import { Pagination } from "./pagination";
import { TableActions } from "./table-actions";
import { getChildrenActions, getVisibleActions } from "./utils";

type RowActionsProps<TData> = {
  row: Row<TData, TData>;
  actions: RowAction<TData>[];
  onClose: () => void;
};

const RowActions = <TData,>({
  row,
  actions,
  onClose,
}: RowActionsProps<TData>) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const visibleActions = React.useMemo(() => {
    return getVisibleActions(getChildrenActions(actions, selected), row);
  }, [actions, selected, row]);

  return (
    <>
      {!!selected.length && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setSelected((selected) => selected.slice(0, -1))}
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        </Button>
      )}
      {visibleActions.map((action) => {
        return (
          <li key={action.name} className="py-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start"
              disabled={
                typeof action.disabled === "function"
                  ? action.disabled(row)
                  : action.disabled
              }
              onClick={() => {
                if ("onClick" in action) {
                  onClose();
                  return action.onClick(row);
                }
                setSelected((selected) => [...selected, action.name]);
              }}
            >
              {action.icon && <action.icon className="me-2 size-4" />}
              <span>{action.name}</span>
              {!("onClick" in action) && (
                <ChevronRight className="ms-auto size-4 rtl:rotate-180" />
              )}
            </Button>
          </li>
        );
      })}
    </>
  );
};

type CardCellProps<TData> = {
  table: Table<TData>;
  cell: Cell<TData, unknown>;
};

const CardCell = <TData,>({ table, cell }: CardCellProps<TData>) => {
  const columnDef = cell.column.columnDef as ColumnDefType<TData>;
  const header =
    (columnDef.disableHeader ?? columnDef.card?.disableHeaderLabel)
      ? undefined
      : flexRender(cell.column.columnDef.header, {
          table,
          column: cell.column,
          header: { column: cell.column } as Header<TData, unknown>,
        });
  return (
    <div
      className={cn(
        "flex items-center justify-start overflow-hidden",
        columnDef.card?.classes?.row,
      )}
    >
      {header && (
        <div className="flex items-center gap-0.5 font-medium">
          {header}
          <span className="me-1">:</span>
        </div>
      )}
      <div
        className={cn(
          "flex-1 truncate *:text-start",
          cell.column.columnDef.filterFn === "text" && "*:truncate",
          columnDef.card?.classes?.cell,
        )}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </div>
  );
};

type RowCardProps<TData> = {
  table: Table<TData>;
  row: Row<TData, TData>;
  rowActions?: RowAction<TData>[];
  DetailedRow?: React.ComponentType<DetailedRowProps<TData>>;
  getShowDetails?: (row: Row<TData, TData>) => boolean;
  maxRows?: number;
  collapsible?: boolean;
  enableRowSelection?: boolean;
  enableIndex?: boolean;
  setOpenRowDetails: React.Dispatch<
    React.SetStateAction<Row<TData, TData> | undefined>
  >;
};

const RowCard = <TData,>({
  table,
  row,
  rowActions,
  DetailedRow,
  getShowDetails,
  setOpenRowDetails,
  enableRowSelection,
  maxRows = 4,
  collapsible,
}: RowCardProps<TData>) => {
  const t = useTranslations("components.data-table");
  const [parent] = useAutoAnimate();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState<{
    x: number;
    y: number;
  }>();
  const [translateX, setTranslateX] = React.useState<number>();
  const maxTransition = document.documentElement.clientWidth / 3;

  const visibleActions = React.useMemo(
    () =>
      rowActions?.filter((action) => {
        return typeof action.invisible === "function"
          ? !action.invisible(row)
          : !action.invisible;
      }),
    [row, rowActions],
  );

  const showDetails = DetailedRow && (getShowDetails?.(row) ?? true);
  const showOptions = showDetails ?? visibleActions?.length;
  const [imageCell, visibleCells] = React.useMemo(() => {
    const cells = row.getVisibleCells().sort((c1, c2) => {
      const o1 =
        (c1.column.columnDef as ColumnDefType<TData>).card?.order ??
        Number.POSITIVE_INFINITY;
      const o2 =
        (c2.column.columnDef as ColumnDefType<TData>).card?.order ??
        Number.POSITIVE_INFINITY;
      return o1 - o2;
    });
    const imageCell = cells.find((cell) => cell.column.id === "image");
    const visibleCells = cells.filter(
      (cell) => cell.column.id !== "image" && cell.column.id !== "index",
    );
    return [imageCell, visibleCells] as const;
  }, [row]);

  return (
    <li
      className="relative overflow-hidden overscroll-y-contain bg-muted"
      onTouchStart={(e) => {
        if (!showOptions || open) return;
        const touch = e.touches[0];
        if (!touch) return;
        setStartPosition({ x: touch.clientX, y: touch.clientY });
        setTranslateX(0);
      }}
      onTouchMove={(e) => {
        if (!showOptions || open) return;
        const touch = e.touches[0];
        if (!startPosition || !touch) return;
        if (Math.abs(touch.clientY - startPosition.y) > maxTransition) {
          setTranslateX(undefined);
          setStartPosition(undefined);
          return;
        }
        setTranslateX(
          Math.min(
            0,
            Math.max(touch.clientX - startPosition.x, -maxTransition),
          ),
        );
      }}
      onTouchEnd={() => {
        if (!showOptions || open) return;
        setStartPosition(undefined);
        setTranslateX((translate) => {
          if (translate && Math.abs(translate) >= maxTransition) {
            setOpen(true);
          }
          return undefined;
        });
      }}
      onTouchCancel={() => {
        if (!showOptions || open) return;
        setTranslateX(undefined);
        setStartPosition(undefined);
      }}
    >
      <div
        className={cn(
          "bg-background px-4 py-4",
          !translateX && "transition-transform",
        )}
        style={{
          transform: translateX ? `translateX(${translateX}px)` : undefined,
        }}
      >
        {enableRowSelection && (
          <Checkbox
            disabled={!row.getCanSelect()}
            checked={row.getIsSelected()}
            onCheckedChange={row.getToggleSelectedHandler()}
            className="data-[state=checked]:bg-table-checkbox-active"
          />
        )}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <div className="flex gap-2">
            {imageCell && <CardCell table={table} cell={imageCell} />}
            <div className="flex-1 space-y-2 overflow-hidden">
              {(collapsible
                ? visibleCells.slice(0, maxRows)
                : visibleCells
              ).map((cell) => {
                return <CardCell key={cell.id} table={table} cell={cell} />;
              })}
              <CollapsibleContent className="space-y-2">
                {collapsible &&
                  visibleCells.slice(maxRows).map((cell) => {
                    return <CardCell key={cell.id} table={table} cell={cell} />;
                  })}
              </CollapsibleContent>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "mt-2 w-full",
                (!collapsible || visibleCells.length <= maxRows) && "hidden",
              )}
            >
              {expanded ? (
                <ChevronsUpIcon className="size-4" />
              ) : (
                <ChevronsDownIcon className="size-4" />
              )}
              <span>{t(expanded ? "show-less" : "show-more")}</span>
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "absolute end-1 top-1 size-6 p-1",
                !showOptions && "hidden",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4">
            <VisuallyHidden>
              <DrawerHeader>
                <DrawerTitle>{t("options")}</DrawerTitle>
                <DrawerDescription>{t("options")}</DrawerDescription>
              </DrawerHeader>
            </VisuallyHidden>
            <ul ref={parent} className="divide-y py-2">
              {rowActions && (
                <RowActions
                  row={row}
                  actions={rowActions}
                  onClose={() => setOpen(false)}
                />
              )}
              {showDetails && (
                <li className="py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setOpen(false);
                      setOpenRowDetails(row);
                    }}
                  >
                    <ReceiptTextIcon className="me-2 size-4" />
                    <span>{t("show-details")}</span>
                  </Button>
                </li>
              )}
            </ul>
          </DrawerContent>
        </Drawer>
      </div>
    </li>
  );
};

export type DataTableCardProps<TData> = {
  table: Table<TData>;

  /** Is data reloading */
  isRefreshing?: boolean;

  /** Table column filter state */
  columnFilters: ColumnFiltersState;

  /** Table override styles including colors */
  style?: React.CSSProperties;

  /** Create new record function */
  onCreate?: () => void;

  /** Refresh data function */
  onRefresh?: () => void;

  /** Array of actions that shows at the end of each row */
  rowActions?: RowAction<TData>[];

  /** Array of actions that shows in table header */
  globalActions?: GlobalAction<TData>[];

  /** Array of actions that shows if some rows where selected */
  batchActions?: BatchAction<TData>[];

  /** Is batch selected items */
  batchSelection: boolean;

  /** Sub rows getter */
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;

  /** Specifies which export functionalities should be present in table */
  exports?: {
    pdf?: boolean;
    excel?: boolean;
  };

  /** Export handler */
  onExport?: (type?: string) => void;

  /** Component that shows details of a row */
  DetailedRow?: React.ComponentType<DetailedRowProps<TData>>;

  /** Whether or not show the details of a row */
  getShowDetails?: (row: Row<TData, TData>) => boolean;

  /**
   * Maximum rows in card view
   *
   * @default 4
   */
  maxRows?: number;

  /**
   * Minimum rows to collapse in card view
   *
   * @default 4
   */
  minCollapsableRows?: number;

  /**
   * Enable text selection
   *
   * @default false
   */
  enableTextSelection?: boolean;

  /**
   * Enable table actions
   *
   * @default true
   */
  enableTableActions?: boolean;

  /**
   * Enable global filtering
   *
   * @default true
   */
  enableGlobalFilter?: boolean;

  /**
   * Enable row selection
   *
   * @default true
   */
  enableRowSelection?: boolean;

  /**
   * Enable multi row selection
   *
   * @default true
   */
  enableMultiRowSelection?: boolean;

  /**
   * Enable all row selection
   *
   * @default true
   */
  enableAllRowSelection?: boolean;

  /**
   * Enable full screen
   *
   * @default true
   */
  enableFullScreen?: boolean;

  /**
   * Enable column selection
   *
   * @default true
   */
  enableColumnSelection?: boolean;

  /**
   * Enable index column
   *
   * @default true
   */
  enableIndex?: boolean;

  /**
   * Enable footer
   *
   * @default true
   */
  enableFooter?: boolean;

  /**
   * Enable change page size
   *
   * @default true
   */
  enableChangePageSize?: boolean;

  /**
   * Enable change page
   *
   * @default true
   */
  enableChangePage?: boolean;
};

/**
 * Data table component
 *
 * @param props
 * @returns
 */
export const DataTableCard = <TData,>({
  table,
  columnFilters,
  style,
  rowActions,
  globalActions,
  batchActions,
  exports,
  onExport,
  getSubRows,
  onCreate,
  isRefreshing,
  onRefresh,
  DetailedRow,
  getShowDetails,
  maxRows = 4,
  minCollapsableRows = 4,
  batchSelection,
  enableTextSelection = false,
  enableTableActions = true,
  enableGlobalFilter = true,
  enableRowSelection = true,
  enableMultiRowSelection = true,
  enableAllRowSelection = true,
  enableFullScreen = true,
  enableColumnSelection = true,
  enableIndex = true,
  enableFooter = true,
  enableChangePage = true,
  enableChangePageSize = true,
}: DataTableCardProps<TData>) => {
  const [openRowDetails, setOpenRowDetails] =
    React.useState<Row<TData, TData>>();
  const [isZoomFullScreen, setIsZoomFullScreen] = React.useState(false);

  const rows = table.getRowModel().rows;

  return (
    <SlideOver
      classNames={{
        container: cn(
          "rounded-lg border bg-background",
          isZoomFullScreen && "fixed inset-0 z-50 rounded-none bg-background",
        ),
      }}
      open={!!openRowDetails}
      onClose={() => setOpenRowDetails(undefined)}
      SliderComponent={
        DetailedRow && openRowDetails && <DetailedRow row={openRowDetails} />
      }
    >
      <div className="relative flex h-full w-full flex-col" style={style}>
        {enableTableActions && (
          <TableActions
            table={table}
            onCreate={onCreate}
            onRefresh={onRefresh}
            exports={exports}
            onExport={onExport}
            hasSubRows={!!getSubRows}
            grouping={[]}
            batchSelection={batchSelection}
            columnFilters={columnFilters}
            isZoomFullScreen={isZoomFullScreen}
            setIsZoomFullScreen={setIsZoomFullScreen}
            batchActions={batchActions}
            globalActions={globalActions}
            enableRowSelection={enableRowSelection}
            enableMultiRowSelection={enableMultiRowSelection}
            enableAllRowSelection={enableAllRowSelection}
            enableFullScreen={enableFullScreen}
            enableGlobalFilter={enableGlobalFilter}
            enableColumnSelection={enableColumnSelection}
          />
        )}
        <Loadable loading={isRefreshing} className="flex-1 overflow-hidden">
          <ScrollArea className="relative h-full w-full [&>div>div]:!block [&>div>div]:h-full">
            <ul
              className={cn(
                "h-full *:border-b",
                enableTextSelection && "select-text",
              )}
            >
              {rows.map((row) => {
                return (
                  <RowCard
                    key={row.id}
                    table={table}
                    row={row}
                    rowActions={rowActions}
                    DetailedRow={DetailedRow}
                    getShowDetails={getShowDetails}
                    maxRows={maxRows}
                    collapsible={rows.length > minCollapsableRows}
                    enableRowSelection={enableRowSelection}
                    enableIndex={enableIndex}
                    setOpenRowDetails={setOpenRowDetails}
                  />
                );
              })}
            </ul>
          </ScrollArea>
        </Loadable>
        {enableFooter && (
          <div className="border-t bg-table-header p-2.5">
            {/* Border row to separate sticky footer */}
            {table
              .getFooterGroups()
              .flatMap((headerGroup) => headerGroup.headers)
              .map((header) => {
                const columnDef = header.column
                  .columnDef as ColumnDefType<TData>;
                if (!columnDef.footer || columnDef.card?.disableFooter) {
                  return null;
                }
                return (
                  <div
                    key={header.id}
                    className="flex items-center justify-start overflow-hidden text-sm"
                  >
                    {!columnDef.card?.disableFooterLabel && (
                      <div className="flex items-center gap-0.5">
                        {flexRender(header.column.columnDef.header, {
                          table,
                          column: header.column,
                          header,
                        })}
                        <span className="me-1">:</span>
                      </div>
                    )}
                    <div>
                      {flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <Pagination
          table={table}
          defaultPageSize={25}
          enableChangePage={enableChangePage}
          enableChangePageSize={enableChangePageSize}
        />
      </div>
    </SlideOver>
  );
};
