"use client";

import * as React from "react";
import Image from "next/image";
import { UserCircleIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import type { Columns } from "~/components/data-table";
import type { RouterOutputs } from "~/trpc/react";
import { generateColorsFromString } from "~/utils/colors";

export const defaultColumnVisibility = {
  id: false,
  updatedAt: false,
};

export const defaultGrouping = [];

export const useUsersColumns = () => {
  const t = useTranslations("pages.users");
  const formatter = useFormatter();

  return React.useMemo<Columns<RouterOutputs["user"]["all"][number]>>(
    () => [
      {
        id: "id",
        header: t("table.columns.id"),
        accessorFn: (row) => row.id,
        filterFn: "text",
        enableGlobalFilter: false,
        enableGrouping: false,
        aggregationFn: undefined,
      },
      {
        id: "image",
        accessorFn: (row) => row.avatarId,
        header: "",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableGrouping: false,
        enableSorting: false,
        disableHeader: true,
        cell: ({ getValue, row }) => {
          const src = getValue<string | null>();
          const colors = generateColorsFromString(row.original.name);
          return (
            <div className="relative">
              {src ? (
                <div className="~size-16/12 overflow-hidden rounded-full border bg-background">
                  <Image
                    src={`/api/attachments/${src}`}
                    alt={row.original.name}
                    priority={false}
                    width={48}
                    height={48}
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <UserCircleIcon
                  className="~size-16/12 overflow-hidden rounded-full bg-muted p-4"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                />
              )}
            </div>
          );
        },
      },
      {
        id: "name",
        header: t("table.columns.name"),
        accessorFn: (row) => row.name,
        filterFn: "text",
        enableGlobalFilter: true,
        enableGrouping: false,
        aggregationFn: "count",
        aggregatedCell: ({ getValue }) => {
          return t("table.aggregations.count", { count: getValue<number>() });
        },
        footer: ({ table }) => {
          const count = table.getFilteredRowModel().flatRows.length;
          return t("table.aggregations.count", { count });
        },
        card: { disableFooterLabel: true },
      },
      {
        id: "username",
        header: t("table.columns.username"),
        accessorFn: (row) => row.username,
        filterFn: "text",
        enableGlobalFilter: true,
        enableGrouping: false,
        aggregationFn: undefined,
      },
      {
        id: "position",
        header: t("table.columns.position"),
        accessorFn: (row) => row.position,
        filterFn: "text",
        enableGlobalFilter: true,
        enableGrouping: false,
        aggregationFn: undefined,
      },
      {
        id: "createdAt",
        header: t("table.columns.created-at"),
        accessorFn: (row) => row.createdAt,
        filterFn: "date",
        aggregationFn: undefined,
        enableGrouping: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | null>();
          if (!value) return "-";
          const date = formatter.dateTime(value, "date");
          const time = formatter.dateTime(value, "time");
          return `${time} - ${date}`;
        },
      },
      {
        id: "updatedAt",
        header: t("table.columns.updated-at"),
        accessorFn: (row) => row.updatedAt,
        filterFn: "date",
        aggregationFn: undefined,
        enableGrouping: false,
        cell: ({ getValue }) => {
          const value = getValue<Date | null>();
          if (!value) return "-";
          const date = formatter.dateTime(value, "date");
          const time = formatter.dateTime(value, "time");
          return `${time} - ${date}`;
        },
      },
    ],
    [t, formatter],
  );
};
