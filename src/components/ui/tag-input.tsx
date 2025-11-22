"use client";

import * as React from "react";
import { TooltipContent } from "@radix-ui/react-tooltip";

import { Chip } from "./chip";
import { Input } from "./input";
import { Tooltip, TooltipTrigger } from "./tooltip";

type TagInputProps = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
} & React.ComponentProps<typeof Input>;

const separators = ["Enter"];
const backspace = "Backspace";

const TagInput = ({ tags, setTags, placeholder, ...props }: TagInputProps) => {
  const [value, setValue] = React.useState("");

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (separators.includes(e.key)) {
        e.preventDefault();
        if (!value) return;
        if (!tags.includes(value)) {
          setTags((tags) => [...tags, value]);
        }
        setValue("");
        return;
      }
      if (e.key === backspace && !value) {
        setTags((tags) => tags.slice(0, -1));
      }
    },
    [value, tags, setTags],
  );

  const getDeleteHandler = (tag: string) => {
    return () => setTags((tags) => tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-1 rounded-md border border-input-border bg-input px-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive">
      {tags.map((tag) => (
        <Tooltip key={tag}>
          <TooltipTrigger>
            <Chip
              label={tag}
              classes={{
                container: "bg-badge-blue border border-badge-blue-foreground",
                label:
                  "max-w-40 overflow-hidden text-ellipsis text-nowrap text-badge-blue-foreground",
                icon: "bg-badge-blue-foreground text-badge-blue",
              }}
              onDelete={getDeleteHandler(tag)}
            />
          </TooltipTrigger>
          <TooltipContent className="rounded-md bg-background p-2 shadow-md">
            {tag}
          </TooltipContent>
        </Tooltip>
      ))}
      <div className="flex-1">
        <Input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length ? undefined : placeholder}
          className="min-w-max border-0 px-0 shadow-none focus-visible:ring-0"
          {...props}
        />
      </div>
    </div>
  );
};

export { TagInput, type TagInputProps };
