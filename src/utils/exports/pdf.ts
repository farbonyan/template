import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { font } from "./font";

export const exportTablePDF = ({
  filename,
  rows,
  headers,
  rtl,
}: {
  filename: string;
  rows: string[][];
  headers: string[];
  rtl?: boolean;
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "A4",
  });

  doc.addFileToVFS("Rubik-Regular.ttf", font);
  doc.addFont("Rubik-Regular.ttf", "Rubik", "normal");
  doc.setFont("Rubik");

  autoTable(doc, {
    head: rtl ? [headers.reverse()] : [headers],
    body: rtl ? rows.map((row) => row.reverse()) : rows,
    theme: "striped",
    styles: {
      font: "Rubik",
      fontStyle: "normal",
      fontSize: 8,
      halign: rtl ? "right" : "left",
      cellPadding: { top: 1, right: 0.5, bottom: 1, left: 0.5 },
    },
    margin: 10,
    headStyles: {
      halign: "center",
    },
    bodyStyles: {
      halign: rtl ? "right" : "left",
    },
  });

  doc.save(`${filename}.pdf`);
};
