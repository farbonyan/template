import type { Table } from "@tanstack/react-table";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { PageForm } from "./page-form";
import { RowsPerPageForm } from "./rows-per-page-form";

type Props<TData> = {
  table: Table<TData>;
  defaultPageSize: number;
  enableChangePage?: boolean;
  enableChangePageSize?: boolean;
};

export const Pagination = <TData,>({
  table,
  defaultPageSize,
  enableChangePage = true,
  enableChangePageSize = true,
}: Props<TData>) => {
  const t = useTranslations("components.data-table.pagination");

  if (!enableChangePage && !enableChangePageSize) {
    return null;
  }

  const state = table.getState();
  const filteredRowModel = table.getFilteredRowModel();

  const dataRowsCount = filteredRowModel.flatRows.length;
  const groupingCount = state.grouping.length
    ? table.getGroupedRowModel().rows.length
    : 0;
  const totalRowsCount = dataRowsCount + groupingCount;
  const canGoPrev = table.getCanPreviousPage();
  const canGoNext = table.getCanNextPage();
  const page = state.pagination.pageIndex + 1;
  const pages = table.getPageCount();

  return (
    <div className="flex select-none items-center justify-center gap-3 border-t p-2 text-sm md:justify-end">
      <div className="flex items-center gap-3">
        {enableChangePage && (
          <div className="flex items-center sm:gap-2">
            <span>{t("page", { page, pages: Math.max(pages, 1) })}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canGoPrev}
              onClick={table.firstPage}
            >
              <ChevronFirstIcon className="size-4 rtl:rotate-180" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canGoPrev}
              onClick={table.previousPage}
            >
              <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canGoNext}
              onClick={table.nextPage}
            >
              <ChevronRightIcon className="size-4 rtl:rotate-180" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canGoNext}
              onClick={table.lastPage}
            >
              <ChevronLastIcon className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        )}
        {enableChangePageSize && (
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2">
              <span className="text-nowrap">{t("go-to")}</span>
              <PageForm
                defaultPage={page}
                pages={pages}
                onSubmit={(page) => table.setPageIndex(page - 1)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>{t("rows-per-page")}</span>
              <RowsPerPageForm
                count={totalRowsCount}
                defaultRowsPerPage={defaultPageSize}
                onSubmit={(rowsPerPage) => table.setPageSize(rowsPerPage)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
