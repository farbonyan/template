"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { useElementWidth } from "~/hooks/element-width";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Option = {
  /** Option label */
  label: string;

  /** Option value */
  value: string;
};

type ComboboxProps = {
  /** Placeholder for empty value */
  placeholder?: React.ReactNode;

  /** Placeholder for empty search */
  searchPlaceholder?: string;

  /** Fallback text for empty search results */
  searchFallback?: React.ReactNode;

  /** List of options to select */
  options: Option[];

  /** Selected value */
  value: string | null | undefined;

  /** Value is invalid */
  invalid?: boolean;

  /** Value is disabled */
  disabled?: boolean;

  /** Set selected value handler */
  setValue?: (value: string | undefined) => void;
};

const Combobox = ({
  options,
  value,
  invalid,
  setValue,
  placeholder,
  searchPlaceholder,
  searchFallback,
  disabled,
}: ComboboxProps) => {
  const [buttonRef, buttonWidth] =
    useElementWidth<React.ComponentRef<typeof Button>>();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className="w-full justify-between overflow-hidden border-input-border bg-input text-muted-foreground aria-[invalid=true]:border-destructive"
          disabled={disabled}
        >
          <p className="overflow-hidden text-ellipsis text-sm">
            {options.find((option) => option.value === value)?.label ??
              placeholder}
          </p>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ minWidth: buttonWidth.clientWidth }}
        className="p-0"
      >
        <Command
          filter={(value, search) =>
            value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <CommandInput tabIndex={-1} placeholder={searchPlaceholder} />
          <CommandEmpty>{searchFallback}</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    setOpen(false);
                    value !== option.value && setValue?.(option.value);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "me-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
Combobox.displayName = "Combobox";

export { Combobox, type ComboboxProps, type Option };
