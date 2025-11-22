import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown, Wand2Icon, XCircle, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { Checkbox } from "./checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const multiSelectVariants = cva(
  "m-1 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 bg-card text-foreground hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Props for MultiSelectTable component
 */
type MultiSelectTableProps<T extends object> =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof multiSelectVariants> & {
      /**
       * An array of option objects to be displayed in the multi-select component.
       * Each option object has a label, value, and an optional icon.
       */
      options: T[];

      /**
       * Callback function triggered when the selected values change.
       * Receives an array of the new selected values.
       */
      onValueChange?: (value: string[]) => void;

      /** The default selected values when the component mounts. */
      defaultValue?: string[];

      /**
       * Get key from option
       */
      getKey: (option: T) => string;

      /**
       * Get label from option
       */
      getLabel: (option: T) => React.ReactNode;

      /**
       * Columns
       */
      columns: {
        id: string;
        header: React.ReactNode;
        cell: (item: T) => React.ReactNode;
      }[];

      /** Multi selectable */
      multiple?: boolean;

      /**
       * Placeholder text to be displayed when no values are selected.
       * Optional, defaults to "Select options".
       */
      placeholder?: string;

      /**
       * Animation duration in seconds for the visual effects (e.g., bouncing badges).
       * Optional, defaults to 0 (no animation).
       */
      animation?: number;

      /**
       * Maximum number of items to display. Extra selected items will be summarized.
       * Optional, defaults to 3.
       */
      maxCount?: number;

      /**
       * The modality of the popover. When set to true, interaction with outside elements
       * will be disabled and only popover content will be visible to screen readers.
       * Optional, defaults to false.
       */
      modalPopover?: boolean;

      /**
       * Popover align
       */
      align?: "start" | "end" | "center";

      /**
       * Popover side
       */
      side?: "bottom" | "left" | "right" | "top";

      /**
       * Additional class names to apply custom styles to the multi-select component.
       * Optional, can be used to add custom styles.
       */
      className?: string;
    };

const MultiSelectTable = <T extends object>({
  options,
  getKey,
  getLabel,
  columns,
  onValueChange,
  variant,
  defaultValue = [],
  placeholder,
  multiple = true,
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  align = "start",
  side = "bottom",
  className,
  ...props
}: MultiSelectTableProps<T>) => {
  const t = useTranslations("components.multiselect");
  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setSelectedValues(defaultValue);
  }, [defaultValue]);

  const toggleOption = (option: T) => {
    const key = getKey(option);
    setSelectedValues((selectedValues) => {
      const newSelectedValues = selectedValues.includes(key)
        ? selectedValues.filter((value) => value !== key)
        : multiple
          ? [...selectedValues, key]
          : [key];
      onValueChange?.(newSelectedValues);
      return newSelectedValues;
    });
  };

  const toggleAll = () => {
    setSelectedValues((selectedValues) => {
      const newSelectedValues =
        selectedValues.length === options.length
          ? []
          : options.map((option) => {
              const key = getKey(option);
              return key;
            });
      onValueChange?.(newSelectedValues);
      return newSelectedValues;
    });
  };

  const handleClear = () => {
    setSelectedValues([]);
    onValueChange?.([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const clearExtraOptions = () => {
    setSelectedValues((selectedValues) => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      onValueChange?.(newSelectedValues);
      return newSelectedValues;
    });
  };

  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
      modal={modalPopover}
    >
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant="outline"
          onClick={handleTogglePopover}
          className={cn(
            "flex h-auto min-h-10 w-full items-center justify-between rounded-md border border-input-border bg-input p-1 [&_svg]:pointer-events-auto",
            className,
          )}
        >
          {selectedValues.length > 0 ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-0.5">
                {selectedValues.slice(0, maxCount).map((value) => {
                  const option = options.find(
                    (option) => getKey(option) === value,
                  );
                  if (!option) return null;
                  return (
                    <Badge
                      key={value}
                      className={cn(
                        isAnimating ? "animate-bounce" : "",
                        multiSelectVariants({ variant }),
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {getLabel(option)}
                      <XCircle
                        className="ms-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(option);
                        }}
                      />
                    </Badge>
                  );
                })}
                {selectedValues.length > maxCount && (
                  <Badge
                    className={cn(
                      "border-foreground/1 bg-transparent text-foreground hover:bg-transparent",
                      isAnimating ? "animate-bounce" : "",
                      multiSelectVariants({ variant }),
                    )}
                    style={{ animationDuration: `${animation}s` }}
                  >
                    {t("more", { items: selectedValues.length - maxCount })}
                    <XIcon
                      className="ms-2 h-4 w-4 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearExtraOptions();
                      }}
                    />
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <XIcon
                  className="mx-2 h-4 cursor-pointer text-muted-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                />
                <Separator
                  orientation="vertical"
                  className="flex h-full min-h-6"
                />
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="mx-3 text-sm text-muted-foreground">
                {placeholder ?? t("placeholder")}
              </span>
              <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[var(--radix-popover-content-available-height)] w-min min-w-[var(--radix-popover-trigger-width)] p-0"
        align={align}
        side={side}
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {multiple && (
                  <Checkbox
                    checked={
                      selectedValues.length === options.length
                        ? true
                        : selectedValues.length > 0
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={toggleAll}
                  />
                )}
              </TableHead>
              {columns.map((column) => {
                return <TableHead key={column.id}>{column.header}</TableHead>;
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.map((option) => {
              const key = getKey(option);
              const isSelected = selectedValues.includes(key);
              return (
                <TableRow key={key}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOption(option)}
                    />
                  </TableCell>
                  {columns.map((column) => {
                    return (
                      <TableCell key={column.id}>
                        {column.cell(option)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </PopoverContent>
      {animation > 0 && selectedValues.length > 0 && (
        <Wand2Icon
          className={cn(
            "my-2 h-3 w-3 cursor-pointer bg-background text-foreground",
            isAnimating ? "" : "text-muted-foreground",
          )}
          onClick={() => setIsAnimating(!isAnimating)}
        />
      )}
    </Popover>
  );
};

export { MultiSelectTable, type MultiSelectTableProps };
