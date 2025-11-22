import type { CellContext } from "@tanstack/react-table";

import { HighlightText } from "~/components/ui/highlight-text";
import { getTextFilterValue } from "./utils";

type Props<TData> = CellContext<TData, unknown>;

export const DefaultCell = <TData,>({
  column,
  table,
  getValue,
  renderValue,
}: Props<TData>) => {
  const value = getValue();
  if (!(typeof value === "string")) {
    return renderValue();
  }
  const filterValue = getTextFilterValue(table, column);
  if (filterValue) {
    return <HighlightText text={value} highlight={filterValue} />;
  }
  return renderValue();
};
