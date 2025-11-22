"use client";

import type { Editor } from "@tiptap/react";
import * as React from "react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CheckIcon,
  CodeIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MaximizeIcon,
  MinimizeIcon,
  MinusIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  TableIcon,
  UndoIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { CropperRef } from "~/components/ui/cropper";
import { Button } from "~/components/ui/button";
import { Cropper, ImageRestriction } from "~/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, Toolbar } from "~/components/ui/toolbar";
import { useIsRtl } from "~/hooks/is-rtl";
import { fileToDataUrl } from "~/utils/file";
import { ColorSelector } from "./color-selector";
import { FormatType } from "./format-type";

type EditorToolbarProps = {
  editor?: Editor | null;
  enableCrop?: boolean;
  isFullScreen?: boolean;
  toggleFullScreen?: () => void;
};

export const EditorToolbar = ({
  editor,
  enableCrop,
  isFullScreen,
  toggleFullScreen,
}: EditorToolbarProps) => {
  const t = useTranslations("components.editor");
  const isRtl = useIsRtl();
  const cropperRef = React.useRef<CropperRef>(null);
  const [attachment, setAttachment] = React.useState<{
    file: File;
    url: string;
  }>();
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);

  const handleFileUpload = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const isVideo = file.type.startsWith("video/");
      if (!isVideo && enableCrop) {
        setAttachment({ file, url: URL.createObjectURL(file) });
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      isVideo
        ? editor?.commands.setVideo(dataUrl)
        : editor?.commands.setImage({
            src: dataUrl,
          });
      setAttachment(undefined);
    },
    [editor, enableCrop],
  );

  return (
    <>
      <Dialog
        open={!!attachment}
        onOpenChange={(open) => {
          !open && setAttachment(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <ImageIcon className="size-4" />
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Cropper
              ref={cropperRef}
              src={attachment?.url}
              imageRestriction={ImageRestriction.none}
              className="aspect-square w-full rounded-md [&>div:first-child]:bg-muted"
            />
            <div className="absolute start-1/2 top-1 z-10 flex translate-x-1/2 gap-2">
              <Button
                onClick={async () => {
                  if (!attachment) return;
                  const dataUrl = cropperRef.current
                    ?.getCanvas({ width: 1800, height: 1800 })
                    ?.toDataURL("image/jpg");
                  if (!dataUrl) return;
                  editor?.commands.setImage({
                    src: dataUrl,
                  });
                  setAttachment(undefined);
                }}
              >
                <CheckIcon className="size-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={() => setAttachment(undefined)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Toolbar className="m-0 flex items-center justify-between gap-2 bg-table-header md:p-2">
        <div className="flex items-center gap-1">
          <FormatType editor={editor} />
          <ColorSelector editor={editor} />
          <ToggleGroup type="single" className="hidden flex-nowrap lg:flex">
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor
                  ?.chain()
                  .focus()
                  .setTextAlign(isRtl ? "right" : "left")
                  .run()
              }
              pressed={editor?.isActive({
                textAlign: isRtl ? "right" : "left",
              })}
            >
              {isRtl ? (
                <AlignRightIcon className="size-4" />
              ) : (
                <AlignLeftIcon className="size-4" />
              )}
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              pressed={editor?.isActive({ textAlign: "center" })}
            >
              <AlignCenterIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor
                  ?.chain()
                  .focus()
                  .setTextAlign(isRtl ? "left" : "right")
                  .run()
              }
              pressed={editor?.isActive({
                textAlign: isRtl ? "left" : "right",
              })}
            >
              {isRtl ? (
                <AlignLeftIcon className="size-4" />
              ) : (
                <AlignRightIcon className="size-4" />
              )}
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().setTextAlign("justify").run()
              }
              pressed={editor?.isActive({ textAlign: "justify" })}
            >
              <AlignJustifyIcon className="size-4" />
            </Toggle>
          </ToggleGroup>
          <ToggleGroup
            className="hidden flex-row items-center xl:flex"
            type="multiple"
          >
            <Toggle
              size="sm"
              onPressedChange={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
              pressed={editor?.isActive("bold")}
            >
              <BoldIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().toggleItalic().run()
              }
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
              pressed={editor?.isActive("italic")}
              value="italic"
            >
              <ItalicIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().toggleStrike().run()
              }
              disabled={!editor?.can().chain().focus().toggleStrike().run()}
              pressed={editor?.isActive("strike")}
            >
              <StrikethroughIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().toggleBulletList().run()
              }
              pressed={editor?.isActive("bulletList")}
            >
              <ListIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().toggleOrderedList().run()
              }
              pressed={editor?.isActive("orderedList")}
            >
              <ListOrderedIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().toggleCodeBlock().run()
              }
              pressed={editor?.isActive("codeBlock")}
            >
              <CodeIcon className="size-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() =>
                editor?.chain().focus().toggleBlockquote().run()
              }
              pressed={editor?.isActive("blockquote")}
            >
              <QuoteIcon className="size-4" />
            </Toggle>
          </ToggleGroup>
          <Input
            ref={inputRef}
            type="file"
            value={undefined}
            wrapperClassName="hidden"
            accept=".jpg,.jpeg,.png,.webp,mp4"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="hidden 2xl:inline-block"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="hidden 2xl:inline-block"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <MinusIcon className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="hidden 2xl:inline-block"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <TableIcon className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <ToggleGroup className="flex items-center" type="multiple">
            <Toggle size="sm" onPressedChange={() => toggleFullScreen?.()}>
              {isFullScreen ? (
                <MinimizeIcon className="size-4" />
              ) : (
                <MaximizeIcon className="size-4" />
              )}
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().chain().focus().undo().run()}
            >
              {isRtl ? (
                <RedoIcon className="size-4" />
              ) : (
                <UndoIcon className="size-4" />
              )}
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}
            >
              {isRtl ? (
                <UndoIcon className="size-4" />
              ) : (
                <RedoIcon className="size-4" />
              )}
            </Toggle>
          </ToggleGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="2xl:hidden">
                <EllipsisVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup className="lg:hidden">
                <DropdownMenuItem
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .setTextAlign(isRtl ? "right" : "left")
                      .run()
                  }
                >
                  {isRtl ? (
                    <AlignRightIcon className="me-2 size-4" />
                  ) : (
                    <AlignLeftIcon className="me-2 size-4" />
                  )}
                  {t("align-start")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                >
                  <AlignCenterIcon className="me-2 size-4" />
                  {t("align-center")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .setTextAlign(isRtl ? "left" : "right")
                      .run()
                  }
                >
                  {isRtl ? (
                    <AlignLeftIcon className="me-2 size-4" />
                  ) : (
                    <AlignRightIcon className="me-2 size-4" />
                  )}
                  {t("align-end")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("justify").run()
                  }
                >
                  <AlignJustifyIcon className="me-2 size-4" />
                  {t("align-justify")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="lg:hidden" />
              <DropdownMenuGroup className="xl:hidden">
                <DropdownMenuItem
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editor?.can().chain().focus().toggleBold().run()}
                >
                  <BoldIcon className="me-2 size-4" />
                  {t("bold")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editor?.can().chain().focus().toggleItalic().run()}
                >
                  <ItalicIcon className="me-2 size-4" />
                  {t("italic")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  disabled={!editor?.can().chain().focus().toggleStrike().run()}
                >
                  <StrikethroughIcon className="me-2 size-4" />
                  {t("strike")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                >
                  <ListIcon className="me-2 size-4" />
                  {t("ul-list")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                >
                  <ListOrderedIcon className="me-2 size-4" />
                  {t("ol-list")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().toggleCodeBlock().run()
                  }
                >
                  <CodeIcon className="me-2 size-4" />
                  {t("code")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                >
                  <QuoteIcon className="me-2 size-4" />
                  {t("quote")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="xl:hidden" />
              <DropdownMenuGroup className="2xl:hidden">
                <DropdownMenuItem onClick={() => inputRef.current?.click()}>
                  <ImageIcon className="me-2 size-4" />
                  {t("media")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor?.chain().focus().setHorizontalRule().run()
                  }
                >
                  <MinusIcon className="me-2 size-4" />
                  {t("line")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <TableIcon className="me-2 size-4" />
                  {t("table")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Toolbar>
    </>
  );
};
