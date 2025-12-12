"use client";

import * as React from "react";

import { DataTableSkeleton } from "~/components/data-table";
import { defaultColumnVisibility, useUsersColumns } from "./users-columns";

/**
 * Users loading page
 */
export const UsersLoadingTab = () => {
  const columns = useUsersColumns();

  return (
    <DataTableSkeleton
      columns={columns}
      defaultColumnVisibility={defaultColumnVisibility}
    />
  );
};
