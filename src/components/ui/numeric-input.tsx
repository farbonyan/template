import * as React from "react";

import { useLocalizedNumbers } from "~/hooks/localized-numbers";
import { useNumericFormatter } from "~/hooks/numeric-formatter";
import { Input } from "./input";

type NumericInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "onChange"
> & {
  value?: string;
  onChange?: (value: string) => void;
};

const NumericInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  NumericInputProps
>(({ value, onChange, ...props }, ref) => {
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const localizedNumbers = useLocalizedNumbers();
  const numericFormatter = useNumericFormatter();

  const formatValue = React.useCallback(
    (v: string | undefined) => {
      if (!v) return "";
      return numericFormatter(v);
    },
    [numericFormatter],
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cursorPosition = e.target.selectionStart;
      const value = e.target.value;
      const parsedValue = localizedNumbers.reduce((pre, cur, index) => {
        return pre.replaceAll(cur, index.toString());
      }, value);
      onChange?.(parsedValue.match(/\d*/g)?.join("") ?? "");
      setTimeout(
        (cursorPosition) => {
          if (!inputRef.current) return;
          inputRef.current.selectionStart = cursorPosition;
          inputRef.current.selectionEnd = cursorPosition;
        },
        0,
        cursorPosition,
      );
    },
    [localizedNumbers, onChange],
  );

  React.useImperativeHandle(ref, () => inputRef.current!, []);

  return (
    <Input
      ref={inputRef}
      type="text"
      {...props}
      value={formatValue(value)}
      onChange={handleChange}
    />
  );
});
NumericInput.displayName = "NumericInput";

export { NumericInput, type NumericInputProps };
