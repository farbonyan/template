import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, Italic, Strikethrough } from "lucide-react";

import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, Toolbar } from "~/components/ui/toolbar";

export type TextBubbleMenuProps = {
  editor: Editor;
};

export const TextBubbleMenu = ({ editor }: TextBubbleMenuProps) => {
  return (
    <BubbleMenu
      editor={editor}
      pluginKey="text-context-menu"
      shouldShow={({ editor }) => editor.isActive("p")}
      className="h-9 rounded-md bg-background shadow-md"
    >
      <Toolbar className="m-0 flex items-center p-1">
        <ToggleGroup type="multiple">
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            pressed={editor.isActive("bold")}
          >
            <Bold className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            pressed={editor.isActive("italic")}
            value="italic"
          >
            <Italic className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            pressed={editor.isActive("strike")}
          >
            <Strikethrough className="size-4" />
          </Toggle>
        </ToggleGroup>
      </Toolbar>
    </BubbleMenu>
  );
};
