import { cn } from "~/lib/utils";

export type BarChartLoadingProps = {
  length?: number;
  className?: string;
};

export const BarChartLoading = ({
  length = 10,
  className,
}: BarChartLoadingProps) => {
  return (
    <div className={cn("h-full w-full ~p-4/6", className)}>
      <div className="flex h-full min-h-96 w-full items-end justify-evenly border-b">
        {Array.from({ length }).map((_, index) => {
          return (
            <div
              key={index}
              style={{
                width: `${50 / length}%`,
                height: `${Math.random() * 100}%`,
              }}
              className="animate-pulse rounded-t-md bg-muted transition-all"
            ></div>
          );
        })}
      </div>
    </div>
  );
};
