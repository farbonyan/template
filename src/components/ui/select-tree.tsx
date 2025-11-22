"use client";

import * as React from "react";
import { DotIcon, Minus, Plus } from "lucide-react";

import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { HighlightText } from "./highlight-text";
import { Label } from "./label";

type SelectTreeItemType = {
  id: string;
  content: React.ReactNode;
  _children?: SelectTreeItemType[];
};

type SelectTreeItemProps = {
  item: SelectTreeItemType;
  search?: string;
  expandAll?: boolean;
} & (
  | {
      multiple: true;
      value: string[];
      onValueChange: (value: string[]) => void;
    }
  | {
      multiple?: false;
      value: string | undefined;
      onValueChange: (value: string | undefined) => void;
    }
);

type SelectTreeProps = {
  items: SelectTreeItemType[];
  search?: string;
  expandAll?: boolean;
} & (
  | {
      multiple: true;
      value: string[];
      onValueChange: (value: string[]) => void;
    }
  | {
      multiple?: false;
      value: string | undefined;
      onValueChange: (value: string | undefined) => void;
    }
);

type SelectInnerTreeProps = SelectTreeProps;

const getFlatChildren = (
  children: SelectTreeItemType[],
): SelectTreeItemType[] => {
  return children.flatMap((child) =>
    child._children ? getFlatChildren(child._children) : [child],
  );
};

const getFilteredItems = (
  items: SelectTreeItemType[],
  search: string,
): SelectTreeItemType[] => {
  return items
    .map((item) => {
      if (typeof item.content !== "string") return null;
      const match = item.content
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
      if (match) return item;
      if (!item._children) return null;
      const _children = getFilteredItems(item._children, search);
      if (!_children.length) return null;
      return {
        ...item,
        _children,
      };
    })
    .filter((item): item is SelectTreeItemType => !!item);
};

const SelectTreeItem = ({
  item,
  search,
  expandAll,
  multiple,
  value,
  onValueChange,
}: SelectTreeItemProps) => {
  const [expanded, setExpanded] = React.useState(!!expandAll);

  React.useEffect(() => {
    setExpanded(!!expandAll);
  }, [expandAll]);

  if (!item._children) {
    const selected = multiple ? value.includes(item.id) : value === item.id;
    return (
      <Label className="flex items-center gap-1 overflow-hidden leading-normal">
        <DotIcon className="size-4" />
        <Checkbox
          checked={selected}
          onCheckedChange={(checkState) => {
            multiple
              ? onValueChange(
                  checkState
                    ? [...value, item.id]
                    : value.filter((id) => id !== item.id),
                )
              : onValueChange(selected ? undefined : item.id);
          }}
        />
        {typeof item.content === "string" ? (
          <HighlightText
            text={item.content}
            highlight={search}
            className="flex-1 overflow-hidden text-ellipsis"
          />
        ) : (
          item.content
        )}
      </Label>
    );
  }

  const flatChildren = getFlatChildren(item._children);
  const flatChildrenIds = flatChildren.map((child) => child.id);
  const someChildrenSelected = flatChildrenIds.some((childId) =>
    multiple ? value.includes(childId) : value === childId,
  );
  const everyChildrenSelected = flatChildrenIds.every((childId) =>
    multiple ? value.includes(childId) : value === childId,
  );
  const checkState = everyChildrenSelected
    ? true
    : someChildrenSelected
      ? "indeterminate"
      : false;
  const Icon = expanded ? Minus : Plus;

  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-5"
          onClick={() => setExpanded((e) => !e)}
        >
          <Icon className="size-4" />
        </Button>
        {multiple && (
          <Checkbox
            checked={checkState}
            onCheckedChange={(checkState) => {
              onValueChange(
                checkState
                  ? Array.from(new Set([...value, ...flatChildrenIds]))
                  : value.filter((v) => !flatChildrenIds.includes(v)),
              );
            }}
          />
        )}
        {typeof item.content === "string" ? (
          <HighlightText
            text={item.content}
            highlight={search}
            className="flex-1 overflow-hidden text-ellipsis"
          />
        ) : (
          item.content
        )}
      </div>
      {expanded && (
        <SelectInnerTree
          items={item._children}
          search={search}
          expandAll={expandAll}
          multiple={multiple}
          value={value as never}
          onValueChange={onValueChange as never}
        />
      )}
    </>
  );
};

const SelectInnerTree = ({
  items,
  search,
  expandAll,
  multiple,
  value,
  onValueChange,
}: SelectInnerTreeProps) => {
  return (
    <ul className="ms-8 select-none space-y-3 first:ms-0">
      {items.map((item) => {
        return (
          <li key={item.id}>
            <SelectTreeItem
              item={item}
              search={search}
              expandAll={expandAll}
              multiple={multiple}
              value={value as never}
              onValueChange={onValueChange as never}
            />
          </li>
        );
      })}
    </ul>
  );
};

const SelectTree = ({ items, search, ...props }: SelectTreeProps) => {
  const filteredItems = search ? getFilteredItems(items, search) : items;

  return <SelectInnerTree items={filteredItems} search={search} {...props} />;
};
SelectTree.displayName = "SelectTree";

export { SelectTree, type SelectTreeItemType, type SelectTreeProps };
