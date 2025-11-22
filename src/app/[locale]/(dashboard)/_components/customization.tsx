"use client";

import * as React from "react";
import { SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useTabOpener } from "~/contexts/tab-manager";
import { useIsRtl } from "~/hooks/is-rtl";
import { useSearchParamState } from "~/hooks/search-param-state";
import { cn } from "~/lib/utils";
import { SwitchLocales } from "./switch-locales";
import { SwitchMenu } from "./switch-menu";
import { SwitchThemes } from "./switch-themes";

type CustomizationCardProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

const CustomizationCard = ({
  title,
  className,
  children,
}: CustomizationCardProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {title && <h2 className="font-medium">{title}</h2>}
      <div className="rounded-lg bg-muted p-2">{children}</div>
    </div>
  );
};

/**
 * App customization settings including:
 *  - Theme
 *  - Menu
 *  - Edit shortcuts
 *  - Edit widgets
 */
export const Customization = () => {
  const t = useTranslations("pages.index.header.customize");
  const isRtl = useIsRtl();
  const openTab = useTabOpener();
  const [open, setOpen] = React.useState(false);
  const [editingWidgets, setEditingWidgets] =
    useSearchParamState("editingWidgets");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="rounded-full bg-header p-2 text-header-foreground hover:bg-primary/10 hover:text-primary/70 data-[state=open]:bg-primary/20 data-[state=open]:text-primary/80">
        <SettingsIcon className="size-6 stroke-2" />
      </SheetTrigger>
      <SheetContent
        closable
        className="flex h-full flex-col overflow-hidden p-0"
        side={isRtl ? "left" : "right"}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 px-4 pt-2">
            <SettingsIcon className="size-4" />
            <span>{t("title")}</span>
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription>{t("title")}</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-4 px-4 pb-4">
            <CustomizationCard title={t("locale.title")}>
              <SwitchLocales />
            </CustomizationCard>
            <CustomizationCard title={t("theme.title")}>
              <SwitchThemes />
            </CustomizationCard>
            <CustomizationCard
              title={t("menu.title")}
              className="hidden md:block"
            >
              <SwitchMenu />
            </CustomizationCard>
            {editingWidgets !== "true" && (
              <Button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditingWidgets("true");
                  setTimeout(() => void openTab("dashboard", undefined), 50);
                }}
                className="w-full"
              >
                {t("widgets.edit")}
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
