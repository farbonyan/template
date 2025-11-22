import FileSaver from "file-saver";
import XLSX from "sheetjs-style";

export const exportExcel = ({
  filename,
  rows,
  merges,
  options,
}: {
  filename: string;
  rows: Record<string, string>[];
  merges?: XLSX.Range[];
  options?: XLSX.JSON2SheetOpts;
  rtl?: boolean;
}) => {
  const ws = XLSX.utils.json_to_sheet(rows, options);
  ws["!merges"] = merges;
  const wb = XLSX.utils.book_new();
  XLSX.utils.format_cell({ t: "z" }, undefined, { bgColor: "red" });
  XLSX.utils.book_append_sheet(wb, ws, "");
  const file = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  }) as BlobPart;
  FileSaver.saveAs(
    new Blob([file], { type: "application/octet-stream" }),
    filename + ".xlsx",
  );
};
