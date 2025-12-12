import type { Attachment } from "@prisma/client";
import * as React from "react";

export type UseFileUploadProps = {
  onChange?: (attachment: Attachment) => void;
};

export const useFileUpload = (props?: UseFileUploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const upload = React.useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/upload");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded / event.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText) as Attachment;
              props?.onChange?.(data);
              resolve();
            } else {
              reject(new Error(xhr.statusText));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(formData);
        });
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [props],
  );

  return { upload, uploading, progress };
};
