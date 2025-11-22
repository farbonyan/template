import type { RankingInfo } from "@tanstack/match-sorter-utils";

import type en from "./messages/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?:
      | "fuzzy"
      | "date"
      | "text"
      | "select"
      | "number"
      | "checkbox";
  }

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
    extends CoreRow<TData>,
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
