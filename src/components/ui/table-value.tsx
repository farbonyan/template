import { CheckIcon, XIcon } from "lucide-react";
import { useFormatter } from "next-intl";

import { useNumericFormatter } from "~/hooks/numeric-formatter";

export type TableValueProps = {
  value: unknown;
  iso?: boolean;
};

export const TableValue = ({ value, iso }: TableValueProps) => {
  const formatter = useFormatter();
  const numericFormatter = useNumericFormatter();

  switch (typeof value) {
    case "string":
      return <p className="line-clamp-1 min-w-48">{numericFormatter(value)}</p>;
    case "number":
    case "bigint":
      return formatter.number(value);
    case "boolean":
      return value ? (
        <CheckIcon className="size-4" />
      ) : (
        <XIcon className="size-4" />
      );
    case "object": {
      if (value instanceof Date) {
        return iso
          ? value.toISOString()
          : formatter.dateTime(value, {
              dateStyle: "short",
            });
      }
      if (Array.isArray(value)) {
        return (
          <ul>
            {value.map((item: unknown, index) => (
              <li key={index}>
                <TableValue value={item} />
              </li>
            ))}
          </ul>
        );
      }
      return "-";
    }
    default:
      return "-";
  }
};
