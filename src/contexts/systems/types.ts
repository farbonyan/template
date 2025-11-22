import type { SystemLink } from "~/contexts/tab-manager";

/** Base menu item type */
export type TBaseMenuItem = {
  /** Label */
  label: string;

  /** Icon */
  icon: React.ComponentType<{ className?: string }>;
};

/** Leaf menu item type */
export type TLeafMenuItem = TBaseMenuItem & {
  /** Link to specific page */
  link: SystemLink;

  /** User have permission to see the link */
  permitted?: boolean;

  /** Has separator on top */
  separator?: boolean;

  /** Options */
  options?: {
    /** Option icon */
    icon: React.ComponentType<{ className?: string }>;

    /** Option label */
    label: string;

    /** Option click handler */
    onClick: () => void;
  }[];
};

/** Leaf menu item with list of parents type */
export type TDetailedLeafMenuItem = TLeafMenuItem & {
  /** List of all parents */
  parents: TBaseMenuItem[];
};

/** Parent menu item with list of submenus type */
export type TParentMenuItem = TBaseMenuItem & {
  expandable?: boolean;
  submenus: TMenuItem[];
};

/** Menu item type */
export type TMenuItem = TParentMenuItem | TLeafMenuItem;

/** Shortcut type */
export type TShortcut = TDetailedLeafMenuItem;

/** Widget component props */
export type WidgetProps = {
  /** Widget identifier */
  id: string;

  /** If widget is zoomed to full screen */
  isZoomFullScreen: boolean;

  /** Number of the widgets in the same row of the widget */
  widgetsInRow: number;

  /** List of widget tags */
  tags: { name: string; value?: unknown }[];

  /** Tag setter */
  setTags: (tags: { name: string; value?: React.ReactNode }[]) => void;
};

/** Widget type */
export type TWidget = {
  /** Identifier */
  id: string;

  /** User added widgets */
  custom?: boolean;

  /** Size of widget that determines width */
  size: number;

  /** Title */
  title: string;

  /** Disable title */
  disableTitle?: boolean;

  /** Description */
  description?: string;

  /** Prevent widget get full screen */
  preventFullScreen?: boolean;

  /** Icon */
  icon: React.ComponentType<{ className?: string }>;

  /** Preview element */
  preview: React.ComponentType;

  /** Content element */
  content: React.ComponentType<WidgetProps>;

  /** Filter inputs that this widget use */
  filterInputs?: string[];

  /** Permitted widget */
  permitted?: boolean;
};

/** System type */
export type TSystem = {
  /** Title */
  title: string;

  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;

  /** List of menu items */
  menus: TMenuItem[];

  /** List of widgets */
  widgets: TWidget[];

  /** If length of menu items is less than 2, expand items */
  expandable?: boolean;
};
