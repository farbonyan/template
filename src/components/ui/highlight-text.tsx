import * as React from "react";

import { cn } from "~/lib/utils";

type HighlightTextProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  /** Default text */
  text: string;

  /** Highlighting text */
  highlight?: string;
};

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const HighlightText = React.forwardRef<HTMLSpanElement, HighlightTextProps>(
  ({ text, highlight, ...props }, ref) => {
    const parts = highlight
      ? text.split(new RegExp(`(${escapeRegExp(highlight)})`, "gi"))
      : [text];
    return (
      <span ref={ref} {...props}>
        {parts.map((part, index) => (
          <span
            key={index}
            className={cn(
              part.toLowerCase() === highlight?.toLowerCase() &&
                "bg-highlight text-highlight-foreground",
            )}
          >
            {part}
          </span>
        ))}
      </span>
    );
  },
);
HighlightText.displayName = "HighlightText";

export { HighlightText, type HighlightTextProps };
