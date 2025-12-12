"use client";

import type {
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  GroupingState,
  OnChangeFn,
  Row,
  RowSelectionState,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useFormatter } from "next-intl";

import type {
  BatchAction,
  ColumnDefType,
  Columns,
  DetailedRowProps,
  GlobalAction,
  RowAction,
} from "./types";
import { Checkbox } from "~/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { SlideOver } from "~/components/ui/slide-over";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useSetting } from "~/contexts/settings";
import { usePreviousValue } from "~/hooks/previous-value";
import { useResponsive } from "~/hooks/responsive";
import { cn } from "~/lib/utils";
import { DataTableCard } from "./data-table-card";
import { DataTableHead } from "./data-table-head";
import { DataTableRow } from "./data-table-row";
import { DefaultCell } from "./default-cell";
import { getGroupedRowModel } from "./get-grouped-row-model";
import { GroupedHeaders } from "./grouped-headers";
import { Pagination } from "./pagination";
import { TableActions } from "./table-actions";
import {
  countSubRows,
  dateFilter,
  fuzzyFilter,
  fuzzySort,
  getCommonPinningStyles,
  numberFilter,
  selectFilter,
  textFilter,
} from "./utils";

export type DataTableRef<TData> = {
  /** Clear filters function */
  clearFilters: () => void;

  /** Clear selected rows function */
  clearSelected: () => void;

  /** Get selected rows function */
  getSelectedRows: () => Row<TData, TData>[];
};

export type DataTableProps<TData> = {
  /** Array of data */
  data: TData[];

  /** Class name */
  className?: string;

  /** Array of columns */
  columns: Columns<TData>;

  /** Table override styles including colors */
  style?: React.CSSProperties;

  /** Default row selection state */
  defaultRowSelection?: RowSelectionState;

  /** row selection state */
  rowSelection?: RowSelectionState;

  /** Default row selection state */
  setRowSelection?: OnChangeFn<RowSelectionState>;

  /** Get row id */
  getRowId?: (
    originalRow: TData,
    index: number,
    parent?: Row<TData, TData>,
  ) => string;

  /** Create new record function */
  onCreate?: () => void;

  /** Is data refreshing */
  isRefreshing?: boolean;

  /** Refresh data function */
  onRefresh?: () => void;

  /** Array of actions that shows at the end of each row */
  rowActions?: RowAction<TData>[];

  /** Array of actions that shows in table header */
  globalActions?: GlobalAction<TData>[];

  /** Array of actions that shows if some rows where selected */
  batchActions?: BatchAction<TData>[];

  /** Component that shows global actions in data */
  globalActionModal?: React.ReactNode;

  /** Sub rows getter */
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;

  /** Whether if sub rows are expanded by default or not */
  defaultExpanded?: ExpandedState;

  /** Default column visibility */
  defaultColumnVisibility?: VisibilityState;

  /** Default column filters */
  defaultColumnFilters?: ColumnFiltersState;

  /** Default grouping */
  defaultGrouping?: GroupingState;

  /**
   * Default page size
   *
   * @default 100
   */
  defaultPageSize?: number;

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

  /** Whether or not disable the checkbox of a row */
  getSelectDisabled?: (row: Row<TData, TData>) => boolean;

  /** Whether or not active style a row */
  getActiveRow?: (row: Row<TData, TData>) => boolean;

  /** Key to save configs in settings */
  settingsKey?: string;

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
   * Filter from leaf rows
   *
   * @default true
   */
  filterFromLeafRows?: boolean;

  /**
   * Enable exact search
   *
   * @default true
   */
  enableExactSearch?: boolean;

  /**
   * Enable header borders
   *
   * @default false
   */
  enableHeaderBorder?: boolean;

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
   * Enable filtering on columns
   *
   * @default true
   */
  enableColumnFilters?: boolean;

  /**
   * Enable global filtering
   *
   * @default true
   */
  enableGlobalFilter?: boolean;

  /**
   * Enable ordering on columns
   *
   * @default true
   */
  enableColumnOrdering?: boolean;

  /**
   * Enable grouping
   *
   * @default true
   */
  enableGrouping?: boolean;

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
   * Enable table pinning
   *
   * @default false
   */
  enablePinning?: boolean;

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
};

/**
 * Data table component
 *
 * @param props
 * @returns
 */
const InnerDataTable = <TData,>(
  {
    data,
    columns,
    style,
    className,
    defaultRowSelection,
    rowSelection,
    setRowSelection,
    getRowId,
    rowActions,
    globalActions,
    batchActions,
    globalActionModal,
    exports,
    getSubRows,
    onCreate,
    isRefreshing,
    onRefresh,
    onExport,
    DetailedRow,
    getShowDetails,
    getSelectDisabled,
    getActiveRow,
    defaultExpanded,
    defaultColumnVisibility,
    defaultGrouping,
    defaultColumnFilters,
    defaultPageSize = 100,
    maxRows = 4,
    minCollapsableRows = 4,
    settingsKey = "default",
    filterFromLeafRows = true,
    enableExactSearch = true,
    enableHeaderBorder = false,
    enableTextSelection = false,
    enableTableActions = true,
    enableGlobalFilter = true,
    enableColumnFilters = true,
    enableColumnOrdering = true,
    enableGrouping = true,
    enablePinning = true,
    enableRowSelection = true,
    enableMultiRowSelection = true,
    enableAllRowSelection = true,
    enableChangePageSize = true,
    enableChangePage = true,
    enableFullScreen = true,
    enableColumnSelection = true,
    enableIndex = true,
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<DataTableRef<TData>>,
) => {
  const formatter = useFormatter();
  const { isMdUp } = useResponsive();
  const defaultGroupingRef = React.useRef(defaultGrouping);
  const [storedColumnOrder, setStoredColumnOrder] = useSetting(
    `tables.${settingsKey}.columnOrder`,
    ["index", ...columns.filter((c) => !c.invisible).map((c) => c.id!)],
  );
  const [columnVisibility, setColumnVisibility] = useSetting(
    `tables.${settingsKey}.columnVisibility`,
    defaultColumnVisibility ?? {},
  );
  const [columnFilters, setColumnFilters] = React.useState(
    defaultColumnFilters ?? [],
  );
  const [grouping, setGrouping] = React.useState(
    defaultGroupingRef.current ?? [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [tableRowSelection, setTableRowSelection] = React.useState(
    defaultRowSelection ?? {},
  );
  const [expanded, setExpanded] = React.useState(defaultExpanded ?? {});
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    {},
  );
  const [openRowDetails, setOpenRowDetails] =
    React.useState<Row<TData, TData>>();
  const [isZoomFullScreen, setIsZoomFullScreen] = React.useState(false);

  const columnOrder = React.useMemo(() => {
    const actual = [
      "index",
      ...columns.filter((c) => !c.invisible).map((c) => c.id!),
    ];
    const merged = [
      ...storedColumnOrder.filter((id) => actual.includes(id)),
      ...actual.filter((id) => !storedColumnOrder.includes(id)),
    ];
    return merged;
  }, [storedColumnOrder, columns]);

  usePreviousValue(data, () => {
    if (Object.keys(tableRowSelection).length) {
      setTableRowSelection({});
    }
    if (rowSelection && Object.keys(rowSelection).length) {
      setRowSelection?.({});
    }
  });

  const table = useReactTable({
    data,
    columns: [
      {
        id: "index",
        header: "#",
        enableColumnFilter: false,
        enableSorting: false,
        aggregationFn: undefined,
        enableGlobalFilter: false,
        enableGrouping: false,
        invisible: !enableIndex,
        cell: ({ row, table }) => {
          const flatRows = table.getFilteredRowModel().flatRows;
          const index = flatRows.indexOf(row);
          return formatter.number(index + 1);
        },
      } as ColumnDefType<TData>,
      ...columns,
    ].filter((column) => !column.invisible),
    defaultColumn: {
      minSize: 0,
      cell: DefaultCell,
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    state: {
      columnOrder: enableColumnOrdering ? columnOrder : undefined,
      columnFilters,
      columnPinning,
      globalFilter,
      grouping,
      expanded,
      rowSelection: rowSelection ?? tableRowSelection,
      columnVisibility,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
      date: dateFilter,
      text: textFilter,
      select: selectFilter,
      number: numberFilter,
    },
    sortingFns: {
      fuzzy: fuzzySort,
    },
    aggregationFns: {
      countChild: (_: string, leafRows: Row<TData, TData>[]) => {
        return countSubRows(leafRows);
      },
    },
    enableMultiRowSelection,
    enableGrouping,
    enableGlobalFilter,
    enablePinning,
    filterFromLeafRows,
    globalFilterFn: enableExactSearch ? "includesString" : "fuzzy",
    groupedColumnMode: false,
    enableRowSelection: (row) => {
      return !row.groupingValue && !getSelectDisabled?.(row);
    },
    enableSubRowSelection: (row) => {
      return row.subRows.some((subRow) => !getSelectDisabled?.(subRow));
    },
    autoResetExpanded: false,
    manualPagination: !enableChangePage,
    getRowId,
    getSubRows,
    onExpandedChange: setExpanded,
    onColumnOrderChange: setStoredColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onColumnPinningChange: setColumnPinning,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection ?? setTableRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });
  const leafHeaders = React.useMemo(() => table.getLeafHeaders(), [table]);
  const hasFooter = React.useMemo(
    () => leafHeaders.some((header) => header.column.columnDef.footer),
    [leafHeaders],
  );
  const batchSelection =
    !!batchActions &&
    (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected());

  React.useImperativeHandle(ref, () => ({
    clearFilters: () => {
      table.setColumnFilters([]);
      table.setGlobalFilter("");
    },
    clearSelected: table.resetRowSelection,
    getSelectedRows: () => table.getSelectedRowModel().flatRows,
  }));

  React.useEffect(() => {
    table.setGrouping(isMdUp ? (defaultGroupingRef.current ?? []) : []);
    table.setPageSize(
      isMdUp ? defaultPageSize : Math.floor(defaultPageSize / 4),
    );
  }, [defaultGroupingRef, defaultPageSize, isMdUp, table]);

  if (!isMdUp) {
    return (
      <DataTableCard
        table={table}
        style={style}
        columnFilters={columnFilters}
        batchActions={batchActions}
        exports={exports}
        getShowDetails={getShowDetails}
        getSubRows={getSubRows}
        globalActions={globalActions}
        onCreate={onCreate}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onExport={onExport}
        rowActions={rowActions}
        batchSelection={batchSelection}
        DetailedRow={DetailedRow}
        maxRows={maxRows}
        minCollapsableRows={minCollapsableRows}
        enableTextSelection={enableTextSelection}
        enableTableActions={enableTableActions}
        enableRowSelection={enableRowSelection}
        enableMultiRowSelection={enableMultiRowSelection}
        enableAllRowSelection={enableAllRowSelection}
        enableGlobalFilter={enableGlobalFilter}
        enableColumnSelection={enableColumnSelection}
        enableFullScreen={enableFullScreen}
        enableIndex={enableIndex}
        enableFooter={hasFooter}
        enableChangePage={enableChangePage}
        enableChangePageSize={enableChangePageSize}
      />
    );
  }

  return (
    <SlideOver
      classNames={{
        container: cn(
          "rounded-lg border bg-background",
          isZoomFullScreen && "fixed inset-0 z-50 rounded-none",
          className,
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
            isRefreshing={isRefreshing}
            onRefresh={onRefresh}
            exports={exports}
            onExport={onExport}
            hasSubRows={!!getSubRows}
            grouping={grouping}
            columnFilters={columnFilters}
            isZoomFullScreen={isZoomFullScreen}
            setIsZoomFullScreen={setIsZoomFullScreen}
            batchActions={batchActions}
            batchSelection={batchSelection}
            globalActions={globalActions}
            enableFullScreen={enableFullScreen}
            enableGlobalFilter={enableGlobalFilter}
            enableColumnSelection={enableColumnSelection}
            enableColumnFilters={enableColumnFilters}
            enableRowSelection={enableRowSelection}
            enableMultiRowSelection={enableMultiRowSelection}
            enableAllRowSelection={enableAllRowSelection}
            globalActionModal={globalActionModal}
          />
        )}
        <GroupedHeaders table={table} enableGrouping={enableGrouping} />
        <ScrollArea className="relative w-full flex-1 [&>div>div]:h-full">
          <Table className={cn("h-full", enableTextSelection && "select-text")}>
            <TableHeader className="sticky top-0 z-30 shadow-sm [&_tr]:border-b-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="bg-table-header" key={headerGroup.id}>
                  {/* Columns for checkbox and grouping expand icons */}
                  <TableHead
                    colSpan={grouping.length + 1}
                    className={cn(
                      "bg-table-header",
                      enableRowSelection && enableMultiRowSelection
                        ? undefined
                        : "w-0 p-0 sm:p-0",
                    )}
                  >
                    {enableRowSelection &&
                      enableMultiRowSelection &&
                      enableAllRowSelection && (
                        <Checkbox
                          className="align-middle data-[state=checked]:bg-table-checkbox-active"
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
                            table.toggleAllRowsSelected(false);
                          }}
                        />
                      )}
                  </TableHead>
                  {headerGroup.headers.map((header) => {
                    const columnRelativeDepth =
                      header.depth - header.column.depth;
                    if (
                      !header.isPlaceholder &&
                      columnRelativeDepth > 1 &&
                      header.id === header.column.id
                    ) {
                      return null;
                    }
                    let rowSpan = 1;
                    if (header.isPlaceholder) {
                      const leafs = header.getLeafHeaders();
                      rowSpan = leafs[leafs.length - 1]!.depth - header.depth;
                    }

                    return (
                      <DataTableHead
                        key={header.id}
                        table={table}
                        header={header}
                        rowSpan={rowSpan}
                        columnOrder={columnOrder}
                        enableHeaderBorder={enableHeaderBorder}
                        enableColumnOrdering={enableColumnOrdering}
                        enableGrouping={enableGrouping}
                      />
                    );
                  })}
                  {/* Three dot column */}
                  <TableHead className="w-0 bg-table-header p-0" />
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <DataTableRow
                    key={row.id}
                    table={table}
                    row={row}
                    grouping={grouping}
                    actions={rowActions}
                    batchSelection={batchSelection}
                    enableRowSelection={enableRowSelection}
                    openRowDetails={openRowDetails}
                    getActiveRow={getActiveRow}
                    onShowDetails={
                      DetailedRow ? (row) => setOpenRowDetails(row) : undefined
                    }
                    getShowDetails={getShowDetails}
                  />
                );
              })}
              <TableRow className="h-[calc(100%-1px)]"></TableRow>
            </TableBody>
            {hasFooter && (
              <TableFooter className="sticky -bottom-px z-30 bg-table-header shadow-sm">
                {table.getFooterGroups().map((headerGroup) => {
                  const visible = !headerGroup.headers.some(
                    (header) => header.subHeaders.length,
                  );
                  if (!visible) return null;
                  return (
                    <TableRow key={headerGroup.id} className="h-px border-b-0">
                      {/* Columns for checkbox and grouping expand icons */}
                      <TableCell
                        colSpan={grouping.length + 1}
                        className={
                          enableRowSelection && enableMultiRowSelection
                            ? undefined
                            : "w-0 p-0 sm:p-0"
                        }
                      />
                      {headerGroup.headers.map((header) => (
                        <TableCell
                          key={header.id}
                          className="h-10 text-sm"
                          style={{
                            ...getCommonPinningStyles(header.column),
                            bottom: -1,
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                        </TableCell>
                      ))}
                      {/* Three dot column */}
                      <TableCell />
                    </TableRow>
                  );
                })}
              </TableFooter>
            )}
          </Table>
          <ScrollBar orientation="horizontal" className="z-30" />
        </ScrollArea>
        <Pagination
          table={table}
          defaultPageSize={defaultPageSize}
          enableChangePage={enableChangePage}
          enableChangePageSize={enableChangePageSize}
        />
      </div>
    </SlideOver>
  );
};

export const DataTable = React.forwardRef<
  DataTableRef<unknown>,
  DataTableProps<unknown>
>(InnerDataTable) as <TData>(
  p: DataTableProps<TData> & { ref?: React.ForwardedRef<DataTableRef<TData>> },
) => React.ReactElement;

(
  DataTable as unknown as React.ForwardRefExoticComponent<
    DataTableProps<unknown> & React.ForwardedRef<DataTableRef<unknown>>
  >
).displayName = "DataTable";
