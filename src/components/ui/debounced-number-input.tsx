import * as React from "react";
import { XIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { NumberInput } from "./number-input";

export type DebouncedNumberInputProps = {
  /** Input value */
  value: number | undefined;

  /** Input change value handler */
  onChange: (value: number | undefined) => void;

  /** Clearable input */
  cancelable?: boolean;

  /** Debounce delay to call onChange after changing the value; default: 500 */
  debounce?: number;

  /** Wrapper class */
  wrapperClassName?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof NumberInput>,
  "onChange" | "value"
>;

export const DebouncedNumberInput = React.forwardRef<
  React.ComponentRef<typeof NumberInput>,
  DebouncedNumberInputProps
>(
  (
    {
      value: initialValue,
      onChange,
      debounce = 500,
      cancelable = true,
      className,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const timeoutRef = React.useRef<NodeJS.Timeout>();
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const handleChange = React.useCallback(
      (value: number | null | undefined) => {
        setValue(value ?? undefined);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          (value) => onChange(value ?? undefined),
          debounce,
          value,
        );
      },
      [debounce, onChange],
    );

    return (
      <div className={cn("relative", wrapperClassName)}>
        <NumberInput
          ref={ref}
          {...props}
          value={value}
          className={cn("pe-6", className)}
          onChange={handleChange}
        />
        {cancelable && typeof value !== "undefined" && (
          <button
            type="button"
            className="absolute end-2 top-1/2 -translate-y-1/2"
            onClick={() => handleChange(undefined)}
          >
            <XIcon className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
    );
  },
);
DebouncedNumberInput.displayName = "DebouncedNumberInput";
