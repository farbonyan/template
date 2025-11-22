import * as React from "react";
import { useFormatter } from "next-intl";

import { useDecimalSeparator } from "~/hooks/decimal-separator";
import { useLocalizedNumbers } from "~/hooks/localized-numbers";
import { useThousandSeparator } from "~/hooks/thousand-separator";
import { Input } from "./input";

type NumberInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "type" | "onChange"
> & {
  parseType?: "integer" | "float";
  value?: number | null;
  onChange?: (value: number | null | undefined) => void;
};

const parseLocalNumeric = (
  value: string,
  localizedNumbers: string[],
  thousandSeparator: string,
  decimalSeparator: string,
) => {
  const valueWithoutThousandSeparator = value.replaceAll(thousandSeparator, "");
  const valueWithoutDecimalSeparator = valueWithoutThousandSeparator.replace(
    decimalSeparator,
    ".",
  );
  return localizedNumbers.reduce(
    (pre, cur, index) => pre.replaceAll(cur, index.toString()),
    valueWithoutDecimalSeparator,
  );
};

const NumberInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  NumberInputProps
>(({ parseType = "float", value, onChange, ...props }, ref) => {
  const formatter = useFormatter();
  const localizedNumbers = useLocalizedNumbers();
  const thousandSeparator = useThousandSeparator();
  const decimalSeparator = useDecimalSeparator();
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const max = typeof props.max === "number" ? props.max : Infinity;
  const min = typeof props.min === "number" ? props.min : -Infinity;
  const parser = parseType === "float" ? Number.parseFloat : Number.parseInt;
  const [internalValue, setInternalValue] = React.useState(value?.toString());

  React.useEffect(() => {
    setInternalValue(value?.toString());
  }, [value]);

  const formattedValue = internalValue
    ? formatter.number(parser(internalValue), {
        compactDisplay: "short",
        maximumFractionDigits: 100,
      }) + (internalValue.endsWith(".") ? "." : "")
    : "";

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cursorPosition = e.target.selectionStart ?? 0;
      const inputValue = parseLocalNumeric(
        e.target.value,
        localizedNumbers,
        thousandSeparator,
        decimalSeparator,
      );
      const numberValue = inputValue ? parser(inputValue) : null;
      if (typeof numberValue !== "number" || Number.isNaN(numberValue)) {
        setInternalValue(undefined);
        onChange?.(null);
        return;
      }
      if (typeof min === "number" && numberValue < min) {
        setInternalValue(min.toString());
        onChange?.(min);
        return;
      }
      if (typeof max === "number" && numberValue > max) {
        setInternalValue(max.toString());
        onChange?.(max);
        return;
      }
      setInternalValue(inputValue);
      onChange?.(numberValue);
      setTimeout(
        (inputValue, cursorPosition) => {
          if (!inputRef.current) return;
          const position =
            cursorPosition + (inputValue.length % 3 === 1 ? 1 : 0);
          inputRef.current.selectionStart = position;
          inputRef.current.selectionEnd = position;
        },
        0,
        inputValue,
        cursorPosition,
      );
    },
    [
      localizedNumbers,
      thousandSeparator,
      decimalSeparator,
      parser,
      min,
      max,
      onChange,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const increment = e.key === "ArrowUp" ? 1 : -1;
      const newValue = (value ?? 0) + increment;
      if (newValue >= min && newValue <= max) {
        onChange?.(newValue);
        setInternalValue(newValue.toString());
      }
    }
  };

  React.useImperativeHandle(ref, () => inputRef.current!, []);

  return (
    <Input
      ref={inputRef}
      type="text"
      {...props}
      value={formattedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={19}
    />
  );
});
NumberInput.displayName = "NumberInput";

export { NumberInput, type NumberInputProps };
