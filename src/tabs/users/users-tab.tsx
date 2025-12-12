"use client";

import * as React from "react";
import { EditIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RowAction } from "~/components/data-table";
import type { RouterOutputs } from "~/trpc/react";
import { DataTable } from "~/components/data-table";
import { toast } from "~/components/ui/toast";
import { useConfirmation } from "~/contexts/confirmation";
import { useTabOpener } from "~/contexts/tab-manager";
import { api } from "~/trpc/react";
import {
  defaultColumnVisibility,
  defaultGrouping,
  useUsersColumns,
} from "./users-columns";
import { UsersLoadingTab } from "./users-loading-tab";

export const UsersTab = () => {
  const t = useTranslations("pages.users");
  const openTab = useTabOpener();
  const { confirm } = useConfirmation();
  const getUsersQuery = api.user.all.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const deleteUserMutation = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success(t("toasts.delete.success"));
      return getUsersQuery.refetch();
    },
    onError: () => {
      toast.error(t("toasts.delete.error"));
    },
  });
  const columns = useUsersColumns();

  const rowActions = React.useMemo<
    RowAction<RouterOutputs["user"]["all"][number]>[]
  >(() => {
    return [
      {
        primary: true,
        name: t("table.actions.edit"),
        icon: EditIcon,
        onClick: (row) => {
          void openTab("users.single", {
            user: {
              id: row.original.id,
              name: row.original.name,
            },
          });
        },
      },
      {
        name: t("table.actions.delete.name"),
        icon: TrashIcon,
        onClick: (row) => {
          confirm({
            title: t("table.actions.delete.confirmation.title", {
              name: row.original.name,
            }),
            message: t("table.actions.delete.confirmation.message", {
              name: row.original.name,
            }),
            buttons: [
              {
                label: t("table.actions.delete.confirmation.no"),
                variant: "outline",
              },
              {
                label: t("table.actions.delete.confirmation.yes"),
                variant: "destructive",
                onClick: () => deleteUserMutation.mutate(row.original.id),
              },
            ],
          });
        },
      },
    ];
  }, [t, openTab, confirm, deleteUserMutation]);

  if (!getUsersQuery.data) {
    return <UsersLoadingTab />;
  }

  return (
    <DataTable
      data={getUsersQuery.data}
      getRowId={(row) => row.id}
      columns={columns}
      settingsKey="users"
      enableRowSelection={false}
      rowActions={rowActions}
      onCreate={() => openTab("users.single", {})}
      isRefreshing={getUsersQuery.isRefetching}
      onRefresh={() => getUsersQuery.refetch()}
      defaultColumnVisibility={defaultColumnVisibility}
      defaultGrouping={defaultGrouping}
    />
  );
};
