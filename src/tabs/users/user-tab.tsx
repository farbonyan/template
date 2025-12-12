import * as React from "react";
import { useTranslations } from "next-intl";

import { UserForm } from "~/components/forms/user";
import { toast } from "~/components/ui/toast";
import { useTabInstance } from "~/contexts/tab-manager";
import { z } from "~/lib/zod";
import { api } from "~/trpc/react";

export const userTabProps = z.object({
  user: z
    .object({
      id: z.string().uuid(),
      name: z.string().trim().min(1),
    })
    .optional(),
});

export type UserTabProps = z.infer<typeof userTabProps>;

/**
 * User's single tab
 */
export const UserTab = ({ user }: UserTabProps) => {
  const t = useTranslations("pages.users");
  const { closeSelf } = useTabInstance();
  const utils = api.useUtils();
  const getUserQuery = api.user.single.useQuery(user?.id ?? "", {
    enabled: !!user,
    refetchOnWindowFocus: false,
  });
  const createUserMutation = api.user.create.useMutation({
    onSuccess: async (data) => {
      toast.success(t("toasts.create.success"));
      await Promise.all([
        utils.user.all.invalidate(),
        utils.user.dropdown.invalidate(),
      ]);
      closeSelf(data.id);
    },
    onError: () => {
      toast.error(t("toasts.create.error"));
    },
  });
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: async (data) => {
      toast.success(t("toasts.update.success"));
      await Promise.all([
        utils.user.all.invalidate(),
        utils.user.dropdown.invalidate(),
        utils.user.single.invalidate(data.id),
      ]);
      closeSelf(data.id);
    },
    onError: () => {
      toast.error(t("toasts.update.error"));
    },
  });

  if (getUserQuery.isFetching) {
    return null;
  }

  return (
    <UserForm
      mode={user ? "update" : "create"}
      loading={createUserMutation.isPending || updateUserMutation.isPending}
      defaultValues={getUserQuery.data}
      onSubmit={(values) => {
        if (!getUserQuery.data) {
          return createUserMutation.mutate(values);
        }
        return updateUserMutation.mutate({
          ...values,
          id: getUserQuery.data.id,
        });
      }}
    />
  );
};
