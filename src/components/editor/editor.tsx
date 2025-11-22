import * as React from "react";
import { EditorContent } from "@tiptap/react";

import type { View } from "./type";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useFullScreen } from "~/hooks/full-screen";
import { cn } from "~/lib/utils";
import { EditorBubbleMenu } from "./bubble-menus";
import { SwitchView } from "./switch-view";
import { EditorToolbar } from "./toolbar";
import { useEditor } from "./use-editor";

export type EditorProps = {
  content: string;
  className?: string;
  placeholder?: string;
  enableCrop?: boolean;
  onChange: (value: string) => void;
};

export const Editor = ({
  content,
  className,
  placeholder,
  onChange,
  enableCrop,
}: EditorProps) => {
  const [view, setView] = React.useState<View>("design");
  const [ref, isFullScreen, toggleFullScreen] =
    useFullScreen<React.ComponentRef<"div">>();
  const editor = useEditor({
    content,
    className,
    placeholder,
    onChange,
    editable: true,
    autofocus: true,
  });

  return (
    <div
      ref={ref}
      className="flex h-full w-full flex-col overflow-hidden bg-background"
    >
      {view === "html" ? (
        <Textarea
          dir="ltr"
          value={content}
          className={cn("h-full", className)}
          placeholder={placeholder}
          onChange={(e) => {
            const value = e.target.value;
            onChange(value);
            editor?.commands.setContent(value);
          }}
        />
      ) : (
        <div
          className={cn(
            "relative flex w-full flex-1 flex-col overflow-hidden rounded-sm border",
            className,
          )}
        >
          <EditorToolbar
            editor={editor}
            enableCrop={enableCrop}
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
          />
          <Separator orientation="horizontal" />
          <EditorBubbleMenu editor={editor} />
          <ScrollArea className="flex-1 px-4 [&>div>div]:h-full">
            <EditorContent className="h-full" editor={editor} />
          </ScrollArea>
        </div>
      )}
      <SwitchView view={view} onChangeView={setView} />
    </div>
  );
};
