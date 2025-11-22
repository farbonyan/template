"use client";

import * as React from "react";
import Image from "next/image";
import { LogOutIcon, MenuIcon, SearchIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { DebouncedTextInput } from "~/components/ui/debounced-text-input";
import { Logo } from "~/components/ui/logo";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useTheme } from "~/components/ui/theme";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useSetting } from "~/contexts/settings";
import { useMenuItems } from "~/contexts/systems";
import { useIsRtl } from "~/hooks/is-rtl";
import { useResponsive } from "~/hooks/responsive";
import { Link } from "~/i18n/routing";
import { cn } from "~/lib/utils";
import { Customization } from "./customization";
import { Menu } from "./menu";
import { Profile } from "./profile";

/** Dashboard top header bar */
export const Header = () => {
  const t = useTranslations("pages.index.header");
  const session = useSession();
  const { resolvedTheme } = useTheme();
  const isRtl = useIsRtl();
  const { isMdUp } = useResponsive();
  const [displayMenu] = useSetting("displayMenu");
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const menuItems = useMenuItems();

  const handleClickMenuItem = () => {
    setSearch("");
    setOpen(false);
  };

  return (
    <header className="z-10 flex bg-background px-4 py-2.5 text-foreground shadow-md">
      <div className="flex flex-1 items-center gap-1">
        <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
          <SheetTrigger
            className={cn("-ms-2 p-2 pb-3", {
              "block lg:hidden": displayMenu !== "slider",
            })}
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent
            side={isRtl ? "right" : "left"}
            className="flex h-full flex-col overflow-hidden p-0"
          >
            <VisuallyHidden>
              <SheetHeader>
                <SheetTitle>{t("title")}</SheetTitle>
                <SheetDescription>{t("title")}</SheetDescription>
              </SheetHeader>
            </VisuallyHidden>
            <ScrollArea className="flex-1 ~p-2/4 [&>div>div]:!block">
              {session.status === "authenticated" && (
                <>
                  <Profile session={session.data} />
                  <Separator className="my-8" />
                </>
              )}
              <div className="m-1 space-y-4">
                <DebouncedTextInput
                  tabIndex={isMdUp ? undefined : -1}
                  cancelable
                  value={search}
                  onChange={(search) => setSearch(search)}
                  PrefixIcon={SearchIcon}
                  placeholder={t("menu.placeholder")}
                />
                <Menu
                  items={menuItems}
                  search={search}
                  onClick={handleClickMenuItem}
                />
              </div>
              {!search && (
                <>
                  <Separator className="my-8" />
                  <Button
                    variant="ghost"
                    className="w-full items-center justify-start gap-4 text-destructive hover:text-destructive/80"
                    onClick={() => signOut()}
                  >
                    <LogOutIcon className="size-4" />
                    <span>{t("menu.sign-out")}</span>
                  </Button>
                </>
              )}
            </ScrollArea>
            <Image
              src={
                resolvedTheme === "dark"
                  ? "/img/app-logo-dark.png"
                  : "/img/app-logo-light.png"
              }
              alt="logo"
              unoptimized
              priority
              width="400"
              height="200"
              sizes="100vw"
              className="mx-auto h-32 w-auto"
            />
          </SheetContent>
        </Sheet>
        <Link href="/">
          <Image
            src={
              resolvedTheme === "dark"
                ? "/img/logo-header-dark.png"
                : "/img/logo-header-light.png"
            }
            alt="logo"
            unoptimized
            priority
            width="400"
            height="200"
            sizes="100vw"
            className="ms-2 h-9 w-auto"
          />
        </Link>
      </div>
      <div className="flex items-center ~gap-2/4">
        <Customization />
        <Logo className="-me-3 size-12" />
      </div>
    </header>
  );
};
