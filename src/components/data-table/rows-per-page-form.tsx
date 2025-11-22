import * as React from "react";

import { NumberInput } from "~/components/ui/number-input";

export type RowsPerPageFormProps = {
  /** Default rows per page */
  defaultRowsPerPage?: number;

  /** Data count */
  count: number;

  /** Submit handler function */
  onSubmit: (rowsPerPage: number) => void;
};

/**
 * Rows per page form component
 */
export const RowsPerPageForm = ({
  defaultRowsPerPage,
  count,
  onSubmit,
}: RowsPerPageFormProps) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(
    defaultRowsPerPage ?? 100,
  );

  const handleSubmit = () => {
    const newRowsPerPage = Math.min(rowsPerPage, count);
    setRowsPerPage(newRowsPerPage);
    onSubmit(newRowsPerPage);
  };

  return (
    <div className="flex items-center gap-1">
      <NumberInput
        className="w-16"
        value={rowsPerPage}
        onChange={(newRowsPerPage) => {
          if (typeof newRowsPerPage !== "number") return;
          setRowsPerPage(newRowsPerPage);
        }}
        onBlur={() => {
          handleSubmit();
        }}
        onKeyDownCapture={(e) => {
          if (e.code === "Enter") {
            handleSubmit();
          }
        }}
      />
    </div>
  );
};
