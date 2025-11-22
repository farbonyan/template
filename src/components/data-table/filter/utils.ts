import type { Column } from "@tanstack/react-table";

export const getFilterInput = <TData>(column: Column<TData>) => {
  if (!column.getCanFilter()) return null;

  switch (column.columnDef.filterFn) {
    case "number":
      return "number";
    case "text":
      return "text";
    case "select":
      return "select";
    case "date":
      return "date";
    default:
      return "checkbox";
  }
};
