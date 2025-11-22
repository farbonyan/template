import * as React from "react";
import { XIcon } from "lucide-react";

import { cn } from "~/lib/utils";

export type ChipProps = {
  label: React.ReactNode;
  classes?: {
    container?: string;
    label?: string;
    icon?: string;
  };
  trailing?: React.ReactNode;
  onDelete?: React.MouseEventHandler;
};

const Chip = ({ label, classes, trailing, onDelete }: ChipProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md bg-muted px-2 py-1",
        classes?.container,
      )}
    >
      <span
        className={cn("flex-1 select-none text-sm font-light", classes?.label)}
      >
        {label}
      </span>
      {trailing}
      {onDelete && (
        <XIcon
          className={cn(
            "-me-1 size-5 cursor-pointer rounded-md bg-muted-foreground p-1",
            classes?.icon,
          )}
          onClick={onDelete}
        />
      )}
    </div>
  );
};

export { Chip };
