"use client";

import * as React from "react";

import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

type FileViewerProps = React.ComponentProps<"iframe">;

const FileViewer = ({ title, className, ...props }: FileViewerProps) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <>
      <iframe
        title={title}
        className={cn(className, loading && "size-0")}
        {...props}
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <Skeleton className={cn("h-full w-full rounded-lg", className)} />
      )}
    </>
  );
};

export { FileViewer, type FileViewerProps };
