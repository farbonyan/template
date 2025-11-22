"use client";

import type { VisibilityState } from "@tanstack/react-table";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  BetweenVerticalStartIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExpandIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { ColumnDefType, Columns } from "./types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib//utils";

export type DataTableSkeletonProps<TData> = {
  /** Array of columns */
  columns: Columns<TData>;

  /** Default column visibility */
  defaultColumnVisibility?: VisibilityState;
};

/**
 * Data table skeleton component
 *
 * @param props
 * @returns
 */
export const DataTableSkeleton = <TData,>({
  columns,
  defaultColumnVisibility,
}: DataTableSkeletonProps<TData>) => {
  const t = useTranslations("components.data-table");
  const table = useReactTable({
    data: [],
    state: {
      columnVisibility: defaultColumnVisibility,
    },
    columns: columns,
    filterFns: {
      date: () => false,
      fuzzy: () => false,
      select: () => false,
      text: () => false,
      number: () => false,
    },
    aggregationFns: {
      countChild: () => false,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const globalActions = [
    {
      title: t("header.actions.create-new"),
      icon: PlusIcon,
      priority: true,
    },
    {
      title: t("header.actions.refresh"),
      icon: RefreshCwIcon,
      priority: true,
    },
    {
      title: t("header.actions.export"),
      icon: DownloadIcon,
    },
    {
      title: t("header.actions.zoom-to-fullscreen"),
      icon: ExpandIcon,
    },
    {
      title: t("header.actions.filter.title"),
      icon: FilterIcon,
      priority: true,
    },
    {
      title: t("header.actions.column-selector"),
      icon: BetweenVerticalStartIcon,
    },
  ];

  const [flatHeaders, hasPicture] = React.useMemo(() => {
    const flatHeaders = table.getFlatHeaders();
    const hasPicture = !!flatHeaders.find(
      (header) => header.column.id === "image",
    );
    return [flatHeaders, hasPicture] as const;
  }, [table]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border bg-background">
      <div className="relative flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-2 bg-background p-2">
          <div className="flex items-center overflow-hidden rounded-lg border border-input-border">
            <Input
              className="max-w-56 rounded-none border-none focus-visible:ring-0"
              disabled
              placeholder={t("header.actions.filter-all")}
            />
            <Button
              disabled
              type="button"
              size="sm"
              variant="outline"
              className="gap-0.5 rounded-none border-y-0 border-e-0 focus-visible:ring-0"
            >
              <ChevronDownIcon className="size-4" />
              <SearchIcon className="size-4" />
            </Button>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {globalActions.map((action) => {
              return (
                <Button
                  key={action.title}
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled
                >
                  <action.icon className="size-4" />
                </Button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 md:hidden">
            {globalActions
              .filter((action) => action.priority)
              .map((action) => {
                return (
                  <Button
                    key={action.title}
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled
                  >
                    <action.icon className="size-4" />
                  </Button>
                );
              })}
            <Button type="button" variant="outline" size="icon" disabled>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </div>
        </div>
        <div className="hidden select-none border-y bg-muted/50 px-2 py-3 text-sm text-muted-foreground lg:block">
          <div className="flex items-center gap-1">
            <span>{t("header.actions.drag-to-group")}</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Table className="hidden h-full md:table">
            <TableHeader className="sticky top-0 z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="py-2"
                    >
                      {!(header.column.columnDef as ColumnDefType<TData>)
                        .disableHeader &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 20 }).map((_, index) => {
                return (
                  <TableRow key={index}>
                    {flatHeaders.map((header) => (
                      <TableCell
                        key={header.id}
                        className={cn(header.column.id === "image" && "w-0")}
                      >
                        <Skeleton
                          className={cn(
                            "p-2",
                            header.column.id === "image"
                              ? "size-12 rounded-full"
                              : "h-8 w-full",
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              <TableRow className="h-full"></TableRow>
            </TableBody>
          </Table>
          <ul className="h-full *:border-b md:hidden">
            {Array.from({ length: 20 }).map((_, index) => {
              return (
                <li key={index} className="flex gap-2 px-4 py-4">
                  {hasPicture && <Skeleton className="size-16 rounded-full" />}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/5 p-2" />
                    <Skeleton className="h-4 w-4/5 p-2" />
                    <Skeleton className="h-4 w-2/5 p-2" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-3 border-t p-2 text-sm md:justify-end">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" disabled>
              <ChevronFirstIcon className="size-4 rtl:rotate-180" />
            </Button>
            <Button type="button" variant="ghost" size="icon" disabled>
              <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            </Button>
            <Button type="button" variant="ghost" size="icon" disabled>
              <ChevronRightIcon className="size-4 rtl:rotate-180" />
            </Button>
            <Button type="button" variant="ghost" size="icon" disabled>
              <ChevronLastIcon className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
