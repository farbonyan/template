"use client";

import * as React from "react";

import { useFileUpload } from "~/hooks/file-upload";
import { api } from "~/trpc/react";
import { Button } from "./button";
import { Input } from "./input";
import { LoadingSpinner } from "./loading";
import { Progress } from "./progress";

type FileInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> & {
  value?: { id: string; name: string } | null;
  onChange?: (file: { id: string; name: string }) => void;
};

export const FileInput = ({ value, onChange, ...props }: FileInputProps) => {
  const { upload, uploading, progress } = useFileUpload({ onChange });
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const { data: attachment, isLoading } = api.attachment.single.useQuery(
    value?.id ?? "",
    { enabled: !!value },
  );

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
    e.target.value = "";
  };

  return (
    <div className="relative w-full">
      <Input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={uploading}
        className="w-full justify-start text-muted-foreground"
      >
        {uploading || isLoading ? (
          <LoadingSpinner className="m-0 size-4 stroke-muted-foreground" />
        ) : (
          (attachment?.name ?? props.placeholder)
        )}
      </Button>
      {uploading && (
        <Progress value={progress} className="absolute bottom-0 w-full" />
      )}
    </div>
  );
};
