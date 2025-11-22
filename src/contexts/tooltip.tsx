"use client";

import { TooltipProvider as __TooltipProvider } from "~/components/ui/tooltip";

/** SSR friendly tooltip provider */
export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <__TooltipProvider>{children}</__TooltipProvider>;
};
