import type { Column } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import type { MinMax } from "../types";
import { parseNumberFilterValue, parseTextFilterValue } from "../utils";

type Props<TData> = {
  column: Column<TData>;
};

export const FilterValue = <TData,>({ column }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.filters");
  const filterFn = column.columnDef.filterFn;
  const filterValue = column.getFilterValue();

  if (filterFn === "number") {
    const [filterOption, value] = parseNumberFilterValue(filterValue as string);
    if (!filterOption) return "";
    return t(`number.labels.${filterOption}`, { value });
  }

  if (filterFn === "text") {
    const [filterOption, value] = parseTextFilterValue(filterValue as string);
    if (!filterOption) return "";
    return t(`text.labels.${filterOption}`, { value });
  }

  if (filterFn === "select") {
    return t(`select.labels.equals`, { value: filterValue as string });
  }

  if (filterFn === "date") {
    const [value1, value2] = filterValue as MinMax;
    if (value1 && !value2) {
      return t(`date.labels.more-than`, { value: value1 });
    }
    if (value2 && !value1) {
      return t(`date.labels.less-than`, { value: value2 });
    }
    return t(`date.labels.between`, { value1, value2 });
  }

  return (filterValue as boolean)
    ? t("boolean.labels.true")
    : t("boolean.labels.false");
};
