import type { LucideProps } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

type InputProps = {
  PrefixIcon?: React.ComponentType<{ className?: string }>;
  SuffixIcon?: React.ComponentType<{ className?: string }>;
  iconProps?: LucideProps;
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      wrapperClassName,
      className,
      type,
      SuffixIcon,
      PrefixIcon,
      iconProps,
      ...props
    },
    ref,
  ) => {
    const { className: iconClassName, ...iconRestProps } = iconProps ?? {};
    return (
      <div className={cn("relative w-full", wrapperClassName)}>
        {PrefixIcon && (
          <PrefixIcon
            className={cn(
              "absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
              iconClassName,
            )}
            {...iconRestProps}
          />
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-input-border bg-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
            { "ps-8": PrefixIcon, "pe-8": SuffixIcon },
            className,
          )}
          ref={ref}
          {...props}
        />
        {SuffixIcon && (
          <SuffixIcon
            className={cn(
              "absolute end-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
              iconClassName,
            )}
            {...iconRestProps}
          />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input, type InputProps };
