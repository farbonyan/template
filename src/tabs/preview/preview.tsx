"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { z } from "~/lib/zod";
import { download } from "~/utils/download";
import { documentTypes } from "~/utils/file";
import { DocxPreview } from "./docx-preview";
import { ExcelViewer } from "./excel-viewer";
import { FileViewer } from "./file-viewer";

export const documentPreviewTabProps = z.object({
  document: z.object({
    id: z.string().uuid(),
    name: z.string().trim().min(1),
  }),
});

export type DocumentPreviewTabProps = z.infer<typeof documentPreviewTabProps>;

export const DocumentPreviewTab = ({ document }: DocumentPreviewTabProps) => {
  const url = `/api/attachments/${document.id}`;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Button
        size="icon"
        className="absolute start-2 top-2 z-20 rounded-full"
        onClick={() => download(url, document.name)}
      >
        <DownloadIcon className="size-4" />
      </Button>
      {documentTypes.Word.some((x) => document.name.endsWith(x.ext)) ? (
        <DocxPreview link={url} />
      ) : documentTypes.Excel.some((x) => document.name.endsWith(x.ext)) ? (
        <ExcelViewer url={url} />
      ) : (
        <FileViewer title={document.name} src={url} className="h-full w-full" />
      )}
    </div>
  );
};
