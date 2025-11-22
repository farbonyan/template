import type { Editor } from "@tiptap/react";
import {
  PaintbrushVerticalIcon,
  SquareDashedIcon,
  TypeIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

const colors = [
  "rgb(0, 0, 0)",
  "rgb(148, 163, 184)",
  "rgb(156, 163, 175)",
  "rgb(161, 161, 170)",
  "rgb(163, 163, 163)",
  "rgb(168, 162, 158)",
  "rgb(248, 113, 113)",
  "rgb(251, 146, 60)",
  "rgb(251, 191, 36)",
  "rgb(250, 204, 21)",
  "rgb(163, 230, 53)",
  "rgb(74, 222, 128)",
  "rgb(52, 211, 153)",
  "rgb(45, 212, 191)",
  "rgb(34, 211, 238)",
  "rgb(56, 189, 248)",
  "rgb(96, 165, 250)",
  "rgb(129, 140, 248)",
  "rgb(167, 139, 250)",
  "rgb(192, 132, 252)",
  "rgb(232, 121, 249)",
  "rgb(244, 114, 182)",
  "rgb(251, 113, 133)",
  "rgb(255, 255, 255)",
  "transparent",
];

export type ColorSelectorProps = {
  editor?: Editor | null;
};

export const ColorSelector = ({ editor }: ColorSelectorProps) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hidden size-9 flex-col gap-1 md:inline-flex"
          >
            <TypeIcon className="size-4" />
            <Separator
              className="h-1 w-6 border bg-foreground"
              style={{
                backgroundColor: (
                  editor.getAttributes("textStyle") as { color: string }
                ).color,
              }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="grid min-w-max grid-cols-5 p-2 ~gap-2/4">
          {colors.map((color) => {
            return (
              <Button
                key={color}
                type="button"
                size="icon"
                className={cn(
                  "size-8 border",
                  editor.isActive("textStyle", { color }) &&
                    "ring ring-primary",
                )}
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              >
                {color === "transparent" && (
                  <SquareDashedIcon className="size-6 text-black" />
                )}
              </Button>
            );
          })}
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hidden size-9 flex-col gap-1 md:inline-flex"
          >
            <PaintbrushVerticalIcon className="size-4" />
            <Separator
              className="h-1 w-6 border bg-transparent"
              style={{
                backgroundColor: (
                  editor.getAttributes("highlight") as { color: string }
                ).color,
              }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="grid min-w-max grid-cols-5 p-2 ~gap-2/4">
          {colors.map((color) => {
            return (
              <Button
                key={color}
                type="button"
                size="icon"
                className={cn(
                  "size-8 border",
                  editor.isActive("highlight", { color }) &&
                    "ring ring-primary",
                )}
                style={{ backgroundColor: color }}
                onClick={() =>
                  editor.chain().focus().toggleHighlight({ color }).run()
                }
              >
                {color === "transparent" && (
                  <SquareDashedIcon className="size-6 text-black" />
                )}
              </Button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
};
