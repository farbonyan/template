import type { Table } from "@tanstack/react-table";
import { BetweenVerticalStartIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ColumnContent } from "./column-content";

type Props<TData> = {
  table: Table<TData>;
};

export const ColumnSelector = <TData,>({ table }: Props<TData>) => {
  const t = useTranslations("components.data-table.header.actions");

  return (
    <Popover modal>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <BetweenVerticalStartIcon className="size-4" />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex h-72 flex-col p-0">
          <ScrollArea className="p-1">
            {table.getAllLeafColumns().map((column) => {
              if (!column.getCanHide() || !column.columnDef.header) {
                return null;
              }
              return (
                <Label
                  key={column.id}
                  className="flex cursor-pointer items-center justify-between p-2 hover:bg-muted"
                  htmlFor={`column-selector-${column.id}`}
                >
                  <ColumnContent column={column} table={table} />
                  <Switch
                    id={`column-selector-${column.id}`}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) =>
                      column.toggleVisibility(checked)
                    }
                  />
                </Label>
              );
            })}
          </ScrollArea>
        </PopoverContent>
        <TooltipContent>
          <p>{t("column-selector")}</p>
        </TooltipContent>
      </Tooltip>
    </Popover>
  );
};
