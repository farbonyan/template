import * as React from "react";

import { NumberInput } from "~/components/ui/number-input";
import { usePreviousValue } from "~/hooks/previous-value";
import { getBetween } from "~/utils/number";

export type PageFormProps = {
  /** Default rows per page */
  defaultPage?: number;

  /** Number of pages */
  pages: number;

  /** Submit handler function */
  onSubmit: (page: number) => void;
};

/**
 * Rows per page form component
 */
export const PageForm = ({ defaultPage, pages, onSubmit }: PageFormProps) => {
  const [page, setPage] = React.useState<number | undefined>(defaultPage ?? 1);

  usePreviousValue(defaultPage, () => setPage(defaultPage));

  const getValidPage = getBetween(1, pages);

  const handleSubmit = () => {
    if (!page) {
      setPage(defaultPage);
      return;
    }
    const validPage = getValidPage(page);
    setPage(validPage);
    onSubmit(validPage);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <NumberInput
        className="w-12"
        value={page}
        disabled={pages === 1}
        onChange={(newPage) => {
          setPage(newPage ?? undefined);
        }}
        onBlur={handleSubmit}
      />
    </form>
  );
};
