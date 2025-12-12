import { BarChartLoading } from "./bar-chart";
import { PieChartLoading } from "./pie-chart";

export type ChartLoadingProps = {
  type?: "bar" | "pie";
  className?: string;
};

export const ChartLoading = ({ type, ...props }: ChartLoadingProps) => {
  switch (type) {
    case "pie":
      return <PieChartLoading {...props} />;
    default:
      return <BarChartLoading {...props} />;
  }
};
