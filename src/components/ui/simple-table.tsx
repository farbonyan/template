"use client";

import * as React from "react";
import { Collapsible } from "@radix-ui/react-collapsible";
import { ChevronsDownIcon, ChevronsUpIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ButtonProps } from "./button";
import { useResponsive } from "~/hooks/responsive";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { DebouncedTextInput } from "./debounced-text-input";
import { HighlightText } from "./highlight-text";
import { ScrollArea, ScrollBar } from "./scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type Column<TData> = {
  id: string;
  accessorFn?: (row: TData) => string;
  cell?: (info: {
    column: Column<TData>;
    row: TData;
    index: number;
  }) => React.ReactNode;
  header?: React.ReactNode;
  footer?: (info: {
    filteredData: TData[];
    column: Column<TData>;
  }) => React.ReactNode;
  classes?: {
    card?: string;
    cell?: string;
    header?: string;
    footer?: string;
  };
  table?: { hidden?: boolean };
  card?: {
    order?: number;
    disableHeaderLabel?: boolean;
    disableFooter?: boolean;
    disableFooterLabel?: boolean;
  };
};

type SimpleTableCardCellProps<TData> = {
  index: number;
  data: TData;
  search?: string;
  column: Column<TData>;
};

const SimpleTableCardCell = <TData,>({
  index,
  data,
  search,
  column,
}: SimpleTableCardCellProps<TData>) => {
  const cell = column.cell?.({ column, row: data, index });
  return (
    <div className={cn("flex items-start gap-2", column.classes?.cell)}>
      {column.header && !column.card?.disableHeaderLabel && (
        <div
          className={cn(
            "flex flex-nowrap items-center text-nowrap font-medium",
            column.classes?.header,
          )}
        >
          {column.header}
          <span>:</span>
        </div>
      )}
      <div className={cn("flex-1 overflow-hidden", column.classes?.card)}>
        {typeof cell === "string" ? (
          <HighlightText text={cell} highlight={search} />
        ) : (
          cell
        )}
      </div>
    </div>
  );
};

type SimpleTableCardProps<TData> = {
  index: number;
  data: TData;
  search?: string;
  columns: Column<TData>[];
  className?: string;
  maxRows?: number;
};

const SimpleTableCard = <TData,>({
  index,
  data,
  search,
  columns,
  className,
  maxRows = 4,
}: SimpleTableCardProps<TData>) => {
  const t = useTranslations("components.simple-table");
  const [expanded, setExpanded] = React.useState(false);

  return (
    <li className={cn("relative space-y-2 p-4", className)}>
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <div className="flex-1 space-y-2 overflow-hidden">
          {columns.slice(0, maxRows).map((column) => {
            return (
              <SimpleTableCardCell
                key={column.id}
                index={index}
                data={data}
                search={search}
                column={column}
              />
            );
          })}
          <CollapsibleContent className="space-y-2">
            {columns.slice(maxRows).map((column) => {
              return (
                <SimpleTableCardCell
                  key={column.id}
                  index={index}
                  data={data}
                  search={search}
                  column={column}
                />
              );
            })}
          </CollapsibleContent>
        </div>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "-mt-4 h-6 w-full translate-y-4 text-xs",
              columns.length <= maxRows && "hidden",
            )}
          >
            {expanded ? (
              <ChevronsUpIcon className="size-4" />
            ) : (
              <ChevronsDownIcon className="size-4" />
            )}
            <span>{t(expanded ? "show-less" : "show-more")}</span>
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </li>
  );
};

type GlobalAction = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  invisible?: boolean;
  className?: string;
  variant?: ButtonProps["variant"];
  onClick: () => void | Promise<void>;
};

type SimpleTableProps<TData> = {
  dir?: "ltr" | "rtl";
  columns: Column<TData>[];
  data: TData[];
  getRowId: (data: TData, index: number) => string;
  title?: React.ReactNode;
  label?: React.ReactNode;
  globalActions?: GlobalAction[];
  classes?: {
    wrapper?: string;
    head?: string;
    table?: string;
    header?: string;
    footer?: string;
    row?: string | ((row: TData) => string);
    label?: string;
    list?: string;
    card?: string;
  };
  cardView?: boolean;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  maxRows?: number;
};

const SimpleTable = <TData,>({
  dir,
  columns,
  data,
  title,
  label,
  getRowId,
  globalActions,
  classes,
  searchPlaceholder,
  cardView = true,
  enableSearch = true,
  maxRows,
}: SimpleTableProps<TData>) => {
  const { isMdUp } = useResponsive();
  const [search, setSearch] = React.useState("");

  const enableFooter = React.useMemo(
    () => columns.some((column) => column.footer),
    [columns],
  );

  const orderedColumns = React.useMemo(
    () =>
      [...columns].sort((a, b) => {
        const o1 = a.card?.order ?? Number.POSITIVE_INFINITY;
        const o2 = b.card?.order ?? Number.POSITIVE_INFINITY;
        return o1 - o2;
      }),
    [columns],
  );

  const filteredData = React.useMemo(() => {
    if (!enableSearch || !search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((row) => {
      return columns.some((column) => {
        return column.accessorFn?.(row).toLowerCase().includes(lowerSearch);
      });
    });
  }, [columns, data, enableSearch, search]);

  if (!isMdUp && cardView) {
    return (
      <div
        dir={dir}
        className={cn(
          "flex flex-col divide-y overflow-hidden border bg-background shadow-md",
          classes?.wrapper,
        )}
      >
        {enableSearch && (
          <div className="flex items-center justify-between gap-1 bg-background p-2">
            <DebouncedTextInput
              className="max-w-48"
              value={search}
              onChange={(value: string) => setSearch(value)}
              PrefixIcon={SearchIcon}
              placeholder={searchPlaceholder}
              cancelable
            />
            <div>
              {globalActions?.map((action) => {
                if (action.invisible) return null;
                return (
                  <Button
                    key={action.name}
                    size="sm"
                    variant={action.variant ?? "ghost"}
                    className={action.className}
                    onClick={action.onClick}
                  >
                    <action.icon className="size-4" />
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        {label && (
          <div
            className={cn("bg-table-header p-2 text-center", classes?.label)}
          >
            {label}
          </div>
        )}
        <ScrollArea className="flex-1 [&>div>div]:!block [&>div>div]:h-full">
          <ul className={cn("*:border-b", classes?.list)}>
            {filteredData.map((data, index) => {
              return (
                <SimpleTableCard
                  key={getRowId(data, index)}
                  index={index}
                  search={search}
                  data={data}
                  columns={orderedColumns}
                  maxRows={maxRows}
                  className={classes?.card}
                />
              );
            })}
          </ul>
        </ScrollArea>
        {enableFooter && (
          <div className="bg-table-header p-4">
            {columns
              .filter((column) => !column.card?.disableFooter && column.footer)
              .map((column) => {
                return (
                  <div
                    key={column.id}
                    className={cn(
                      "flex items-center gap-2",
                      column.classes?.footer,
                    )}
                  >
                    {column.header && !column.card?.disableFooterLabel && (
                      <div className="flex flex-nowrap items-center text-nowrap">
                        {column.header}
                        <span>:</span>
                      </div>
                    )}
                    {column.footer?.({ filteredData, column })}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={cn(
        "flex flex-col divide-y overflow-hidden rounded-lg border bg-background",
        classes?.wrapper,
      )}
    >
      {enableSearch && (
        <div
          className={cn(
            "flex items-center justify-between gap-1 bg-background p-2",
            classes?.head,
          )}
        >
          {title && <p className="flex-1">{title}</p>}
          <DebouncedTextInput
            className="max-w-48"
            value={search}
            onChange={(value: string) => setSearch(value)}
            PrefixIcon={SearchIcon}
            placeholder={searchPlaceholder}
            cancelable
          />
          {globalActions && (
            <div>
              {globalActions.map((action) => {
                if (action.invisible) return null;
                return (
                  <Button
                    key={action.name}
                    size="sm"
                    variant={action.variant ?? "ghost"}
                    className={action.className}
                    onClick={action.onClick}
                  >
                    <action.icon className="size-4" />
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
      <ScrollArea className="flex-1 [&>div>div]:h-full">
        <Table dir={dir} className={cn("h-full", classes?.table)}>
          <TableHeader
            className={cn(
              "sticky top-0 z-30 bg-table-header shadow-md [&_tr]:border-b-0 [&_tr]:bg-table-header",
              classes?.header,
            )}
          >
            <TableRow>
              {columns
                .filter((column) => !column.table?.hidden)
                .map((column) => {
                  return (
                    <TableHead
                      key={column.id}
                      className={column.classes?.header}
                    >
                      {column.header}
                    </TableHead>
                  );
                })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((data, index) => {
              return (
                <TableRow
                  key={getRowId(data, index)}
                  className={cn(
                    "h-px hover:bg-table-row-active/50",
                    typeof classes?.row === "function"
                      ? classes.row(data)
                      : classes?.row,
                  )}
                >
                  {columns
                    .filter((column) => !column.table?.hidden)
                    .map((column) => {
                      const cell = column.cell?.({ column, row: data, index });
                      return (
                        <TableCell
                          key={column.id}
                          className={column.classes?.cell}
                        >
                          {typeof cell === "string" ? (
                            <HighlightText text={cell} highlight={search} />
                          ) : (
                            cell
                          )}
                        </TableCell>
                      );
                    })}
                </TableRow>
              );
            })}
            <TableRow className="h-[calc(100%-1px)]"></TableRow>
          </TableBody>
          {enableFooter && (
            <TableFooter
              className={cn(
                "sticky -bottom-px z-30 border-b-0 bg-table-header text-muted-foreground shadow-sm",
                classes?.footer,
              )}
            >
              <TableRow className="h-px border-b-0">
                {columns
                  .filter((column) => !column.table?.hidden)
                  .map((column) => {
                    return (
                      <TableCell
                        key={column.id}
                        className={column.classes?.footer}
                      >
                        {column.footer?.({ filteredData, column })}
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export { SimpleTable, type Column, type GlobalAction, type SimpleTableProps };
