import type { Editor } from "@tiptap/react";

import { TableBubbleMenu } from "./table-bubble-menu";
import { TextBubbleMenu } from "./text-bubble-menu";

export type EditorBubbleMenuProps = {
  editor?: Editor | null;
};

export const EditorBubbleMenu = ({ editor }: EditorBubbleMenuProps) => {
  if (!editor) return null;

  return (
    <>
      <TextBubbleMenu editor={editor} />
      <TableBubbleMenu editor={editor} />
    </>
  );
};
