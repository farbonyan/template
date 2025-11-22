"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  FoldVerticalIcon,
  SearchIcon,
  UnfoldVerticalIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { SelectTreeItemType } from "./select-tree";
import { useElementWidth } from "~/hooks/element-width";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Chip } from "./chip";
import { DebouncedTextInput } from "./debounced-text-input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import { SelectTree } from "./select-tree";
import { Separator } from "./separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type ComboboxTreeProps = {
  /** Placeholder for empty value */
  placeholder?: React.ReactNode;

  /** Placeholder for empty search */
  searchPlaceholder?: string;

  /** List of options to select */
  options: SelectTreeItemType[];

  /** Disabled */
  disabled?: boolean;

  /** Value is invalid */
  invalid?: boolean;

  /** List is expanded by default */
  defaultExpanded?: boolean;

  /** Optional className */
  className?: string;
} & (
  | {
      /** Single value */
      multiple?: false;
      /** Selected value */
      value: string | undefined;

      /** Set selected value handler */
      onValueChange: (value: string | undefined) => void;
    }
  | {
      /** Multiple values */
      multiple: true;

      /** Selected values */
      value: string[];

      /** Set selected values handler */
      onValueChange: (value: string[]) => void;
    }
);

const getSelectedOption = (
  options: SelectTreeItemType[],
  value: string | undefined,
): SelectTreeItemType | undefined => {
  if (!value) return undefined;
  for (const option of options) {
    if (option.id === value) return option;
    if (!option._children) continue;
    const selectedOption = getSelectedOption(option._children, value);
    if (selectedOption) return selectedOption;
  }
  return undefined;
};

const ComboboxTree = ({
  options,
  multiple,
  value,
  invalid,
  defaultExpanded,
  onValueChange,
  placeholder,
  searchPlaceholder,
  disabled,
  className,
}: ComboboxTreeProps) => {
  const t = useTranslations("components.combobox-tree");
  const [buttonRef, buttonWidth] =
    useElementWidth<React.ComponentRef<typeof Button>>();
  const [open, setOpen] = React.useState(false);
  const [expandedAll, setExpandedAll] = React.useState(defaultExpanded);
  const [search, setSearch] = React.useState("");
  const selectedOptions = multiple
    ? value.map((v) => getSelectedOption(options, v))
    : getSelectedOption(options, value);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            "w-full justify-between bg-input text-muted-foreground aria-[invalid=true]:border-destructive",
            className,
          )}
        >
          {multiple ? (
            <ul className="flex items-center gap-1 overflow-hidden">
              {!(selectedOptions as SelectTreeItemType[]).length && placeholder}
              {(selectedOptions as SelectTreeItemType[]).map((option) => (
                <Chip
                  key={option.id}
                  label={option.content}
                  onDelete={(e) => {
                    e.stopPropagation();
                    onValueChange(value.filter((v) => v !== option.id));
                  }}
                  classes={{
                    container:
                      "bg-badge-blue border border-badge-blue-foreground",
                    label:
                      "max-w-40 overflow-hidden text-ellipsis text-nowrap text-badge-blue-foreground",
                    icon: "bg-badge-blue-foreground text-badge-blue",
                  }}
                />
              ))}
            </ul>
          ) : (
            ((selectedOptions as SelectTreeItemType).content ?? placeholder)
          )}
          <div className="flex shrink-0 items-center justify-between">
            {multiple && value.length > 0 && (
              <XIcon
                className="mx-1 h-4 cursor-pointer text-muted-foreground"
                onClick={(event) => {
                  event.stopPropagation();
                  onValueChange([]);
                }}
              />
            )}
            <Separator orientation="vertical" className="flex h-full min-h-6" />
            <ChevronDownIcon className="-me-1 ms-2 size-4 cursor-pointer text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ minWidth: buttonWidth.clientWidth }}
        className="p-0"
      >
        <DebouncedTextInput
          tabIndex={-1}
          debounce={200}
          value={search}
          placeholder={searchPlaceholder}
          onChange={setSearch}
          className="border-0 focus-visible:ring-0"
          PrefixIcon={SearchIcon}
        />
        <ScrollArea className="p-1 [&>div]:max-h-[250px]">
          <SelectTree
            multiple={multiple as never}
            items={options}
            value={value as never}
            search={search}
            expandAll={expandedAll}
            onValueChange={(value: string | string[] | undefined) => {
              setOpen(!!multiple);
              setSearch("");
              onValueChange(value as never);
            }}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                className="absolute end-2 top-2 z-10"
                variant="ghost"
                size="icon"
                onClick={() => setExpandedAll((e) => !e)}
              >
                {expandedAll ? (
                  <FoldVerticalIcon className="size-4" />
                ) : (
                  <UnfoldVerticalIcon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="flex-1 truncate">
                {expandedAll ? t("collapse-all") : t("expand-all")}
              </span>
            </TooltipContent>
          </Tooltip>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export { ComboboxTree, type ComboboxTreeProps };
