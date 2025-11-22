import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  BetweenHorizontalStartIcon,
  BetweenVerticalStartIcon,
  FoldHorizontalIcon,
  FoldVerticalIcon,
  TableCellsMergeIcon,
  TableCellsSplitIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";

export type TableBubbleMenuProps = {
  editor: Editor;
};

export const TableBubbleMenu = ({ editor }: TableBubbleMenuProps) => {
  return (
    <BubbleMenu
      pluginKey="table-context-menu"
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("table")}
      className="h-9 rounded-md bg-background shadow-md"
    >
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <BetweenVerticalStartIcon className="size-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <BetweenHorizontalStartIcon className="size-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <FoldVerticalIcon className="size-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <FoldHorizontalIcon className="size-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        disabled={!editor.can().chain().focus().mergeCells().run()}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <TableCellsMergeIcon className="size-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        disabled={!editor.can().chain().focus().splitCell().run()}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <TableCellsSplitIcon className="size-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="hidden xl:inline-block"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <TrashIcon className="size-4" />
      </Button>
    </BubbleMenu>
  );
};
