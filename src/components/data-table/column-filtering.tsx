import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { ColumnContent } from "./column-content";
import { FilterInput } from "./filter/filter-input";

type Props<TData> = {
  table: Table<TData>;
  onClose: () => void;
};

export const ColumnFilteringContent = <TData,>({
  table,
  onClose,
}: Props<TData>) => {
  const t = useTranslations("components.data-table.header.actions.filter");

  const filterableColumns = React.useMemo(() => {
    return table.getAllLeafColumns().filter((column) => column.getCanFilter());
  }, [table]);

  return (
    <div className="flex flex-col space-y-2 ~p-2/4">
      <div className="flex items-center justify-between">
        <p>{t("title")}</p>
        <Button
          type="button"
          variant="link"
          className="px-1 text-destructive"
          onClick={() => {
            table.resetColumnFilters();
            onClose();
          }}
        >
          {t("clear")}
        </Button>
      </div>
      <Accordion type="single" collapsible>
        {filterableColumns.map((column) => {
          return (
            <AccordionItem key={column.id} value={column.id}>
              <AccordionTrigger className="flex items-center text-muted-foreground ~py-4/3 hover:no-underline">
                <div className="flex-1 text-start text-xs font-normal">
                  <ColumnContent column={column} table={table} />
                </div>
                {column.getIsFiltered() && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      column.setFilterValue(undefined);
                    }}
                  >
                    <Trash2Icon className="size-3.5 text-destructive" />
                  </Button>
                )}
              </AccordionTrigger>
              <AccordionContent className="m-2">
                <FilterInput column={column} table={table} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
