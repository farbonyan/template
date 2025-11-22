"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDrag, useDrop } from "react-dnd";

import type { Tab } from "./tab-context";
import { Button } from "~/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from "~/components/ui/hybrid-tooltip";
import { useIsRtl } from "~/hooks/is-rtl";
import { cn } from "~/lib/utils";
import { useTabContext } from "./tab-context";

type TabTitleProps = {
  tab: Tab;
  tabs: Tab[];
  isActive: boolean;
  onClick: (id: string) => void;
  onDrop: (tab: Tab) => void;
  onCloseTab: (id: string) => void;
  onCloseAllTabs: () => void;
  onCloseOtherTabs: (id: string) => void;
};

const TabTitle = ({
  tab,
  isActive,
  onClick,
  onDrop,
  onCloseTab,
  onCloseAllTabs,
  onCloseOtherTabs,
}: TabTitleProps) => {
  const t = useTranslations("components.dynamic-tabs");
  const ref = React.useRef<React.ComponentRef<"span">>(null);
  const tabRef = React.useRef<React.ComponentRef<typeof Button>>(null);
  const [open, setOpen] = React.useState(false);
  const [overflow, setOverflow] = React.useState(false);

  const [, drag] = useDrag({
    type: "tab",
    item: tab,
  });

  const [, drop] = useDrop<Tab>({
    accept: "tab",
    drop: onDrop,
  });

  React.useEffect(() => {
    if (!ref.current) return;
    setOverflow(ref.current.scrollWidth > ref.current.clientWidth);
  }, []);

  React.useEffect(() => {
    drop(drag(tabRef));
  }, [drag, drop]);

  return (
    <HybridTooltip open={open && overflow} onOpenChange={setOpen}>
      <ContextMenu>
        <HybridTooltipTrigger asChild>
          <ContextMenuTrigger asChild>
            <Button
              type="button"
              ref={tabRef}
              variant="outline"
              onClick={() => onClick(tab.id)}
              className={cn(
                "select-none rounded-none border-0 bg-tab text-tab-foreground ~h-10/12 hover:bg-tab/80 focus-visible:ring-0",
                isActive &&
                  "bg-tab-active text-tab-active-foreground hover:bg-tab-active/50 hover:text-tab-active-foreground",
              )}
              onAuxClick={(e) => {
                if (e.button !== 1) {
                  return;
                }
                if (e.altKey) {
                  return onCloseOtherTabs(tab.id);
                }
                onCloseTab(tab.id);
              }}
            >
              <tab.icon className="me-2 size-4" />
              <span
                ref={ref}
                className="max-w-[100px] truncate text-nowrap md:max-w-[150px]"
              >
                {tab.title}
              </span>
              {tab.closable && (
                <XIcon
                  className="ms-2 size-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                />
              )}
            </Button>
          </ContextMenuTrigger>
        </HybridTooltipTrigger>
        <HybridTooltipContent side="top" className="w-auto max-w-[100vw]">
          <div className="flex items-center gap-2">
            <tab.icon className="size-4 shrink-0" />
            <p className="line-clamp-2">{tab.title}</p>
          </div>
        </HybridTooltipContent>
        <ContextMenuContent>
          <ContextMenuGroup>
            {tab.closable && (
              <>
                <ContextMenuItem onClick={() => onCloseTab(tab.id)}>
                  {t("close")}
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            <ContextMenuItem onClick={() => onCloseOtherTabs(tab.id)}>
              {t("close-others")}
            </ContextMenuItem>
            <ContextMenuItem onClick={onCloseAllTabs}>
              {t("close-all")}
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </HybridTooltip>
  );
};

export const TabList = () => {
  const {
    tabs,
    activeTabId,
    closeTab,
    changeTab,
    closeAllTabs,
    closeOtherTabs,
    moveTabs,
  } = useTabContext();
  const isRtl = useIsRtl();
  const activeTabRef = React.useRef<React.ComponentRef<"li">>(null);
  const tabsRef = React.useRef<React.ComponentRef<"div">>(null);
  const [showPrevious, setShowPrevious] = React.useState(false);
  const [showNext, setShowNext] = React.useState(false);

  const updateScrollButtons = React.useCallback(() => {
    if (!tabsRef.current) return;
    const isAtStart = isRtl
      ? tabsRef.current.scrollLeft >= 0
      : tabsRef.current.scrollLeft <= 0;
    const isAtEnd =
      tabsRef.current.clientWidth +
        (isRtl ? -tabsRef.current.scrollLeft : tabsRef.current.scrollLeft) >=
      tabsRef.current.scrollWidth - 2;
    setShowPrevious(!isAtStart);
    setShowNext(!isAtEnd);
  }, [isRtl]);

  React.useEffect(() => {
    activeTabRef.current?.scrollIntoView();
  }, [activeTabId]);

  React.useEffect(() => {
    if (!activeTabRef.current) return;
    activeTabRef.current.scrollIntoView();
    updateScrollButtons();
  }, [updateScrollButtons, activeTabRef, activeTabId]);

  React.useEffect(() => {
    updateScrollButtons();
  }, [tabs, updateScrollButtons]);

  const scrollPrevious = React.useCallback(() => {
    if (!tabsRef.current) return;
    const scrollAmount = Math.max(
      (isRtl ? -tabsRef.current.scrollLeft : tabsRef.current.scrollLeft) -
        tabsRef.current.clientWidth,
      0,
    );
    tabsRef.current.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, [isRtl]);

  const scrollNext = React.useCallback(() => {
    if (!tabsRef.current) return;
    const scrollAmount = Math.min(
      (isRtl ? -tabsRef.current.scrollLeft : tabsRef.current.scrollLeft) +
        tabsRef.current.clientWidth,
      tabsRef.current.scrollWidth - tabsRef.current.clientWidth,
    );
    tabsRef.current.scrollTo({
      left: isRtl ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, [isRtl]);

  return (
    <div className="relative flex items-end justify-center overflow-hidden rounded-lg">
      <div
        ref={tabsRef}
        onScroll={updateScrollButtons}
        className="flex-1 overflow-x-auto no-scrollbar"
      >
        <ul className="flex w-max items-end divide-x overflow-hidden rounded-lg border rtl:divide-x-reverse">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <li ref={isActive ? activeTabRef : undefined} key={tab.id}>
                <TabTitle
                  tab={tab}
                  tabs={tabs}
                  isActive={isActive}
                  onClick={changeTab}
                  onDrop={(draggedTab) => moveTabs(draggedTab.id, tab.id)}
                  onCloseTab={closeTab}
                  onCloseAllTabs={closeAllTabs}
                  onCloseOtherTabs={closeOtherTabs}
                />
              </li>
            );
          })}
        </ul>
      </div>
      {showPrevious && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute inset-y-0 start-0 h-full"
          onClick={scrollPrevious}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </Button>
      )}
      {showNext && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute inset-y-0 end-0 h-full"
          onClick={scrollNext}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Button>
      )}
    </div>
  );
};
