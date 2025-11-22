import { download, generateCsv, mkConfig } from "export-to-csv";

export const exportCSV = ({
  filename,
  rows,
  headers,
}: {
  filename: string;
  rows: Record<string, string>[];
  headers: { key: string; displayLabel: string }[];
}) => {
  const csvConfig = mkConfig({
    filename,
    fieldSeparator: ",",
    decimalSeparator: ".",
    columnHeaders: headers,
  });
  const csv = generateCsv(csvConfig)(rows);
  download(csvConfig)(csv);
};
