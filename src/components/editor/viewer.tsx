import { EditorContent } from "@tiptap/react";

import { useEditor } from "./use-editor";

export type ViewerProps = {
  content: string;
  className?: string;
};

export const Viewer = ({ content, className }: ViewerProps) => {
  const editor = useEditor({
    content: content,
    editable: false,
  });

  return <EditorContent readOnly editor={editor} className={className} />;
};
