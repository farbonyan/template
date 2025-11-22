import * as React from "react";
import { XIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { TextInput } from "./text-input";

export type DebouncedTextInputProps = {
  /** Input value */
  value: string;

  /** Input change value handler */
  onChange: (value: string) => void;

  /** Clearable input */
  cancelable?: boolean;

  /** Debounce delay to call onChange after changing the value; default: 500 */
  debounce?: number;

  /** Wrapper class */
  wrapperClassName?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof TextInput>,
  "onChange" | "value"
>;

export const DebouncedTextInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  DebouncedTextInputProps
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
      (value: string) => {
        setValue(value);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          (value) => onChange(value),
          debounce,
          value,
        );
      },
      [debounce, onChange],
    );

    return (
      <div className={cn("relative", wrapperClassName)}>
        <TextInput
          ref={ref}
          {...props}
          value={value}
          className={cn("pe-6", className)}
          onChange={handleChange}
        />
        {cancelable && value && (
          <button
            type="button"
            className="absolute end-2 top-1/2 -translate-y-1/2"
            onClick={() => handleChange("")}
          >
            <XIcon className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
    );
  },
);
DebouncedTextInput.displayName = "DebouncedTextInput";
