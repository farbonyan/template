"use client";

import * as React from "react";
import { Pin, X } from "lucide-react";

import { useAutoAnimate } from "~/hooks/auto-animate";
import { cn } from "~/lib/utils";
import { Button } from "./button";

type SlideOverProps = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  classNames?: {
    /** Container component class */
    container?: string;
    /** Content wrapper class */
    content?: string;
    /** Slide over component class */
    slideOver?: string;
    /** Slide component wrapper class */
    slider?: string;
  };
  /** Is slide over pinned by default */
  defaultPinned?: boolean;
  SliderComponent?: React.ReactNode;
}>;

const SlideOver = ({
  open,
  onClose,
  classNames,
  defaultPinned,
  SliderComponent,
  children,
}: SlideOverProps) => {
  const [pin, setPin] = React.useState(defaultPinned);
  const [parent] = useAutoAnimate();

  const handleClose = () => {
    setPin(defaultPinned);
    onClose();
  };

  const togglePin = () => setPin((pin) => !pin);

  return (
    <div
      ref={parent}
      className={cn(
        "relative h-full w-full overflow-hidden",
        { flex: open && pin },
        classNames?.container,
      )}
    >
      <div
        className={cn(
          "h-full flex-1 overflow-hidden",
          { "hidden sm:block": open && pin },
          classNames?.content,
        )}
      >
        {children}
      </div>
      {open && (
        <div
          className={cn(
            "absolute h-full w-full bg-background sm:w-2/3 md:w-1/2 xl:w-1/3",
            pin ? "relative ms-2" : "inset-y-0 end-0 z-50 shadow-md",
            classNames?.slideOver,
          )}
        >
          <div className="flex h-full flex-col overflow-auto border">
            <div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="size-3.5" />
              </Button>
              <Button
                className="hidden sm:inline-flex"
                variant="ghost"
                size="icon"
                onClick={togglePin}
              >
                <Pin className={cn("size-3.5", pin && "fill-black")} />
              </Button>
            </div>
            <div className={cn("flex-1 overflow-hidden", classNames?.slider)}>
              {SliderComponent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SlideOver, type SlideOverProps };
