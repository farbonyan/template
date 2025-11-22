import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { TDetailedLeafMenuItem, TMenuItem } from "~/contexts/systems";
import type { SystemLink } from "~/contexts/tab-manager";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { useDetailedLeafMenuItems } from "~/contexts/systems";
import { useTabOpener } from "~/contexts/tab-manager";
import { useAutoAnimate } from "~/hooks/auto-animate";
import { useIsRtl } from "~/hooks/is-rtl";
import { cn } from "~/lib/utils";
import { getCookie } from "~/utils/cookie";

export type DashboardMenuItemProps = {
  /** On click handler */
  onClick?: () => void;
};

export const DashboardMenuItem = ({ onClick }: DashboardMenuItemProps) => {
  const t = useTranslations("pages.index");

  return (
    <li className="flex w-full items-center">
      <Button
        type="button"
        variant="ghost"
        className="flex w-full flex-1 items-center justify-start gap-4 overflow-hidden py-4"
        onClick={onClick}
      >
        <LayoutDashboardIcon className="size-4 shrink-0" />
        <p className="truncate text-nowrap">{t("title")}</p>
      </Button>
    </li>
  );
};

const isSameLink = (
  link: SystemLink,
  page: string | null,
  pageParams: string | undefined,
) => {
  const params = pageParams
    ? (JSON.parse(pageParams) as SystemLink[1])
    : undefined;
  return JSON.stringify([page, params]) === JSON.stringify(link);
};

type MenuItemProps = {
  index: number;
  current: boolean;
  item: TMenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClick?: () => void;
};

const MenuItem = ({
  index,
  current,
  item,
  open,
  onOpenChange,
  onClick,
}: MenuItemProps) => {
  const isRtl = useIsRtl();
  const [parent] = useAutoAnimate();

  if ("link" in item) {
    return (
      <>
        {!!index && item.separator && (
          <li>
            <Separator />
          </li>
        )}
        <li className="flex items-center gap-1">
          <Button
            className="flex flex-1 items-center justify-start gap-4 overflow-hidden py-4"
            variant={current ? "default" : "ghost"}
            onClick={onClick}
          >
            <item.icon className="size-4 shrink-0" />
            <p className="truncate text-nowrap">{item.label}</p>
          </Button>
          {item.options && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="shrink-0">
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.options.map((option) => {
                  return (
                    <DropdownMenuItem
                      key={option.label}
                      onClick={option.onClick}
                      className="flex items-center gap-2"
                    >
                      <option.icon className="size-4" />
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </li>
      </>
    );
  }

  return (
    <li>
      <Button
        variant="ghost"
        className="group w-full justify-start overflow-hidden"
        onClick={() => onOpenChange(!open)}
      >
        <div className="flex w-full items-center">
          <div className="flex flex-1 items-center gap-4 overflow-hidden">
            <item.icon className="size-4 shrink-0" />
            <p className="truncate">{item.label}</p>
          </div>
          <ChevronDownIcon
            className={cn(
              "size-4 transition-all",
              !open && (isRtl ? "rotate-90" : "-rotate-90"),
            )}
          />
        </div>
      </Button>
      <div ref={parent} className="ms-8">
        {open && (
          <div className="my-2 space-y-2">
            <Menu items={item.submenus} onClick={onClick} />
          </div>
        )}
      </div>
    </li>
  );
};

type SearchMenuItemProps = {
  item: TDetailedLeafMenuItem;
  onClick?: () => void;
};

const SearchMenuItem = ({ item, onClick }: SearchMenuItemProps) => {
  if (!("link" in item)) return null;

  return (
    <li>
      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        className="h-20 w-full justify-start text-start"
      >
        <div className="space-y-1 p-2">
          <div className="flex items-center gap-2">
            <item.icon className="size-4" />
            <p className="font-semibold">{item.label}</p>
          </div>
          <p className="text-sm font-light text-gray-500">
            {item.parents.map((p) => p.label).join("  /  ")}
          </p>
        </div>
      </Button>
    </li>
  );
};

export type MenuProps = {
  /** List of menu items */
  items: TMenuItem[];

  /** Searched string in menu */
  search?: string;

  /** Shortcut item click handler */
  onClick?: () => void;
};

/** Menu component that shows list of menu items */
export const Menu = ({ items, search, onClick }: MenuProps) => {
  const params = useSearchParams();
  const leafItems = useDetailedLeafMenuItems();
  const openTab = useTabOpener();
  const [open, setOpen] = React.useState<number>();

  const expandedItems = React.useMemo(() => {
    return items.flatMap((item) => {
      if ("submenus" in item && item.expandable) {
        return item.submenus;
      }
      return [item];
    });
  }, [items]);

  return (
    <>
      {search ? (
        <ul className="divide-y">
          {leafItems
            .filter((item) => item.label.includes(search))
            .map((item, index) => {
              return (
                <SearchMenuItem
                  key={index}
                  item={item}
                  onClick={() => {
                    void openTab(...item.link);
                    onClick?.();
                  }}
                />
              );
            })}
        </ul>
      ) : (
        <ul className="space-y-2">
          {expandedItems.map((item, index) => {
            const current =
              "link" in item
                ? isSameLink(
                    item.link,
                    params.get("page"),
                    getCookie("pageParams"),
                  )
                : false;

            return (
              <MenuItem
                key={index}
                index={index}
                current={current}
                item={item}
                onClick={() => {
                  if ("link" in item) {
                    void openTab(item.link[0], item.link[1], undefined);
                  }
                  onClick?.();
                }}
                open={open === index}
                onOpenChange={(open) => {
                  setOpen(open ? index : -1);
                }}
              />
            );
          })}
        </ul>
      )}
    </>
  );
};
