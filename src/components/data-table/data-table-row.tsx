"use client";

import type { GroupingState, Header, Row, Table } from "@tanstack/react-table";
import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  ChevronDownIcon,
  MoreHorizontalIcon,
  ReceiptTextIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { RowAction } from "./types";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TableCell, TableRow } from "~/components/ui/table";
import { useIsRtl } from "~/hooks/is-rtl";
import { useResponsive } from "~/hooks/responsive";
import { cn } from "~/lib/utils";
import { getCommonPinningStyles, getVisibleActions } from "./utils";

type RowActionsProps<TData> = {
  row: Row<TData, TData>;
  context?: boolean;
  actions: RowAction<TData>[];
  onClose: () => void;
};

const RowActions = <TData,>({
  row,
  context,
  actions,
  onClose,
}: RowActionsProps<TData>) => {
  const { isMdUp } = useResponsive();
  const MenuSeparator = context ? ContextMenuSeparator : DropdownMenuSeparator;
  const MenuItem = context ? ContextMenuItem : DropdownMenuItem;
  const MenuSub = context ? ContextMenuSub : DropdownMenuSub;
  const MenuSubTrigger = context
    ? ContextMenuSubTrigger
    : DropdownMenuSubTrigger;
  const MenuSubContent = context
    ? ContextMenuSubContent
    : DropdownMenuSubContent;
  const MenuPortal = context ? ContextMenuPortal : DropdownMenuPortal;

  const visibleActions = React.useMemo(
    () => getVisibleActions(actions, row),
    [actions, row],
  );

  return (
    <>
      {visibleActions.map((action, index) => {
        const showSeparator =
          index > 0 &&
          (typeof action.separator === "function"
            ? action.separator(row)
            : action.separator);
        return (
          <React.Fragment key={action.name}>
            {showSeparator && <MenuSeparator className="mx-2" />}
            {"onClick" in action ? (
              <MenuItem
                disabled={
                  typeof action.disabled === "function"
                    ? action.disabled(row)
                    : action.disabled
                }
                onClick={() => {
                  onClose();
                  return action.onClick(row);
                }}
              >
                {action.icon && <action.icon className="me-2 size-4" />}
                <span>{action.name}</span>
              </MenuItem>
            ) : (
              <MenuSub>
                <MenuSubTrigger>
                  <div className="flex items-center gap-2">
                    {action.icon && <action.icon className="size-4" />}
                    <span>{action.name}</span>
                  </div>
                </MenuSubTrigger>
                <MenuPortal>
                  <MenuSubContent
                    sideOffset={isMdUp ? 0 : -150}
                    alignOffset={isMdUp ? 0 : 50}
                  >
                    <RowActions
                      context={context}
                      row={row}
                      actions={action.children}
                      onClose={onClose}
                    />
                  </MenuSubContent>
                </MenuPortal>
              </MenuSub>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

type LeafRowProps<TData> = {
  table: Table<TData>;
  row: Row<TData, TData>;
  grouping: GroupingState;
  batchSelection: boolean;
  actions?: RowAction<TData>[];
  enableRowSelection?: boolean;
  openRowDetails?: Row<TData, TData>;
  getShowDetails?: (row: Row<TData, TData>) => boolean;
  onShowDetails?: (row: Row<TData, TData>) => void;
  getActiveRow?: (row: Row<TData, TData>) => boolean;
};

const LeafRow = <TData,>({
  row,
  grouping,
  actions,
  batchSelection,
  enableRowSelection = true,
  openRowDetails,
  onShowDetails,
  getShowDetails,
  getActiveRow,
}: LeafRowProps<TData>) => {
  const t = useTranslations("components.data-table");
  const isRtl = useIsRtl();
  const [open, setOpen] = React.useState(false);
  const [openContext, setOpenContext] = React.useState(false);
  const isSelected = row.getIsSelected();
  const isActive = isSelected || openRowDetails?.id === row.id;

  const visibleActions = React.useMemo(() => {
    return actions?.filter((action) =>
      typeof action.invisible === "function"
        ? !action.invisible(row)
        : !action.invisible,
    );
  }, [actions, row]);

  const showDetails = React.useMemo(
    () => onShowDetails && (getShowDetails?.(row) ?? true),
    [getShowDetails, onShowDetails, row],
  );

  const showOptions = React.useMemo(
    () => !!showDetails || !!visibleActions?.length,
    [showDetails, visibleActions?.length],
  );

  return (
    <ContextMenu
      modal
      dir={isRtl ? "rtl" : "ltr"}
      onOpenChange={setOpenContext}
    >
      <ContextMenuTrigger asChild disabled={batchSelection}>
        <TableRow
          className={cn("h-px hover:bg-table-row-active/40", {
            "bg-table-row-active hover:bg-table-row-active":
              isActive || open || openContext || getActiveRow?.(row),
          })}
          onContextMenu={!showOptions ? (e) => e.preventDefault() : undefined}
          onDoubleClick={() => {
            const primaryAction = visibleActions?.find((action) => {
              if (!("primary" in action) || !action.primary) return false;
              const disabled =
                typeof action.disabled === "function"
                  ? action.disabled(row)
                  : action.disabled;
              return !disabled;
            });
            if (!primaryAction || !("onClick" in primaryAction)) return;
            return primaryAction.onClick(row);
          }}
        >
          {!!grouping.length && (
            <TableCell className="bg-primary/5" colSpan={grouping.length} />
          )}
          <TableCell
            className={enableRowSelection ? undefined : "w-0 p-0 sm:p-0"}
          >
            {enableRowSelection && (
              <Checkbox
                disabled={!row.getCanSelect()}
                checked={isSelected}
                onCheckedChange={row.getToggleSelectedHandler()}
                className="align-middle data-[state=checked]:bg-table-checkbox-active"
              />
            )}
          </TableCell>
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              style={{
                ...getCommonPinningStyles(cell.column),
                maxWidth: cell.column.columnDef.maxSize,
                minWidth: cell.column.columnDef.minSize,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
          <TableCell className={cn("w-0", !showOptions && "p-0")}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={openContext}
                  className={cn(
                    "hidden size-6 p-1 md:block",
                    !showOptions && "invisible",
                  )}
                >
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                align="start"
                side={isRtl ? "right" : "left"}
              >
                <DropdownMenuGroup>
                  {actions && (
                    <RowActions
                      row={row}
                      actions={actions}
                      onClose={() => setOpen(false)}
                    />
                  )}
                </DropdownMenuGroup>
                {showDetails && (
                  <>
                    {!!visibleActions?.length && (
                      <DropdownMenuSeparator className="mx-2" />
                    )}
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => onShowDetails?.(row)}>
                        <ReceiptTextIcon className="me-2 size-4" />
                        <span>{t("show-details")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent onInteractOutside={(e) => e}>
        <ContextMenuGroup>
          {actions && (
            <RowActions
              context
              row={row}
              actions={actions}
              onClose={() => setOpen(false)}
            />
          )}
        </ContextMenuGroup>
        {showDetails && (
          <>
            {!!visibleActions?.length && (
              <ContextMenuSeparator className="mx-2" />
            )}
            <ContextMenuGroup>
              <ContextMenuItem onClick={() => onShowDetails?.(row)}>
                <ReceiptTextIcon className="me-2 size-4" />
                <span>{t("show-details")}</span>
              </ContextMenuItem>
            </ContextMenuGroup>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

type AggregatedRowProps<TData> = {
  row: Row<TData, TData>;
  grouping: GroupingState;
};

const AggregatedRow = <TData,>({
  row,
  grouping,
}: AggregatedRowProps<TData>) => {
  return (
    <TableRow className="h-px">
      <TableCell className="bg-primary/5" colSpan={row.depth + 1} />
      <TableCell
        className="bg-primary/5"
        colSpan={grouping.length - row.depth}
      />
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell
            key={cell.id}
            className="bg-primary/5"
            style={getCommonPinningStyles(cell.column)}
          >
            {!cell.getIsPlaceholder() &&
              cell.getIsAggregated() &&
              flexRender(
                cell.column.columnDef.aggregatedCell,
                cell.getContext(),
              )}
          </TableCell>
        );
      })}
      <TableCell className="bg-primary/5" />
    </TableRow>
  );
};

type DataTableRowProps<TData> = {
  table: Table<TData>;
  row: Row<TData, TData>;
  grouping: GroupingState;
  actions?: RowAction<TData>[];
  batchSelection: boolean;
  enableRowSelection?: boolean;
  openRowDetails?: Row<TData, TData>;
  onShowDetails?: (row: Row<TData, TData>) => void;
  getShowDetails?: (row: Row<TData, TData>) => boolean;
  getActiveRow?: (row: Row<TData, TData>) => boolean;
};

export const DataTableRow = <TData,>({
  table,
  row,
  grouping,
  actions,
  batchSelection,
  enableRowSelection = true,
  openRowDetails,
  onShowDetails,
  getShowDetails,
  getActiveRow,
}: DataTableRowProps<TData>) => {
  if (!row.getIsGrouped()) {
    return (
      <LeafRow
        table={table}
        row={row}
        grouping={grouping}
        actions={actions}
        batchSelection={batchSelection}
        enableRowSelection={enableRowSelection}
        openRowDetails={openRowDetails}
        onShowDetails={onShowDetails}
        getShowDetails={getShowDetails}
        getActiveRow={getActiveRow}
      />
    );
  }

  if (row.isAggregated) {
    return <AggregatedRow row={row} grouping={grouping} />;
  }

  const groupedCell = row.getVisibleCells().find((cell) => cell.getIsGrouped());
  if (!groupedCell) return null;

  const isExpanded = row.getIsExpanded();
  const toggleExpanded = row.getToggleExpandedHandler();

  const canSelectSubRows = row.getCanSelectSubRows();
  const canMultiSelect = row.getCanMultiSelect();

  return (
    <>
      <TableRow className="h-px">
        <TableCell className="w-0 bg-primary/5" colSpan={row.depth + 1} />
        <TableCell
          className="w-0 cursor-pointer bg-tab-active p-0 dark:bg-tab-active/50"
          onClick={toggleExpanded}
        >
          <ChevronDownIcon
            className={cn(
              "ms-auto transition-transform",
              !isExpanded && "ltr:-rotate-90 rtl:rotate-90",
            )}
          />
        </TableCell>
        <TableCell
          className="cursor-pointer bg-tab-active dark:bg-tab-active/50"
          colSpan={table.getLeafHeaders().length + grouping.length}
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-2">
            {enableRowSelection && (
              <Checkbox
                disabled={!canSelectSubRows || !canMultiSelect}
                checked={
                  !canSelectSubRows
                    ? false
                    : row.getIsSomeSelected()
                      ? "indeterminate"
                      : row.getIsAllSubRowsSelected()
                }
                onCheckedChange={(checkState) => {
                  if (checkState === "indeterminate") return;
                  row.toggleExpanded(checkState);
                  row.toggleSelected(checkState);
                }}
                onClick={(e) => e.stopPropagation()}
                className="align-middle data-[state=checked]:bg-table-checkbox-active"
              />
            )}
            <div
              data-placement="grouping"
              className="group flex items-center gap-1"
            >
              <span className="text-nowrap">
                {flexRender(groupedCell.column.columnDef.header, {
                  table,
                  column: groupedCell.column,
                  header: { column: groupedCell.column } as Header<
                    TData,
                    unknown
                  >,
                })}
              </span>
              <span>:</span>
              {flexRender(
                groupedCell.column.columnDef.cell,
                groupedCell.getContext(),
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
