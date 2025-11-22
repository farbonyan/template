import * as React from "react";

import { Input } from "./input";

export type DebouncedInputProps = (
  | {
      /** Input value */
      value: string;
      /** Input change value handler */
      onChange: (
        value: string,
        event: React.ChangeEvent<HTMLInputElement>,
      ) => void;
    }
  | {
      /** Input value */
      value: number | undefined;
      /** Input change value handler */
      onChange: (
        value: number | undefined,
        event: React.ChangeEvent<HTMLInputElement>,
      ) => void;
    }
) & {
  /** Debounce delay to call onChange after changing the value; default: 500 */
  debounce?: number;
} & Omit<React.ComponentPropsWithoutRef<typeof Input>, "onChange" | "value">;

export const DebouncedInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  DebouncedInputProps
>(({ value: initialValue, onChange, debounce = 500, ...props }, ref) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      ref={ref}
      {...props}
      value={value ?? ""}
      onChange={(e) => {
        const value =
          props.type === "number"
            ? Number.isNaN(e.target.valueAsNumber)
              ? undefined
              : e.target.valueAsNumber
            : e.target.value;

        setValue(value);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          (value) => onChange(value as never, e),
          debounce,
          value,
        );
      }}
    />
  );
});
DebouncedInput.displayName = "DebouncedInput";
