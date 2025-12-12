import { Card, CardContent } from "./card";

export type InfoCardProps = {
  rows: { label: string; value: React.ReactNode }[];
};

export const InfoCard = ({ rows }: InfoCardProps) => {
  if (rows.every((row) => typeof row.value === "undefined")) {
    return null;
  }
  return (
    <Card>
      <CardContent className="grid grid-cols-1 p-4 md:grid-cols-4">
        {rows.map((row, index) => {
          if (typeof row.value === "undefined") return null;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="font-semibold">{row.label}:</span>
              <span>{row.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
