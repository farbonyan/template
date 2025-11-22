"use client";

import * as React from "react";
import { Calendar as CalendarIcon, XIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DatePickerProps = React.ComponentProps<typeof Calendar> &
  React.AriaAttributes & {
    display?: string;
    placeholder?: string;
    cancelable?: boolean;
    onBlur?: () => void;
  };

export const DatePicker = ({
  display,
  placeholder,
  cancelable,
  className,
  onBlur,
  ...props
}: DatePickerProps) => {
  const showPlaceholder = Array.isArray(props.value)
    ? !props.value.length
    : !props.value;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onChange(null);
  };

  return (
    <Popover onOpenChange={(open) => !open && onBlur?.()}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full",
            !props.value && "text-muted-foreground",
            props["aria-invalid"] && "border-destructive",
            className,
          )}
        >
          <div className="flex w-full items-center justify-start text-start font-normal">
            <CalendarIcon className="me-2 size-4" />
            {showPlaceholder ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              display
            )}
          </div>
          {cancelable && !showPlaceholder && (
            <XIcon className="ms-2 size-4" onClick={handleClear} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...props} />
      </PopoverContent>
    </Popover>
  );
};
