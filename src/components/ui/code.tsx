import * as React from "react";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { copyToClipboard } from "~/utils/clipboard";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

type CodeProps = {
  code?: string;
  className?: string;
};

const Code = ({ code, className }: CodeProps) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <ScrollArea
      className={cn(
        "relative h-full rounded border bg-black text-green-200",
        className,
      )}
    >
      {code && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={async () => {
            await copyToClipboard(code);
            setCopied(true);
          }}
          onMouseLeave={() => setCopied(false)}
          className="absolute right-2 top-2"
        >
          {copied ? (
            <ClipboardCheckIcon className="size-4" />
          ) : (
            <ClipboardIcon className="size-4" />
          )}
        </Button>
      )}
      <pre dir="ltr" className="h-full p-4">
        <code dir="ltr" className="text-wrap">
          {code}
        </code>
      </pre>
    </ScrollArea>
  );
};

export { Code, type CodeProps };
