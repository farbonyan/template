import * as React from "react";
import { PrinterIcon, SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export type FormWrapperProps = {
  tooltips?: {
    print?: string;
    submit?: string;
  };
  onPrint?: () => void;
} & React.ComponentProps<"form">;

export const FormWrapper = ({
  children,
  className,
  tooltips,
  onPrint,
  ...props
}: FormWrapperProps) => {
  const t = useTranslations("forms.wrapper");

  return (
    <form className="h-full overflow-hidden" autoComplete="off" {...props}>
      <Card className="flex h-full flex-col overflow-hidden rounded">
        <CardHeader className="flex-row items-center justify-end space-y-0 divide-x divide-x-reverse border-b bg-muted/50 p-2">
          {onPrint && (
            <Button
              type="button"
              variant="primary-outline"
              className="items-center gap-2"
              onClick={onPrint}
            >
              <PrinterIcon className="size-4" />
              {tooltips?.print ?? t("print")}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary-outline"
            className="items-center gap-2"
          >
            <SaveIcon className="size-4" />
            {tooltips?.submit ?? t("submit")}
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-2">
          <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]>div]:!block [&>[data-radix-scroll-area-viewport]>div]:!h-full">
            <div className={cn("h-full space-y-4 p-1", className)}>
              {children}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </form>
  );
};
