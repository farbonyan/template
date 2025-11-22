import type {
  Column,
  FilterMeta,
  Header,
  Row,
  Table,
} from "@tanstack/react-table";
import * as React from "react";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { filterFns, sortingFns } from "@tanstack/react-table";
import ReactDOMServer from "react-dom/server";

import type {
  BatchAction,
  GlobalAction,
  MinMax,
  NumberFilterOption,
  RowAction,
  TextFilterOption,
  TNumberValue,
  TTextValue,
} from "./types";
import { exportExcel } from "~/utils/exports/excel";
import { exportTablePDF } from "~/utils/exports/pdf";

export const fuzzyFilter = <TData>(
  row: Row<TData, TData>,
  columnId: string,
  value: string,
  addMeta: (meta: FilterMeta) => void,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export const fuzzySort = <TData>(
  rowA: Row<TData, TData>,
  rowB: Row<TData, TData>,
  columnId: string,
) => {
  if (!rowA.columnFiltersMeta[columnId] || !rowB.columnFiltersMeta[columnId]) {
    return 0;
  }

  const dir = compareItems(
    rowA.columnFiltersMeta[columnId].itemRank,
    rowB.columnFiltersMeta[columnId].itemRank,
  );
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export const countSubRows = <TData>(rows: Row<TData, TData>[]): number => {
  return rows.reduce((count, row) => {
    if (row.subRows.length) {
      return count + countSubRows(row.subRows) + 1;
    }
    return count + 1;
  }, 0);
};

export const selectFilter = filterFns.includesString;

export const dateFilter = <TData>(
  row: Row<TData, TData>,
  columnId: string,
  filterValue: MinMax,
) => {
  const [min, max] = filterValue;
  const value = row.getValue<Date>(columnId);
  if (min && max) return value <= new Date(max) && value >= new Date(min);
  if (max) return value <= new Date(max);
  if (min) return value >= new Date(min);
  return true;
};

export const defaultTextFilterOption: TextFilterOption = "includesString";

export const parseTextFilterValue = (value: string | undefined) => {
  return value
    ? (JSON.parse(value) as TTextValue)
    : ([defaultTextFilterOption, ""] as TTextValue);
};

const textFilterFns = {
  includesString: filterFns.includesString,
  notIncludesString: <TData>(
    row: Row<TData, TData>,
    columnId: string,
    filterValue: string,
    addMeta: (meta: FilterMeta) => void,
  ) => !filterFns.includesString(row, columnId, filterValue, addMeta),
  equalsString: filterFns.equalsString,
};

export const textFilter = <TData>(
  row: Row<TData, TData>,
  columnId: string,
  filterValue: string,
  addMeta: (meta: FilterMeta) => void,
) => {
  const [filterOption, value] = parseTextFilterValue(filterValue);
  if (!filterOption || !value) {
    return true;
  }
  const filterFn = textFilterFns[filterOption];
  return filterFn(row, columnId, value, addMeta);
};

export const getTextFilterValue = <TData>(
  table: Table<TData>,
  column: Column<TData>,
) => {
  const globalFilter = table.getState().globalFilter as string;
  if (globalFilter) return globalFilter;

  const filterFn = column.getFilterFn();
  if (filterFn?.name !== textFilter.name) return undefined;

  const filterValue = column.getFilterValue();
  if (typeof filterValue === "string") {
    return parseTextFilterValue(filterValue)[1];
  }

  return undefined;
};

export const defaultNumberFilterOption: NumberFilterOption = "eq";

export const parseNumberFilterValue = (value: string | undefined) => {
  return value
    ? (JSON.parse(value) as TNumberValue)
    : ([defaultNumberFilterOption, undefined] as TNumberValue);
};

const numberFilterFns = {
  eq: filterFns.equals,
  ne: <TData>(
    row: Row<TData, TData>,
    columnId: string,
    filterValue: number,
    addMeta: (meta: FilterMeta) => void,
  ) => !filterFns.equals(row, columnId, filterValue, addMeta),
  lt: <TData>(
    row: Row<TData, TData>,
    columnId: string,
    filterValue: number,
  ) => {
    const value = row.getValue<number>(columnId);
    return value < filterValue;
  },
  le: <TData>(
    row: Row<TData, TData>,
    columnId: string,
    filterValue: number,
  ) => {
    const value = row.getValue<number>(columnId);
    return value <= filterValue;
  },
  gt: <TData>(
    row: Row<TData, TData>,
    columnId: string,
    filterValue: number,
  ) => {
    const value = row.getValue<number>(columnId);
    return value > filterValue;
  },
  ge: <TData>(
    row: Row<TData, TData>,
    columnId: string,
    filterValue: number,
  ) => {
    const value = row.getValue<number>(columnId);
    return value >= filterValue;
  },
  bw: filterFns.inNumberRange,
};

export const numberFilter = <TData>(
  row: Row<TData, TData>,
  columnId: string,
  filterValue: string,
  addMeta: (meta: FilterMeta) => void,
) => {
  const [filterOption, value] = parseNumberFilterValue(filterValue);
  if (!filterOption || typeof value !== "number") {
    return true;
  }
  const filterFn = numberFilterFns[filterOption];
  return filterFn(row, columnId, value, addMeta);
};

export const getCommonPinningStyles = <TData>(
  column: Column<TData>,
): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  if (!isPinned) return {};
  const isFirstLeftPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");
  const isLastRightPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");

  return {
    boxShadow: isFirstLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isLastRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "right" ? 0 : undefined,
    right: isPinned === "left" ? 0 : undefined,
    position: "sticky",
    backdropFilter: "blur(100px)",
    zIndex: 20,
  };
};

export const getFlattenActions = <TData>(
  actions: (GlobalAction<TData> | BatchAction<TData>)[],
): (GlobalAction<TData> | BatchAction<TData>)[] => {
  return actions.flatMap((action) =>
    action.children ? getFlattenActions(action.children) : [action],
  );
};

export const getVisibleActions = <TData>(
  actions: RowAction<TData>[],
  row: Row<TData, TData>,
): RowAction<TData>[] => {
  return actions.filter((action) => {
    const invisible =
      typeof action.invisible === "function"
        ? action.invisible(row)
        : action.invisible;
    if (invisible) return false;
    if ("children" in action) {
      return getVisibleActions(action.children, row).length > 0;
    }
    return true;
  });
};

export const getChildrenActions = <TData>(
  actions: RowAction<TData>[],
  selected: string[],
): RowAction<TData>[] => {
  if (!selected.length) {
    return actions;
  }
  const action = actions.find((action) => action.name === selected[0]);
  return action && "children" in action
    ? getChildrenActions(action.children, selected.slice(1))
    : actions;
};

export const getHeaderStringValue = <TData>(
  table: Table<TData>,
  header: Header<TData, unknown>,
) => {
  if (typeof header.column.columnDef.header === "string")
    return header.column.columnDef.header;
  if (typeof header.column.columnDef.header === "function") {
    // Call the function safely, assuming it's a simple render function
    try {
      const rendered = header.column.columnDef.header({
        table,
        header,
        column: header.column,
      }) as React.ReactNode;
      const htmlString = ReactDOMServer.renderToStaticMarkup(rendered);
      return htmlString.replace(/<[^>]+>/g, "").trim();
    } catch {
      return "-";
    }
  }
  if (React.isValidElement(header.column.columnDef.header)) {
    const htmlString = ReactDOMServer.renderToStaticMarkup(
      header.column.columnDef.header,
    );
    return htmlString.replace(/<[^>]+>/g, "").trim();
  }
  return header.column.columnDef.id ?? "-";
};

const getColumnStringValue = <TData>({
  row,
  columnId,
  formatters,
}: {
  row: Row<TData, TData>;
  columnId: string;
  formatters?: {
    date?: (date: Date) => string;
  };
}) => {
  const value = row.getValue(columnId);
  if (typeof value === "undefined" || typeof value === "function") {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }
  if (
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "string"
  ) {
    return value.toString();
  }
  if (value instanceof Date && formatters?.date) {
    return formatters.date(value);
  }
  return "";
};

export const exportRowsToPDF = <TData>({
  filename,
  rows,
  table,
  headers,
  formatters,
  rtl,
}: {
  filename: string;
  rows: Row<TData, TData>[];
  table: Table<TData>;
  headers: Header<TData, unknown>[];
  formatters?: {
    date?: (date: Date) => string;
  };
  rtl?: boolean;
}) => {
  const filteredHeaders = headers.filter(
    (header) => !["index", "image"].includes(header.column.id),
  );
  exportTablePDF({
    filename,
    headers: filteredHeaders.map((header) =>
      getHeaderStringValue(table, header),
    ),
    rows: rows.map((row) =>
      filteredHeaders.map((header) =>
        getColumnStringValue({ row, columnId: header.column.id, formatters }),
      ),
    ),
    rtl: rtl,
  });
};

export const exportRowsToExcel = <TData>({
  filename,
  table,
  rows,
  headers,
  formatters,
}: {
  filename: string;
  table: Table<TData>;
  rows: Row<TData, TData>[];
  headers: Header<TData, unknown>[];
  formatters?: {
    date?: (date: Date) => string;
  };
}) => {
  const expandedDepth = table.getExpandedDepth();
  const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] =
    [];
  if (expandedDepth) {
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: expandedDepth } });
    rows.forEach((row, index) => {
      merges.push({
        s: { r: index + 1, c: row.depth },
        e: { r: index + 1, c: expandedDepth },
      });
    });
  }
  const filteredHeaders = headers
    .filter((header) => !["index", "image"].includes(header.column.id))
    .map((header) => ({
      id: header.column.id,
      title: getHeaderStringValue(table, header),
    }));

  exportExcel({
    filename,
    merges,
    rows: rows.map((row) => {
      return Object.fromEntries([
        [
          row.depth && expandedDepth
            ? `__${row.depth - 1}__`
            : filteredHeaders[0]!.title,
          getColumnStringValue({
            row,
            columnId: filteredHeaders[0]!.id,
            formatters,
          }),
        ],
        ...filteredHeaders
          .slice(1)
          .map((header) => [
            header.title,
            getColumnStringValue({ row, columnId: header.id, formatters }),
          ]),
      ]) as Record<string, string>;
    }),
    options: {
      header: [
        filteredHeaders[0]!.title,
        ...Array.from({ length: expandedDepth }).map(
          (_, index) => `__${index}__`,
        ),
        ...filteredHeaders.slice(1).map((header) => {
          return header.title;
        }),
      ],
    },
  });
};
