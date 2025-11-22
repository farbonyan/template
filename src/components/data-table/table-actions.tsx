import type {
  ColumnFiltersState,
  GroupingState,
  Table,
} from "@tanstack/react-table";
import * as React from "react";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  DownloadIcon,
  ExpandIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FilterIcon,
  ListMinusIcon,
  ListPlusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  ShrinkIcon,
  SlidersHorizontalIcon,
  SortDescIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import type { BatchAction, GlobalAction } from "./types";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useIsRtl } from "~/hooks/is-rtl";
import { cn } from "~/lib/utils";
import { ColumnContent } from "./column-content";
import { ColumnFilteringContent } from "./column-filtering";
import { ColumnSelector } from "./column-selector";
import { GlobalFilter } from "./global-filter";
import { exportRowsToExcel, exportRowsToPDF, getFlattenActions } from "./utils";

type Props<TData> = {
  table: Table<TData>;
  hasSubRows?: boolean;
  grouping: GroupingState;
  columnFilters: ColumnFiltersState;
  exports?: {
    pdf?: boolean;
    excel?: boolean;
  };
  onExport?: (type?: string) => void;
  onCreate?: () => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  isZoomFullScreen: boolean;
  setIsZoomFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  globalActions?: GlobalAction<TData>[];
  batchActions?: BatchAction<TData>[];
  batchSelection: boolean;
  enableFullScreen?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnSelection?: boolean;
  enableColumnFilters?: boolean;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  enableAllRowSelection?: boolean;
  globalActionModal?: React.ReactNode;
};

const sortIcons = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
  false: ArrowUpDownIcon,
};

export const TableActions = <TData,>({
  table,
  hasSubRows,
  grouping,
  columnFilters,
  exports = { pdf: true, excel: true },
  onExport,
  onCreate,
  isRefreshing,
  onRefresh,
  isZoomFullScreen,
  setIsZoomFullScreen,
  batchActions,
  globalActions,
  batchSelection,
  enableFullScreen = true,
  enableGlobalFilter = true,
  enableColumnSelection = true,
  enableColumnFilters = true,
  enableAllRowSelection = true,
  enableMultiRowSelection = true,
  enableRowSelection = true,
  globalActionModal,
}: Props<TData>) => {
  const t = useTranslations("components.data-table.header.actions");
  const formatter = useFormatter();
  const isRtl = useIsRtl();
  const [openPopoverFilters, setOpenPopoverFilters] = React.useState(false);
  const [openDrawerFilters, setOpenDrawerFilters] = React.useState(false);

  const handleExportToPDF = React.useCallback(() => {
    onExport?.("pdf");
    table.getIsSomeRowsSelected()
      ? exportRowsToPDF({
          filename: "Export",
          table,
          rows: table
            .getSelectedRowModel()
            .flatRows.filter(
              (row) => !row.isAggregated && !row.groupingColumnId,
            ),
          headers: table
            .getFlatHeaders()
            .filter((header) => !header.isPlaceholder),
          formatters: {
            date: (date) =>
              formatter.dateTime(date, { numberingSystem: "latn" }),
          },
          rtl: isRtl,
        })
      : exportRowsToPDF({
          filename: "Export",
          table,
          rows: table
            .getPrePaginationRowModel()
            .flatRows.filter(
              (row) => !row.isAggregated && !row.groupingColumnId,
            ),
          headers: table
            .getFlatHeaders()
            .filter((header) => !header.isPlaceholder),
          formatters: {
            date: (date) =>
              formatter.dateTime(date, { numberingSystem: "latn" }),
          },
          rtl: isRtl,
        });
  }, [onExport, table, formatter, isRtl]);

  const handleExportToExcel = React.useCallback(() => {
    onExport?.("excel");
    table.getIsSomeRowsSelected()
      ? exportRowsToExcel({
          filename: "Export",
          table,
          rows: table
            .getSelectedRowModel()
            .flatRows.filter(
              (row) => !row.isAggregated && !row.groupingColumnId,
            ),
          headers: table
            .getFlatHeaders()
            .filter((header) => !header.isPlaceholder),
          formatters: {
            date: (date) =>
              formatter.dateTime(date, { numberingSystem: "latn" }),
          },
        })
      : exportRowsToExcel({
          filename: "Export",
          table,
          rows: table
            .getPrePaginationRowModel()
            .flatRows.filter(
              (row) => !row.isAggregated && !row.groupingColumnId,
            ),
          headers: table
            .getFlatHeaders()
            .filter((header) => !header.isPlaceholder),
          formatters: {
            date: (date) =>
              formatter.dateTime(date, { numberingSystem: "latn" }),
          },
        });
  }, [table, onExport, formatter]);

  const isAllRowsExpanded = table.getIsAllRowsExpanded();

  const _globalActions = React.useMemo<
    (GlobalAction<TData> | BatchAction<TData>)[]
  >(() => {
    return batchSelection && batchActions
      ? batchActions
      : [
          ...(globalActions ?? []),
          {
            name: t("create-new"),
            icon: PlusIcon,
            priority: !globalActions?.find((action) => action.priority),
            invisible: !onCreate,
            onClick: onCreate,
          },
          {
            name: t("refresh"),
            icon: RefreshCwIcon,
            iconProps: { className: cn(isRefreshing && "animate-spin") },
            invisible: !onRefresh,
            disabled: isRefreshing,
            onClick: onRefresh,
          },
          {
            name: t("export"),
            icon: DownloadIcon,
            invisible: !exports.pdf && !exports.excel,
            children: [
              {
                name: t("export-to-pdf"),
                icon: FileTextIcon,
                invisible: !exports.pdf,
                onClick: handleExportToPDF,
              },
              {
                name: t("export-to-excel"),
                icon: FileSpreadsheetIcon,
                invisible: !exports.excel,
                onClick: handleExportToExcel,
              },
            ],
          },
          {
            name: isZoomFullScreen ? t("undo-zoom") : t("zoom-to-fullscreen"),
            icon: isZoomFullScreen ? ShrinkIcon : ExpandIcon,
            invisible: !enableFullScreen,
            onClick: () => setIsZoomFullScreen((isZoom) => !isZoom),
          },
        ];
  }, [
    batchSelection,
    batchActions,
    globalActions,
    t,
    onCreate,
    isRefreshing,
    onRefresh,
    exports.excel,
    exports.pdf,
    handleExportToPDF,
    handleExportToExcel,
    isZoomFullScreen,
    enableFullScreen,
    setIsZoomFullScreen,
  ]);

  const flattenGlobalActions = React.useMemo(
    () => getFlattenActions(_globalActions),
    [_globalActions],
  );

  const priorityFlattenGlobalActions = React.useMemo(
    () => flattenGlobalActions.filter((action) => action.priority),
    [flattenGlobalActions],
  );

  const nonePriorityFlattenGlobalActions = React.useMemo(
    () =>
      flattenGlobalActions.filter((action) => {
        if (!!action.priority || !action.onClick) return false;
        const invisible =
          typeof action.invisible === "function"
            ? action.invisible(
                table
                  .getSelectedRowModel()
                  .flatRows.filter((row) => !row.isAggregated),
              )
            : action.invisible;
        return !invisible;
      }),
    [table, flattenGlobalActions],
  );

  const isTableEmpty = !table.getPreFilteredRowModel().flatRows.length;

  const sortableColumns = React.useMemo(() => {
    return table.getAllLeafColumns().filter((column) => column.getCanSort());
  }, [table]);

  return (
    <div className="flex items-center justify-between gap-2 border-b bg-background p-2">
      <div className="flex items-center gap-1">
        {(grouping.length > 0 || hasSubRows) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={table.getToggleAllRowsExpandedHandler()}
              >
                {isAllRowsExpanded ? (
                  <ListMinusIcon className="size-4" />
                ) : (
                  <ListPlusIcon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <span className="flex-1 truncate">
                  {isAllRowsExpanded ? t("collapse-all") : t("expand-all")}
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        {batchSelection &&
          enableRowSelection &&
          enableMultiRowSelection &&
          enableAllRowSelection && (
            <Label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input-border p-2 hover:bg-muted md:hidden">
              <Checkbox
                className="rounded-sm align-middle data-[state=checked]:bg-table-checkbox-active "
                checked={
                  table.getIsAllRowsSelected()
                    ? true
                    : table.getIsSomeRowsSelected()
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={(checkState) => {
                  if (checkState) {
                    return table.toggleAllRowsSelected(true);
                  }
                  return table.toggleAllRowsSelected(false);
                }}
              />
            </Label>
          )}
        <GlobalFilter
          table={table}
          disabled={isTableEmpty}
          enableGlobalFilter={enableGlobalFilter}
        />
      </div>
      <div className="hidden items-center gap-2 md:flex">
        {_globalActions.map((action) => {
          const invisible =
            typeof action.invisible === "function"
              ? action.invisible(
                  table
                    .getSelectedRowModel()
                    .flatRows.filter((row) => !row.isAggregated),
                )
              : action.invisible;
          if (!!invisible || (!action.children && !action.onClick)) return null;
          const { className, ...props } = action.iconProps ?? {};
          return (
            <React.Fragment key={action.name}>
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="hover:cursor-not-allowed">
                      {action.children ? (
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            disabled={action.disabled}
                            variant={action.variant ?? "outline"}
                            size="default"
                            className={cn(
                              "items-center",
                              action.active && "border-primary text-primary",
                            )}
                          >
                            <action.icon
                              className={cn("size-4", className)}
                              {...props}
                            />
                            {action.size === "md" && (
                              <p className="ms-2 hidden md:block">
                                {action.name}
                              </p>
                            )}
                            <ChevronDownIcon className="ms-1 size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      ) : (
                        <Button
                          type="button"
                          disabled={action.disabled}
                          variant={action.variant ?? "outline"}
                          size={action.size === "md" ? "default" : "icon"}
                          className={cn(
                            "items-center",
                            action.active && "border-primary text-primary",
                          )}
                          onClick={() => action.onClick?.(table)}
                        >
                          <action.icon
                            className={cn("size-4", className)}
                            {...props}
                          />
                          {action.size === "md" && (
                            <p className="ms-2 hidden md:block">
                              {action.name}
                            </p>
                          )}
                        </Button>
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.tooltip ?? action.name}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  {action.children?.map((action, index) => {
                    const invisible =
                      typeof action.invisible === "function"
                        ? action.invisible(
                            table
                              .getSelectedRowModel()
                              .flatRows.filter((row) => !row.isAggregated),
                          )
                        : action.invisible;
                    if (!!invisible || !action.onClick) return null;
                    const { className, ...props } = action.iconProps ?? {};
                    return (
                      <React.Fragment key={action.name}>
                        {action.separator && index && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          disabled={action.disabled}
                          className={cn(
                            "cursor-pointer gap-2",
                            action.active && "border-primary text-primary",
                          )}
                          onClick={() => action.onClick?.(table)}
                        >
                          <action.icon
                            className={cn("size-4", className)}
                            {...props}
                          />
                          <span>{action.name}</span>
                        </DropdownMenuItem>
                      </React.Fragment>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              {action.separator && (
                <Separator
                  orientation="vertical"
                  className="mx-1 h-8 w-px bg-muted-foreground/50"
                />
              )}
            </React.Fragment>
          );
        })}
        {enableColumnFilters && (
          <Popover
            modal
            open={openPopoverFilters}
            onOpenChange={setOpenPopoverFilters}
          >
            <Tooltip>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    disabled={isTableEmpty}
                    variant="outline"
                    className={cn(
                      "min-w-10 items-center gap-1 p-2",
                      columnFilters.length && "border-primary text-primary",
                    )}
                  >
                    {!!columnFilters.length && (
                      <div className="flex size-4 items-center justify-center rounded-lg bg-primary pt-px text-xs text-primary-foreground">
                        {formatter.number(columnFilters.length)}
                      </div>
                    )}
                    <FilterIcon
                      className={cn(
                        "size-4",
                        columnFilters.length && "fill-current",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent align="end" className="overflow-hidden p-0">
                <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]]:max-h-80 [&>div>div]:!block">
                  <ColumnFilteringContent
                    table={table}
                    onClose={() => setOpenPopoverFilters(false)}
                  />
                </ScrollArea>
              </PopoverContent>
              <TooltipContent>
                <p>{t("filter.hint")}</p>
              </TooltipContent>
            </Tooltip>
          </Popover>
        )}
        {!batchSelection && enableColumnSelection && (
          <ColumnSelector table={table} />
        )}
        {globalActionModal && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="hidden md:inline-flex"
              >
                <SlidersHorizontalIcon className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="max-w-max">
              {globalActionModal}
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="flex items-center gap-1 md:hidden">
        {priorityFlattenGlobalActions.map((action) => {
          const invisible =
            typeof action.invisible === "function"
              ? action.invisible(
                  table
                    .getSelectedRowModel()
                    .flatRows.filter((row) => !row.isAggregated),
                )
              : action.invisible;
          if (!!invisible || !action.onClick) return null;
          const { className, ...props } = action.iconProps ?? {};
          return (
            <React.Fragment key={action.name}>
              <Button
                type="button"
                variant={action.variant ?? "outline"}
                size="icon"
                onClick={() => action.onClick?.(table)}
                className={cn(action.active && "border-primary text-primary")}
              >
                <action.icon className={cn("size-4", className)} {...props} />
              </Button>
              {action.separator && (
                <Separator
                  orientation="vertical"
                  className="mx-1 h-8 w-px bg-muted-foreground/50"
                />
              )}
            </React.Fragment>
          );
        })}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn((isTableEmpty || batchSelection) && "hidden")}
            >
              <SortDescIcon className="size-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <ScrollArea className="h-auto overflow-y-auto">
              <ul className="space-y-2 p-2">
                {sortableColumns.map((column) => {
                  const Icon =
                    sortIcons[column.getIsSorted() as keyof typeof sortIcons];
                  return (
                    <Button
                      key={column.id}
                      type="button"
                      variant="ghost"
                      className="flex w-full items-center justify-between gap-4"
                      onClick={column.getToggleSortingHandler()}
                    >
                      <div>
                        <ColumnContent column={column} table={table} />
                      </div>
                      <Icon className="size-4" />
                    </Button>
                  );
                })}
              </ul>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
        {enableColumnFilters && (
          <Drawer open={openDrawerFilters} onOpenChange={setOpenDrawerFilters}>
            <DrawerTrigger asChild>
              <Button
                type="button"
                disabled={isTableEmpty}
                variant="outline"
                size="icon"
                className={cn(batchSelection && "hidden")}
              >
                <FilterIcon
                  className={cn(
                    "size-4",
                    columnFilters.length && "fill-current",
                  )}
                />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <ScrollArea className="h-auto overflow-y-auto">
                <ColumnFilteringContent
                  table={table}
                  onClose={() => setOpenDrawerFilters(false)}
                />
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}
        {!!nonePriorityFlattenGlobalActions.length && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button type="button" variant="outline" size="icon">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {nonePriorityFlattenGlobalActions.map((action) => {
                const { className, ...props } = action.iconProps ?? {};
                return (
                  <DropdownMenuItem
                    key={action.name}
                    disabled={action.disabled}
                    className={cn(
                      "cursor-pointer gap-2",
                      action.active && "border-primary text-primary",
                    )}
                    onClick={() => action.onClick?.(table)}
                  >
                    <action.icon
                      className={cn("size-4", className)}
                      {...props}
                    />
                    <span>{action.name}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
