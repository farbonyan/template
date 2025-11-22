import * as React from "react";
import {
  DotSquareIcon,
  ListMinusIcon,
  ListPlusIcon,
  MinusSquareIcon,
  PlusIcon,
  PlusSquareIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

import type { Tree, TreeNode } from "~/utils/array";
import { cn } from "~/lib/utils";
import {
  getFilteredItems,
  getFlatChildren,
  getFlatParents,
} from "~/utils/array";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DebouncedTextInput } from "./debounced-text-input";
import { HighlightText } from "./highlight-text";
import { LoadingSpinner } from "./loading";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type TableTreeItemProps = {
  search: string;
};

type TableTreeItem<T> = T & {
  id: string;
  component?: React.FC<TableTreeItemProps>;
  _children?: TableTreeItem<T>[];
};

type CheckboxTableTreeRowProps<T> = {
  item: TreeNode<TableTreeItem<T>>;
  getText: (item: TableTreeItem<T>) => string;
  search: string;
  indent: number;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  preValue?: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

const CheckboxTableTreeRow = <T,>({
  item,
  getText,
  search,
  indent = 0,
  expanded,
  setExpanded,
  preValue,
  value,
  onChange,
}: CheckboxTableTreeRowProps<T>) => {
  if (!item._children) {
    const checked = value.includes(item.id);
    const preChecked = preValue?.includes(item.id);
    return (
      <TableRow className="h-px hover:bg-table-row-active/50">
        <TableCell
          style={{ paddingInlineStart: `${indent * 2 + 2}rem` }}
          className="pe-2"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <DotSquareIcon className="mx-0.5 size-4 opacity-0" />
              <Checkbox
                checked={checked}
                onCheckedChange={(checkState) => {
                  if (checkState) {
                    return onChange([...value, item.id]);
                  }
                  onChange(value.filter((v) => v !== item.id));
                }}
                className="align-middle data-[state=checked]:bg-table-checkbox-active"
              />
            </div>
            {item.component ? (
              <item.component search={search} />
            ) : (
              <HighlightText
                text={getText(item)}
                highlight={search}
                className="line-clamp-1"
              />
            )}
            {preValue && (
              <>
                {checked && !preChecked && (
                  <PlusIcon className="size-4 text-success" />
                )}
                {!checked && preChecked && (
                  <XIcon className="size-4 text-destructive" />
                )}
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }

  const flatChildren = getFlatChildren(item._children);
  const flatChildrenIds = flatChildren.map((child) => child.id);
  const checkedAll = flatChildren.every((item) => value.includes(item.id));
  const checkedSome = flatChildren.some((item) => value.includes(item.id));
  const checkState = checkedAll ? true : checkedSome ? "indeterminate" : false;
  const isExpanded = expanded[item.id];

  return (
    <>
      <TableRow className="h-px hover:bg-table-row-active/50">
        <TableCell style={{ paddingInlineStart: `${indent * 2 + 2}rem` }}>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() =>
                setExpanded((expanded) => ({
                  ...expanded,
                  [item.id]: !expanded[item.id],
                }))
              }
            >
              {isExpanded ? (
                <MinusSquareIcon className="size-4" />
              ) : (
                <PlusSquareIcon className="size-4" />
              )}
            </Button>
            <Checkbox
              checked={checkState}
              onCheckedChange={(checkState) => {
                if (checkState) {
                  return onChange([...value, ...flatChildrenIds]);
                }
                onChange(value.filter((v) => !flatChildrenIds.includes(v)));
              }}
              className="align-middle data-[state=checked]:bg-table-checkbox-active"
            />
            {item.component ? (
              <item.component search={search} />
            ) : (
              <HighlightText
                text={getText(item)}
                highlight={search}
                className="line-clamp-1"
              />
            )}
          </div>
        </TableCell>
      </TableRow>
      {isExpanded &&
        item._children.map((subItem, index) => (
          <CheckboxTableTreeRow
            key={index}
            item={subItem}
            getText={getText}
            search={search}
            indent={indent + 1}
            expanded={expanded}
            setExpanded={setExpanded}
            value={value}
            preValue={preValue}
            onChange={onChange}
          />
        ))}
    </>
  );
};

type CheckboxTableTreeProps<T> = {
  label?: string;
  searchPlaceholder?: string;
  countLabel?: (count: number) => string;
  selectedLabel?: (selected: number) => string;
  items: Tree<TableTreeItem<T>>;
  getText: (item: TableTreeItem<T>) => string;
  className?: string;
  preValue?: string[];
  value: string[];
  onChange: (value: string[]) => void;
  onCreate?: () => void;
};

const CheckboxTableTree = <T,>({
  label,
  items,
  getText,
  searchPlaceholder,
  countLabel,
  selectedLabel,
  className,
  value,
  preValue,
  onChange,
  onCreate,
}: CheckboxTableTreeProps<T>) => {
  const [isPending, startTransition] = React.useTransition();
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [search, setSearch] = React.useState("");

  const filteredItems = React.useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return getFilteredItems(items, (item) =>
      getText(item).toLowerCase().includes(lowerSearch),
    );
  }, [items, getText, search]);
  const flatParents = React.useMemo(
    () => getFlatParents(filteredItems),
    [filteredItems],
  );
  const flatChildren = React.useMemo(
    () => getFlatChildren(filteredItems),
    [filteredItems],
  );
  const flatChildrenIds = React.useMemo(
    () => flatChildren.map((child) => child.id),
    [flatChildren],
  );
  const checkedAll = React.useMemo(() => {
    return flatChildren.every((item) => value.includes(item.id));
  }, [flatChildren, value]);
  const checkedSome = React.useMemo(() => {
    return flatChildren.some((item) => value.includes(item.id));
  }, [flatChildren, value]);
  const checkState = React.useMemo(() => {
    if (!filteredItems.length) return false;
    if (checkedAll) return true;
    if (checkedSome) return "indeterminate";
    return false;
  }, [checkedAll, checkedSome, filteredItems]);

  const expandedAll = React.useMemo(() => {
    return (
      Object.keys(expanded).filter((key) => expanded[Number(key)]).length > 0
    );
  }, [expanded]);

  React.useEffect(() => {
    setExpanded(
      search
        ? Object.fromEntries(flatParents.map((item) => [item.id, true]))
        : {},
    );
  }, [search, flatParents]);

  return (
    <div
      className={cn(
        "flex h-full flex-col divide-y rounded-sm border bg-background shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-1 bg-background p-2">
        <DebouncedTextInput
          className="max-w-48"
          value={search}
          onChange={(value: string) => setSearch(value)}
          PrefixIcon={SearchIcon}
          placeholder={searchPlaceholder}
        />
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
      <ScrollArea className="flex-1 [&>div>div]:h-full">
        <Table className="h-full">
          <TableHeader className="sticky top-0 z-30 shadow-sm">
            <TableRow className="bg-table-header">
              <TableHead>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      startTransition(() => {
                        setExpanded(
                          expandedAll
                            ? {}
                            : Object.fromEntries(
                                flatParents.map((item) => [item.id, true]),
                              ),
                        );
                      });
                    }}
                  >
                    {expandedAll ? (
                      <ListMinusIcon className="size-4" />
                    ) : (
                      <ListPlusIcon className="size-4" />
                    )}
                  </Button>
                  <Checkbox
                    className="align-middle data-[state=checked]:bg-table-checkbox-active"
                    checked={checkState}
                    onCheckedChange={(checkState) => {
                      if (checkState) {
                        return onChange(flatChildrenIds);
                      }
                      onChange(
                        value.filter((v) => !flatChildrenIds.includes(v)),
                      );
                    }}
                  />
                  <span>{label}</span>
                  {isPending && (
                    <LoadingSpinner className="my-0 stroke-primary" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item, index) => (
              <CheckboxTableTreeRow
                key={index}
                item={item}
                getText={getText}
                search={search}
                indent={0}
                expanded={expanded}
                setExpanded={setExpanded}
                value={value}
                preValue={preValue}
                onChange={onChange}
              />
            ))}
            <TableRow className="h-[calc(100%-1px)]"></TableRow>
          </TableBody>
          {countLabel && selectedLabel && (
            <TableFooter className="sticky -bottom-px z-30 border-b-0 bg-table-header shadow-sm">
              <TableRow className="h-px border-b-0">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{countLabel(flatChildrenIds.length)}</span>
                    <Separator
                      orientation="vertical"
                      className="h-4 bg-muted-foreground"
                    />
                    <span>{selectedLabel(value.length)}</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </ScrollArea>
    </div>
  );
};

export {
  CheckboxTableTree,
  type CheckboxTableTreeProps,
  type TableTreeItem,
  type TableTreeItemProps,
};
