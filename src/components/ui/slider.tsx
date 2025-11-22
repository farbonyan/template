"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useFormatter } from "next-intl";

import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type SliderProps = SliderPrimitive.SliderProps & {
  showTooltip?: boolean;
};

const Slider = React.forwardRef<HTMLElement, SliderProps>(
  ({ className, showTooltip = false, ...props }, ref) => {
    const formatter = useFormatter();
    const [showTooltipState, setShowTooltipState] = React.useState(false);

    const handlePointerDown = () => {
      setShowTooltipState(true);
    };

    const handlePointerUp = () => {
      setShowTooltipState(false);
    };

    React.useEffect(() => {
      document.addEventListener("pointerup", handlePointerUp);
      return () => {
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }, []);

    const v = props.value?.[0];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
        onPointerDown={handlePointerDown}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <Tooltip open={showTooltip && showTooltipState}>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onMouseEnter={() => setShowTooltipState(true)}
              onMouseLeave={() => setShowTooltipState(false)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{typeof v === "number" ? formatter.number(v) : null}</p>
          </TooltipContent>
        </Tooltip>
      </SliderPrimitive.Root>
    );
  },
);

export { Slider };
