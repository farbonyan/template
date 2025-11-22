"use client";

import * as React from "react";
import Image from "next/image";
import { LogOutIcon, SearchIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { DebouncedTextInput } from "~/components/ui/debounced-text-input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useTheme } from "~/components/ui/theme";
import { useSetting } from "~/contexts/settings";
import { useMenuItems } from "~/contexts/systems";
import { useResponsive } from "~/hooks/responsive";
import { cn } from "~/lib/utils";
import { Menu } from "./menu";
import { Profile } from "./profile";

export type MenuContainerProps = {
  /** Optional className */
  className?: string;

  /** Children inside container */
  children: React.ReactNode;
};

/**
 * Wrapper around dashboard than contains menu
 * Menu display mode comes from customized settings
 */
export const MenuContainer = ({ children, className }: MenuContainerProps) => {
  const t = useTranslations("pages.index.header");
  const session = useSession();
  const { isLgDown } = useResponsive();
  const { resolvedTheme } = useTheme();
  const [displayMenu] = useSetting("displayMenu");
  const { isMdUp } = useResponsive();
  const menuItems = useMenuItems();
  const [search, setSearch] = React.useState("");

  const showMenu = !isLgDown && displayMenu === "sticky";

  const handleClickMenuItem = () => setSearch("");

  return (
    <div className="flex h-full">
      {showMenu && (
        <div className="z-10 flex w-1/6 min-w-60 flex-col overflow-hidden bg-background pb-3 shadow-sm">
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
        </div>
      )}
      <div className={cn("flex-1 overflow-hidden", className)}>{children}</div>
    </div>
  );
};
