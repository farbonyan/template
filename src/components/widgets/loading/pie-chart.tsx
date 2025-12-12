import { FaChartPie } from "react-icons/fa";

import { cn } from "~/lib/utils";

export type PieChartLoadingProps = {
  className?: string;
};

export const PieChartLoading = ({ className }: PieChartLoadingProps) => {
  return (
    <div className={cn("h-full w-full ~p-4/6", className)}>
      <FaChartPie className="m-auto size-4/5 animate-pulse fill-muted" />
    </div>
  );
};
