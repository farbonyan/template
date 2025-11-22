"use client";

import type { VariantProps } from "class-variance-authority";
import type { DropzoneOptions } from "react-dropzone";
import * as React from "react";
import { cva } from "class-variance-authority";
import { UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";

import { cn } from "~/lib/utils";
import { Separator } from "./separator";
import { SubmitButton } from "./submit-button";

const dropzoneVariants = cva(
  "flex items-center justify-center gap-4 px-2 text-xs md:text-sm xl:text-base",
  {
    variants: {
      size: {
        sm: "h-12 py-2",
        md: "h-full flex-col gap-4 py-4",
      },
      disabled: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type DropzoneProps = Omit<DropzoneOptions, "onDrop" | "accept"> &
  VariantProps<typeof dropzoneVariants> & {
    className?: string;
    loading?: boolean;
    progress?: number;
    labels?: {
      drag?: string;
      drop?: string;
      browse?: string;
    };
    onDrop: (file: File) => void;
  };

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    { labels, size, disabled, loading, progress, className, onDrop, ...props },
    ref,
  ) => {
    const t = useTranslations("components.dropzone");

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        file && onDrop(file);
      },
      disabled,
      ...props,
    });

    return (
      <div
        ref={ref}
        {...getRootProps({
          className: cn(
            "flex items-center justify-center rounded-lg text-secondary-foreground",
            isDragActive
              ? "border-4 border-solid border-secondary bg-secondary/50"
              : "border-4 border-dashed border-border bg-muted text-muted-foreground",
            className,
          ),
        })}
        tabIndex={-1}
      >
        <input {...getInputProps()} />
        <div className={cn(dropzoneVariants({ size }))}>
          {isDragActive ? (
            <p>{labels?.drop ?? t("drop")}</p>
          ) : (
            <>
              <UploadIcon className="size-4" />
              <span>{labels?.drag ?? t("drag")}</span>
              <Separator
                orientation={size == "sm" ? "vertical" : "horizontal"}
                className="hidden md:block"
              />
              <SubmitButton
                disabled={disabled}
                progress={progress}
                loading={loading}
                type="button"
                className="hidden min-w-56 md:block"
              >
                {labels?.browse ?? t("browse")}
              </SubmitButton>
            </>
          )}
        </div>
      </div>
    );
  },
);
Dropzone.displayName = "Dropzone";

export { Dropzone, dropzoneVariants, type DropzoneProps };
