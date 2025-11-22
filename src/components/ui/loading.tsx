import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "~/lib/utils";

const spinnerStyles = cva("my-28 h-16 w-16 animate-spin", {
  variants: {
    color: {
      primary: "stroke-primary-foreground/60",
      secondary: "stroke-secondary-foreground/60",
      destructive: "stroke-destructive-foreground/60",
    },
    size: {
      default: "size-4",
      sm: "size-2",
      lg: "size-6",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "default",
  },
});

type LoadingSpinnerProps = React.ComponentPropsWithoutRef<typeof Loader2> &
  VariantProps<typeof spinnerStyles>;

const LoadingSpinner = React.forwardRef<
  React.ElementRef<typeof Loader2>,
  LoadingSpinnerProps
>(({ color, size, className, ...props }, ref) => {
  return (
    <Loader2
      ref={ref}
      className={cn(spinnerStyles({ color, size }), className)}
      {...props}
    />
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

const dotsStyles = cva("flex items-center justify-center rtl:space-x-reverse", {
  variants: {
    color: {
      primary: "*:bg-primary/60",
      secondary: "*:bg-secondary/60",
      destructive: "*:bg-destructive/60",
    },
    size: {
      default: "space-x-1 *:size-4",
      sm: "space-x-0.5 *:size-2",
      lg: "space-x-2 *:size-8",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "default",
  },
});

type LoadingDotsProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof dotsStyles>;

const LoadingDots = React.forwardRef<React.ElementRef<"div">, LoadingDotsProps>(
  ({ color, size, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(dotsStyles({ color, size }), className)}
        {...props}
      >
        <div className="size-2 animate-pulse rounded-full bg-secondary [animation-delay:-0.3s]" />
        <div className="size-2 animate-pulse rounded-full bg-secondary [animation-delay:-0.25s]" />
        <div className="size-2 animate-pulse rounded-full bg-secondary" />
      </div>
    );
  },
);
LoadingDots.displayName = "LoadingDots";

export {
  LoadingDots,
  LoadingSpinner,
  dotsStyles,
  spinnerStyles,
  type LoadingDotsProps,
  type LoadingSpinnerProps,
};
