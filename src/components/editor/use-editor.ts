import type { EditorOptions } from "@tiptap/react";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEditor as __useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Image } from "./extensions/image";
import { Video } from "./extensions/video";

import "./styles.css";

import { useIsRtl } from "~/hooks/is-rtl";

type UseEditorProps = {
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
} & Partial<Omit<EditorOptions, "extensions" | "onUpdate">>;

export const useEditor = ({
  className,
  placeholder,
  onChange,
  editorProps,
  ...props
}: UseEditorProps) => {
  const isRtl = useIsRtl();

  const editor = __useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: isRtl ? "right" : "left",
      }),
      Table.configure({ resizable: true }),
      TableCell,
      TableHeader,
      TableRow,
      Placeholder.configure({ placeholder }),
      Image,
      Video,
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: className ?? "",
      },
      ...editorProps,
    },
    ...props,
  });

  return editor;
};
