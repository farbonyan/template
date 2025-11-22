"use client";

import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

type Props<TData> = {
  column: Column<TData, unknown>;
};

export const CheckboxFilterInput = <TData,>({ column }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.filters.boolean");
  const filterValue = column.getFilterValue() as boolean | undefined;
  const [checked, setChecked] = React.useState(filterValue);
  const [equals, setEquals] = React.useState(true);

  return (
    <div className="flex items-center justify-between gap-2 md:justify-normal">
      <Select
        value={equals ? "true" : "false"}
        onValueChange={(option) => {
          switch (option) {
            case "true":
              column.setFilterValue(checked);
              setEquals(true);
              return;
            case "false":
              column.setFilterValue(!checked);
              setEquals(false);
              return;
          }
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">{t("equals")}</SelectItem>
          <SelectItem value="false">{t("not-equals")}</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-1 items-center justify-center">
        <Switch
          className="data-[state=checked]:bg-table-checkbox-active"
          checked={checked}
          onCheckedChange={(checked) => {
            column.setFilterValue(equals ? checked : !checked);
            setChecked(checked);
          }}
        />
      </div>
    </div>
  );
};
