import type { RankingInfo } from "@tanstack/match-sorter-utils";
import type {
  AggregationFn,
  ColumnDef,
  ColumnFiltersRow,
  ColumnPinningRow,
  CoreRow,
  ExpandedRow,
  FilterFn,
  GroupingRow,
  CellContext as ReactTableCellContext,
  Row,
  RowData,
  RowPinningRow,
  RowSelectionRow,
  Table,
  VisibilityRow,
} from "@tanstack/react-table";
import type { LucideProps } from "lucide-react";

import type { ButtonProps } from "~/components/ui/button";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    date: FilterFn<unknown>;
    text: FilterFn<unknown>;
    select: FilterFn<unknown>;
    number: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }

  interface AggregationFns {
    countChild: AggregationFn<unknown>;
  }

  interface Row<TData extends RowData>
    extends
      CoreRow<TData>,
      VisibilityRow<TData>,
      ColumnPinningRow<TData>,
      RowPinningRow,
      ColumnFiltersRow<TData>,
      GroupingRow,
      RowSelectionRow,
      ExpandedRow {
    isAggregated?: boolean;
  }
}

/** Text filter option type */
export type TextFilterOption =
  | "includesString"
  | "notIncludesString"
  | "equalsString";

/** Text filter value type */
export type TTextValue = [TextFilterOption | undefined, string | undefined];

/** Range number type */
export type MinMax = [number | undefined, number | undefined];

/** Number filter option type */
export type NumberFilterOption = "eq" | "ne" | "lt" | "le" | "gt" | "ge";

/** Number filter value type */
export type TNumberValue = [NumberFilterOption | undefined, number | undefined];

/** Type of table column */
export type ColumnDefType<TData> = ColumnDef<TData> & {
  invisible?: boolean;
  disableHeader?: boolean;
  card?: {
    order?: number;
    classes?: { row?: string; cell?: string };
    disableHeaderLabel?: boolean;
    disableFooter?: boolean;
    disableFooterLabel?: boolean;
  };
};

/** Type of table columns */
export type Columns<TData> = ColumnDefType<TData>[];

export type CellContext<TData, TValue> = ReactTableCellContext<TData, TValue>;

/** Type of each row's action */
export type RowAction<TData> = {
  name: string;
  invisible?: boolean | ((row: Row<TData, TData>) => boolean);
  disabled?: boolean | ((row: Row<TData, TData>) => boolean);
  separator?: boolean | ((row: Row<TData, TData>) => boolean);
  icon?: React.ComponentType<{ className?: string }>;
  iconProps?: LucideProps;
} & (
  | {
      children: RowAction<TData>[];
    }
  | {
      primary?: boolean;
      onClick: (row: Row<TData, TData>) => void | Promise<void>;
    }
);

/** Type of table's global action */
export type GlobalAction<TData = unknown> = {
  name: string;
  invisible?: boolean;
  disabled?: boolean;
  separator?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconProps?: LucideProps;
  active?: boolean;
  priority?: boolean;
  size?: "sm" | "md";
  variant?: ButtonProps["variant"];
  tooltip?: string;
  onClick?: (table: Table<TData>) => void | Promise<void>;
  children?: GlobalAction<TData>[];
};

/** Type of table's batch action */
export type BatchAction<TData = unknown> = {
  name: string;
  invisible?: boolean | ((rows: Row<TData, TData>[]) => boolean);
  disabled?: boolean;
  separator?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconProps?: LucideProps;
  active?: boolean;
  priority?: boolean;
  size?: "sm" | "md";
  variant?: ButtonProps["variant"];
  tooltip?: string;
  onClick?: (table: Table<TData>) => void | Promise<void>;
  children?: BatchAction<TData>[];
};

/** Detailed row component props */
export type DetailedRowProps<TData = unknown> = {
  row: Row<TData, TData>;
};

export type { RowSelectionState } from "@tanstack/react-table";

export type UseSetting = <T extends string | number | boolean | object>(
  key: string,
  defaultValue: T,
) => readonly [
  T,
  (updater: T | ((preValue: T) => T)) => void,
  boolean | undefined,
];
