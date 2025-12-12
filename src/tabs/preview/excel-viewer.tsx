import React from "react";
import Spreadsheet from "react-spreadsheet";
import XLSX from "sheetjs-style";

type Cell = { value: unknown; readOnly: boolean };

type ExcelViewerProps = {
  url: string;
  fallback?: React.ReactNode;
};

const ExcelViewer = ({ url, fallback }: ExcelViewerProps) => {
  const ref = React.useRef<React.ComponentRef<"div">>(null);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Cell[][]>([]);

  React.useEffect(() => {
    const fetchAndParse = async () => {
      setLoading(true);
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status}`);
        const blob = await resp.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) throw new Error("Invalid sheet");
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) throw new Error("Invalid worksheet");
        const rows = XLSX.utils.sheet_to_json<unknown[][]>(worksheet, {
          header: 1,
        });
        const empty = Array.from<Cell>({
          length: 10 - (rows.at(0)?.length ?? 0),
        }).fill({ value: "", readOnly: true });
        setData(
          rows.map((row) => [
            ...row.map((cell) => ({ value: cell, readOnly: true })),
            ...empty,
          ]),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchAndParse();
  }, [url]);

  return (
    <div ref={ref} dir="ltr" className="w-full">
      {loading ? fallback : <Spreadsheet data={data} />}
    </div>
  );
};

export { ExcelViewer, type ExcelViewerProps };
