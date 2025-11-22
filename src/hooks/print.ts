import * as React from "react";
import * as ReactToPrintPrimitive from "react-to-print";

import { useTextDirection } from "./text-direction";

export const useReactToPrint = (
  props: ReactToPrintPrimitive.UseReactToPrintOptions,
) => {
  const direction = useTextDirection();

  const customPrint = React.useCallback(
    async (printWindow: HTMLIFrameElement) => {
      const printContent =
        printWindow.contentDocument ?? printWindow.contentWindow?.document;
      if (printContent) {
        printContent.dir = direction;
      }
      printWindow.contentWindow?.print();
      return await Promise.resolve();
    },
    [direction],
  );

  return ReactToPrintPrimitive.useReactToPrint({
    pageStyle: `
      @page {
        margin: 8px;
      }

      @media print {
        body,
        html {
          font-size: 8pt !important;
        }
      }
    `,
    print: customPrint,
    ...props,
  });
};
