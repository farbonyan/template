"use client";

import * as React from "react";
import { ClipboardListIcon, CpuIcon, SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SystemLink } from "../tab-manager";
import type {
  TBaseMenuItem,
  TMenuItem,
  TShortcut,
  TSystem,
  TWidget,
} from "./types";
import { useLocalStorage } from "~/hooks/local-storage";
import {
  getDetailedLeafMenuItems,
  getFilteredMenus,
  getLeafMenuItems,
} from "./utils";

type SystemContextType = {
  systems: TSystem[];
};

const SystemContext = React.createContext<SystemContextType | undefined>(
  undefined,
);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations();

  const systems = React.useMemo<TSystem[]>(() => {
    return [
      {
        title: "",
        icon: CpuIcon,
        expandable: true,
        menus: [
          {
            label: t("pages.template.title"),
            icon: ClipboardListIcon,
            permitted: true,
            link: ["template.create", undefined] satisfies SystemLink,
          },
        ],
        widgets: [],
      },
      {
        title: "NEW SYSTEMS",
        icon: SettingsIcon,
        expandable: true,
        menus: [],
        widgets: [],
      },
    ];
  }, [t]);

  return (
    <SystemContext.Provider value={{ systems }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystems = (filtered = true): TSystem[] => {
  const context = React.useContext(SystemContext);
  if (!context) {
    throw new Error("useSystems must be used within a SystemProvider");
  }
  const { systems } = context;
  return React.useMemo(() => {
    if (!filtered) return systems;
    return systems.map((system) => ({
      ...system,
      menus: getFilteredMenus(system.menus),
      widgets: system.widgets.filter((widget) => widget.permitted),
    }));
  }, [systems, filtered]);
};

/** Get all widgets */
export const useWidgets = (filtered = true): TWidget[] => {
  const systems = useSystems(filtered);

  return systems.flatMap((system) => system.widgets);
};

/** Get all menu items */
export const useMenuItems = (filtered = true): TMenuItem[] => {
  const systems = useSystems(filtered);
  return React.useMemo(
    () =>
      systems
        .filter((system) => system.menus.length)
        .map((system) => ({
          label: system.title,
          icon: system.icon,
          submenus: system.menus,
          expandable: system.expandable,
        })),
    [systems],
  );
};

/** Get leaf menu items (has no submenus) */
export const useLeafMenuItems = (filtered = true) => {
  const menuItems = useMenuItems(filtered);
  return React.useMemo(
    () => getLeafMenuItems(menuItems.map((item) => ({ ...item, parents: [] }))),
    [menuItems],
  );
};

/** Get leaf menu items with parents */
export const useDetailedLeafMenuItems = (filtered = true) => {
  const menuItems = useMenuItems(filtered);
  return React.useMemo(
    () =>
      getDetailedLeafMenuItems(
        menuItems.map((item) => ({ ...item, parents: [] })),
      ),
    [menuItems],
  );
};

/** Get shortcuts of leaf menu items that are stored in setting */
export const useShortcuts = (filtered = true) => {
  const menuItems = useDetailedLeafMenuItems(filtered);
  const [links, setLinks] = useLocalStorage<SystemLink[]>("shortcutLinks", []);

  const add = React.useCallback(
    (...links: SystemLink[]) => {
      setLinks((preLinks) => [...preLinks, ...links]);
    },
    [setLinks],
  );

  const remove = React.useCallback(
    (link: SystemLink) => {
      setLinks((links) => links.filter((l) => l[0] !== link[0]));
    },
    [setLinks],
  );

  const shortcuts = React.useMemo<TShortcut[]>(() => {
    return links
      .map((link) => menuItems.find((menuItem) => menuItem.link[0] === link[0]))
      .filter((shortcut): shortcut is TShortcut => !!shortcut);
  }, [links, menuItems]);

  const groupedShortcuts = React.useMemo(() => {
    const shortcutsMap = new Map<TBaseMenuItem, TShortcut[]>();
    shortcuts.forEach((shortcut) => {
      const parent = shortcut.parents[0];
      if (!parent) return;
      shortcutsMap.set(parent, [...(shortcutsMap.get(parent) ?? []), shortcut]);
    });
    return shortcutsMap;
  }, [shortcuts]);

  return {
    items: shortcuts,
    groupedItems: groupedShortcuts,
    links,
    add,
    remove,
  };
};
