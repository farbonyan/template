import type {
  TBaseMenuItem,
  TDetailedLeafMenuItem,
  TLeafMenuItem,
  TMenuItem,
} from "./types";

export const getLeafMenuItems = (items: TMenuItem[]): TLeafMenuItem[] => {
  return items.reduce<TLeafMenuItem[]>((prev, cur) => {
    if ("link" in cur) {
      return [...prev, cur];
    }
    const leafItems = getLeafMenuItems(cur.submenus);
    return [...prev, ...leafItems];
  }, []);
};

export const getDetailedLeafMenuItems = (
  items: TMenuItem[],
  parents: TBaseMenuItem[] = [],
): TDetailedLeafMenuItem[] => {
  return items.reduce((prev, cur) => {
    if ("link" in cur) {
      return [...prev, { ...cur, parents }];
    }
    const newParents = [...parents, cur];
    const detailedItems = getDetailedLeafMenuItems(cur.submenus, newParents);
    return [...prev, ...detailedItems];
  }, [] as TDetailedLeafMenuItem[]);
};

export const getFilteredMenus = (items: TMenuItem[]): TMenuItem[] => {
  return items
    .map((item) => {
      if ("submenus" in item) {
        return { ...item, submenus: getFilteredMenus(item.submenus) };
      }
      return item;
    })
    .filter((item) => {
      if ("submenus" in item) {
        return item.submenus.length;
      }
      return item.permitted;
    });
};
