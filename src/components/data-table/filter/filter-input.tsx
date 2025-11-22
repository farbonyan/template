import type { Column, Table } from "@tanstack/react-table";
import * as React from "react";

import { CheckboxFilterInput } from "./checkbox-filter-input";
import { DateFilterInput } from "./date-filter-input";
import { NumberFilterInput } from "./number-filter-input";
import { SelectFilterInput } from "./select-filter-input";
import { TextFilterInput } from "./text-filter-input";
import { getFilterInput } from "./utils";

type Props<TData> = {
  table: Table<TData>;
  column: Column<TData>;
};

export const FilterInput = <TData,>({ column }: Props<TData>) => {
  const filterInput = React.useMemo(() => getFilterInput(column), [column]);

  switch (filterInput) {
    case "number":
      return <NumberFilterInput column={column} />;
    case "text":
      return <TextFilterInput column={column} />;
    case "select":
      return <SelectFilterInput column={column} />;
    case "date":
      return <DateFilterInput column={column} />;
    case "checkbox":
      return <CheckboxFilterInput column={column} />;
  }
};
