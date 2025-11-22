import * as React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import {
  MaximizeIcon,
  MinimizeIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useDrag, useDrop } from "react-dnd";

import type { TWidget } from "~/contexts/systems";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSystems, useWidgets } from "~/contexts/systems";
import { useResponsiveValue } from "~/hooks/responsive-value";
import { cn } from "~/lib/utils";
import { splitMaxByKey, sum } from "~/utils/array";

export type TWidgetItem = TWidget & {
  row: number;
  column: number;
};

export type TDraggableWidget = TWidget | TWidgetItem;

export type WidgetProps = {
  editing?: boolean;
  width: string;
  widget: TWidgetItem;
  widgetsInRow: number;
  onRemove: () => void;
  onDrop: (draggedWidget: TDraggableWidget) => void;
};

export const Widget = ({
  editing,
  widget,
  width,
  widgetsInRow,
  onRemove,
  onDrop,
}: WidgetProps) => {
  const ref = React.useRef<React.ComponentRef<"div">>(null);
  const [tags, setTags] = React.useState<
    { name: string; value?: React.ReactNode }[]
  >([]);
  const [isZoomFullScreen, setIsZoomFullScreen] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "widget",
    item: widget,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    canDrag: editing,
  });

  const [{ isOver }, drop] = useDrop<
    TDraggableWidget,
    never,
    { isOver: boolean }
  >({
    accept: "widget",
    drop: (draggedWidget) => {
      onDrop(draggedWidget);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  React.useEffect(() => {
    drop(drag(ref));
  }, [drop, drag]);

  return (
    <div
      ref={ref}
      style={{ width: isZoomFullScreen ? "100%" : width }}
      className={cn(
        "relative",
        isZoomFullScreen && "fixed inset-0 z-50 bg-background",
      )}
    >
      {editing ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute end-1 top-1 z-10 rounded-full bg-tab-active text-tab-active-foreground hover:text-tab-active-foreground"
          onClick={onRemove}
        >
          <XIcon className="size-4" />
        </Button>
      ) : widget.preventFullScreen ? null : (
        <Button
          variant="ghost"
          size="icon"
          className="absolute end-1 top-1 size-6 rounded-full"
          onClick={() => setIsZoomFullScreen((zoom) => !zoom)}
        >
          {isZoomFullScreen ? (
            <MinimizeIcon className="size-4" />
          ) : (
            <MaximizeIcon className="size-4" />
          )}
        </Button>
      )}
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden border-none shadow-md",
          {
            "bg-muted/50": isDragging,
            "bg-muted": isOver,
            "rounded-none": isZoomFullScreen,
          },
        )}
      >
        {!widget.disableTitle && (
          <CardHeader className="pb-0 ~px-3/6 ~pt-3/6">
            <CardTitle className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <widget.icon className="size-4 shrink-0" />
                <p className="line-clamp-1 flex-1 overflow-hidden truncate">
                  {widget.title}
                </p>
              </div>
              <ul className="flex items-center gap-0.5">
                {tags.map((tag) => (
                  <li key={tag.name}>
                    <Badge className="text-nowrap font-medium">
                      {tag.name}: {tag.value}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardTitle>
            {widget.description && (
              <CardDescription>{widget.description}</CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent className="flex flex-1 overflow-hidden p-0">
          <widget.content
            id={widget.id}
            isZoomFullScreen={isZoomFullScreen}
            widgetsInRow={widgetsInRow}
            tags={tags}
            setTags={setTags}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export type WidgetPlaceholderProps = {
  height?: number;
  onDrop: (draggedWidget: TDraggableWidget) => void;
};

export const WidgetPlaceholder = ({
  height,
  onDrop,
}: WidgetPlaceholderProps) => {
  const ref = React.useRef<React.ComponentRef<"div">>(null);
  const t = useTranslations("pages.dashboard.widgets");
  const [{ isOver }, drop] = useDrop<
    TDraggableWidget,
    never,
    { isOver: boolean }
  >({
    accept: "widget",
    drop: (draggedWidget) => {
      onDrop(draggedWidget);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  React.useEffect(() => {
    drop(ref);
  }, [drop]);

  return (
    <div ref={ref}>
      <Card
        style={{ height: height ?? 100 }}
        className={cn(
          "flex select-none items-center justify-center",
          isOver && "bg-muted",
        )}
      >
        {t("drop-here-to-add")}
      </Card>
    </div>
  );
};

export type WidgetListProps = {
  /** If list is editing mode */
  editing?: boolean;

  /** List of rows of user selected widget ids */
  widgets: string[][];

  /** Change widget rows handler */
  setWidgets: (widgets: string[][]) => void;
};

/** List of all user selected widgets */
export const WidgetList = ({
  editing,
  widgets,
  setWidgets,
}: WidgetListProps) => {
  const systemWidgets = useWidgets();
  const widgetsInRow = useResponsiveValue({
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    "2xl": 12,
  });
  const storedWidgets = React.useMemo(() => {
    return widgets
      .map((widgetsInRow, row) => {
        return widgetsInRow
          .map((widget, column) => {
            const systemWidget = systemWidgets.find((w) => w.id === widget);
            if (!systemWidget) return undefined;
            return { ...systemWidget, row, column };
          })
          .filter((w): w is TWidgetItem => !!w);
      })
      .flatMap((row) => splitMaxByKey(row, "size", widgetsInRow))
      .filter((row) => row.length);
  }, [systemWidgets, widgets, widgetsInRow]);

  const handleDrag = (
    targetWidget: TWidgetItem,
    draggedWidget: TDraggableWidget,
  ) => {
    if (targetWidget.id === draggedWidget.id) return;
    if ("column" in draggedWidget) {
      const newWidgets = widgets
        .map((row) => row.filter((widgetId) => widgetId !== draggedWidget.id))
        .filter((row) => !!row.length);
      const newRow = [...newWidgets[targetWidget.row]!];
      newRow.splice(targetWidget.column, 0, draggedWidget.id);
      newWidgets[targetWidget.row] = newRow;
      return setWidgets(newWidgets);
    }
    const newWidgets = [...widgets];
    const newRow = [...newWidgets[targetWidget.row]!];
    newRow.splice(targetWidget.column, 0, draggedWidget.id);
    newWidgets[targetWidget.row] = newRow;
    setWidgets(newWidgets);
  };

  const handleDragPlaceholder = (draggedWidget: TDraggableWidget) => {
    if ("column" in draggedWidget) {
      const newWidgets = [...widgets, [draggedWidget.id]];
      if (newWidgets[draggedWidget.row]!.length > 1) {
        const newRow = [...newWidgets[draggedWidget.row]!];
        newRow.splice(draggedWidget.column, 1);
        newWidgets[draggedWidget.row] = newRow;
        return newWidgets;
      }
      newWidgets.splice(draggedWidget.row, 1);
      return setWidgets(newWidgets);
    }
    setWidgets([...widgets, [draggedWidget.id]]);
  };

  const handleRemoveWidget = (removedWidget: TWidget) => {
    setWidgets(
      widgets
        .map((row) =>
          row.filter(
            (widget) =>
              widget !== removedWidget.id &&
              systemWidgets.find((w) => w.id === widget),
          ),
        )
        .filter((row) => !!row.length),
    );
  };

  return (
    <div className="space-y-4 pb-2">
      {storedWidgets
        .flatMap((row) => splitMaxByKey(row, "size", widgetsInRow))
        .filter((row) => row.length)
        .map((row, index) => {
          const totalSize = sum(row.map((widget) => widget.size));
          return (
            <div key={index} className="flex gap-4">
              {row.map((widget) => (
                <Widget
                  key={widget.id}
                  width={`${(100 * widget.size) / totalSize}%`}
                  widget={widget}
                  editing={editing}
                  widgetsInRow={row.length}
                  onDrop={(dragged) => handleDrag(widget, dragged)}
                  onRemove={() => handleRemoveWidget(widget)}
                />
              ))}
            </div>
          );
        })}
      {editing && (
        <WidgetPlaceholder
          onDrop={(dragged) => handleDragPlaceholder(dragged)}
        />
      )}
    </div>
  );
};

type WidgetPreviewItemProps = {
  widget: TWidget;
  disabled?: boolean;
};

const WidgetPreviewItem = ({ widget, disabled }: WidgetPreviewItemProps) => {
  const ref = React.useRef<React.ComponentRef<typeof Card>>(null);
  const [, drag] = useDrag({
    type: "widget",
    item: widget,
  });

  React.useEffect(() => {
    if (!disabled) {
      drag(ref);
    }
  }, [disabled, drag]);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Card
          ref={ref}
          className={cn("flex size-10 items-center justify-center")}
        >
          <widget.preview />
        </Card>
      </HoverCardTrigger>
      <HoverCardContent>
        <Card>
          <CardContent className="p-1">
            <p className="font-semibold">{widget.title}</p>
            <p className="mt-1 text-sm font-light">{widget.description}</p>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

export type WidgetPreviewListProps = {
  /** List of rows of user selected widget ids */
  widgets: string[][];

  /** Change widget rows handler */
  setWidgets: (widgets: string[][]) => void;
};

/** Widgets preview list which are draggable to WidgetList */
export const WidgetPreviewList = ({
  widgets,
  setWidgets,
}: WidgetPreviewListProps) => {
  const ref = React.useRef<React.ComponentRef<"div">>(null);
  const t = useTranslations("pages.dashboard.widgets");
  const systems = useSystems();
  const systemWidgets = useWidgets();

  const handleRemove = (draggedWidget: TDraggableWidget) => {
    setWidgets(
      widgets
        .map((row) =>
          row.filter(
            (widget) =>
              widget !== draggedWidget.id &&
              systemWidgets.find((w) => w.id === widget),
          ),
        )
        .filter((row) => !!row.length),
    );
  };

  const handleAdd = (draggedWidget: TDraggableWidget) => {
    setWidgets([...widgets, [draggedWidget.id]]);
  };

  const [{ isOver }, drop] = useDrop<
    TDraggableWidget,
    never,
    { isOver: boolean }
  >({
    accept: "widget",
    drop: (draggedWidget) => {
      if (!("column" in draggedWidget)) return;
      handleRemove(draggedWidget);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const customized = React.useMemo(() => {
    return !!systemWidgets.filter((widget) => widget.custom).length;
  }, [systemWidgets]);

  React.useEffect(() => {
    drop(ref);
  }, [drop]);

  const flatWidgets = widgets.flat();

  return (
    <div ref={ref} className="flex h-full flex-col gap-4 p-2">
      <ul className="space-y-2">
        {systems
          .filter((system) => system.widgets.length)
          .map((system) => {
            return (
              <li key={system.title} className="space-y-2">
                <p>{system.title}</p>
                <div className="relative flex flex-wrap gap-2">
                  {system.widgets.map((widget) => {
                    const exists = flatWidgets.includes(widget.id);
                    return (
                      <button
                        key={widget.id}
                        className="relative"
                        onClick={() =>
                          exists ? handleRemove(widget) : handleAdd(widget)
                        }
                      >
                        <div
                          className={cn(
                            "absolute -end-1 -top-1 rounded-full bg-background p-1 shadow-md",
                            exists ? "bg-destructive/50" : "bg-success/50",
                          )}
                        >
                          {exists ? (
                            <MinusIcon className="size-2" />
                          ) : (
                            <PlusIcon className="size-2" />
                          )}
                        </div>
                        <WidgetPreviewItem widget={widget} disabled={exists} />
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        <li className={cn("space-y-2", !customized && "hidden")}>
          <p>{t("custom-widgets")}</p>
          <div className="relative flex flex-wrap gap-2">
            {systemWidgets
              .filter((widget) => widget.custom)
              .map((widget) => {
                const exists = flatWidgets.includes(widget.id);
                return (
                  <button
                    key={widget.id}
                    className="relative"
                    onClick={() =>
                      exists ? handleRemove(widget) : handleAdd(widget)
                    }
                  >
                    <div
                      className={cn(
                        "absolute -end-1 -top-1 rounded-full bg-background p-1 shadow-md",
                        exists ? "bg-destructive/50" : "bg-success/50",
                      )}
                    >
                      {exists ? (
                        <MinusIcon className="size-2" />
                      ) : (
                        <PlusIcon className="size-2" />
                      )}
                    </div>
                    <WidgetPreviewItem widget={widget} disabled={exists} />
                  </button>
                );
              })}
          </div>
        </li>
      </ul>
      {!!flatWidgets.length && (
        <div
          className={cn(
            "hidden flex-1 items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 p-4 lg:flex",
            isOver && "bg-muted",
          )}
        >
          {t("drop-here-to-remove")}
        </div>
      )}
    </div>
  );
};
