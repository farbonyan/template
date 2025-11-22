import * as React from "react";

import { useLocalizedNumbers } from "~/hooks/localized-numbers";
import { useNumericFormatter } from "~/hooks/numeric-formatter";
import { Input } from "./input";

type TextInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "value"
> & {
  value?: string | null;
  onChange?: (value: string) => void;
};

const TextInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  TextInputProps
>(({ value, onChange, ...props }, ref) => {
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const localizedNumbers = useLocalizedNumbers();
  const numericFormatter = useNumericFormatter();

  const formatValue = React.useCallback(
    (v?: string | null) => {
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
      onChange?.(parsedValue);
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
TextInput.displayName = "TextInput";

export { TextInput, type TextInputProps };
