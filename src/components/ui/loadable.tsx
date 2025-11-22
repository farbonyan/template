"use client";

import * as React from "react";

import { cn } from "~/lib/utils";
import { LoadingDots } from "./loading";

type LoadableProps = {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Loadable = React.forwardRef<HTMLDivElement, LoadableProps>(
  ({ loading, className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative h-full w-full overflow-hidden", className)}
      >
        {children}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-muted/10 backdrop-blur-[1px]">
            <LoadingDots size="lg" color="primary" />
          </div>
        )}
      </div>
    );
  },
);
Loadable.displayName = "Loadable";

export { Loadable, type LoadableProps };
