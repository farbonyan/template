import * as React from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DebouncedTextInput } from "./debounced-text-input";
import { LoadingSpinner } from "./loading";
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

const PAGE_SIZE = 100;

type Column<T, K extends keyof T> = {
  id: string;
  key: keyof T;
  header: string;
  cell: (info: { item: T; items: T[]; filteredItems: T[] }) => React.ReactNode;
  footer?: (info: {
    items: T[];
    filteredItems: T[];
    value: T[K][];
  }) => React.ReactNode;
};

type CheckboxTableProps<T, K extends keyof T> = {
  items: T[];
  columns: Column<T, K>[];
  idKey: K;
  searchPlaceholder?: string;
  value: T[K][];
  onChange: (value: T[K][]) => void;
  onCreate?: () => void;
  className?: string;
  enableSearch?: boolean;
  enableSelected?: boolean;
};

const CheckboxTable = <T, K extends keyof T>({
  items,
  columns,
  idKey,
  searchPlaceholder,
  value,
  onChange,
  onCreate,
  className,
  enableSearch = true,
  enableSelected = true,
}: CheckboxTableProps<T, K>) => {
  const t = useTranslations("components.checkbox-table");
  const scrollRef = React.useRef<React.ComponentRef<typeof ScrollArea>>(null);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [showSelected, setShowSelected] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState<T[]>(items);

  React.useEffect(() => {
    const filteredItems = items.filter((item) => {
      if (!search) return items;
      const lowerSearch = search.toLowerCase();
      return columns.some((column) => {
        const value = item[column.key];
        return (
          typeof value === "string" && value.toLowerCase().includes(lowerSearch)
        );
      });
    });
    if (showSelected) {
      setFilteredItems(
        filteredItems.filter((item) => value.includes(item[idKey])),
      );
    } else {
      setFilteredItems(filteredItems);
    }
    setPage(0); // Reset pagination when searching
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 1);
  }, [search, items, value, idKey, showSelected, columns]);

  const visibleItems = React.useMemo(() => {
    return filteredItems
      .map((item) => ({ ...item, isSelected: value.includes(item[idKey]) }))
      .slice(0, (page + 1) * PAGE_SIZE);
  }, [filteredItems, page, value, idKey]);

  const checkedAll = React.useMemo(() => {
    return filteredItems.every((item) => value.includes(item[idKey]));
  }, [filteredItems, idKey, value]);

  const checkedSome = React.useMemo(() => {
    return filteredItems.some((item) => value.includes(item[idKey]));
  }, [filteredItems, idKey, value]);

  const checkState = React.useMemo(() => {
    if (!filteredItems.length) return false;
    if (checkedAll) return true;
    if (checkedSome) return "indeterminate";
    return false;
  }, [checkedAll, checkedSome, filteredItems.length]);

  const { ref } = useInView({
    onChange: (inView) => {
      if (!inView) return;
      setPage((prev) => {
        if ((prev + 1) * PAGE_SIZE < filteredItems.length) {
          return prev + 1;
        }
        return prev;
      });
    },
    delay: 50,
    threshold: 0.9,
  });

  const hasMore =
    (page + 1) * PAGE_SIZE <
    (showSelected ? value.length : filteredItems.length);

  return (
    <div
      className={cn(
        "flex h-[400px] flex-col divide-y overflow-hidden rounded-md border bg-background shadow-md",
        className,
      )}
    >
      {(enableSearch || enableSelected) && (
        <div className="flex items-center justify-between gap-1 bg-background p-2">
          <div>
            {enableSearch && (
              <DebouncedTextInput
                tabIndex={-1}
                className="max-w-48"
                value={search}
                onChange={(value: string) => setSearch(value)}
                PrefixIcon={SearchIcon}
                placeholder={searchPlaceholder}
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            {enableSelected && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSelected((showSelected) => !showSelected)}
              >
                {showSelected ? t("hide") : t("show")}
              </Button>
            )}
            {onCreate && (
              <Button
                type="button"
                size="icon"
                variant="primary-outline"
                onClick={onCreate}
              >
                <PlusIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      <ScrollArea ref={scrollRef} className="flex-1 [&>div>div]:h-full">
        <Table className="h-full">
          <TableHeader className="sticky top-0 z-30 shadow-sm">
            <TableRow className="bg-table-header">
              <TableHead>
                <Checkbox
                  className="align-middle data-[state=checked]:bg-table-checkbox-active"
                  checked={checkState}
                  onCheckedChange={(checkState) => {
                    if (checkState) {
                      return onChange([
                        ...new Set([
                          ...value,
                          ...filteredItems.map((item) => item[idKey]),
                        ]),
                      ]);
                    }
                    onChange(
                      value.filter(
                        (k) => !filteredItems.some((item) => item[idKey] === k),
                      ),
                    );
                  }}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item, index) => (
              <TableRow
                key={index}
                className="h-px hover:bg-table-row-active/50"
              >
                <TableCell>
                  <Checkbox
                    checked={item.isSelected}
                    onCheckedChange={(checkState) => {
                      if (checkState) {
                        return onChange([...value, item[idKey]]);
                      }
                      onChange(value.filter((v) => v !== item[idKey]));
                    }}
                    className="align-middle data-[state=checked]:bg-table-checkbox-active"
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.cell({ item, items, filteredItems })}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {hasMore && (
              <TableRow ref={ref}>
                <TableCell colSpan={columns.length + 1}>
                  <LoadingSpinner color="secondary" className="m-auto size-8" />
                </TableCell>
              </TableRow>
            )}
            <TableRow className="h-[calc(100%-1px)]"></TableRow>
          </TableBody>
          <TableFooter className="sticky -bottom-px z-30 border-b-0 bg-table-header shadow-sm">
            <TableRow className="h-px border-b-0">
              <TableCell />
              {columns.map((column) => (
                <TableCell key={column.id} className="text-nowrap">
                  {column.footer?.({ items, filteredItems, value })}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export { CheckboxTable, type CheckboxTableProps, type Column };
