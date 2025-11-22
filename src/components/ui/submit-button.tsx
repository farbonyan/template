import * as React from "react";
import { useFormatter } from "next-intl";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { LoadingSpinner } from "./loading";

type SubmitButtonProps = {
  loading?: boolean;
  progress?: number;
} & React.ComponentPropsWithoutRef<typeof Button>;

const SubmitButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  SubmitButtonProps
>(({ loading, progress, children, className, ...props }, ref) => {
  const formatter = useFormatter();

  return (
    <Button
      ref={ref}
      type="submit"
      className={cn("relative gap-2", className)}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div
          className={cn(
            "absolute top-0 h-full",
            typeof progress === "number" ? "end-6" : "end-4",
          )}
        >
          {typeof progress === "number" && (
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.6rem]">
              {formatter.number(progress, { maximumFractionDigits: 0 })}
            </p>
          )}
          <div className="absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2">
            <LoadingSpinner
              color="primary"
              className={cn(typeof progress === "number" && "size-7")}
            />
          </div>
        </div>
      )}
      {children}
    </Button>
  );
});
SubmitButton.displayName = "SubmitButton";

export { SubmitButton, type SubmitButtonProps };
