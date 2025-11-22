import * as React from "react";
import { useTranslations } from "next-intl";

import { TemplateForm } from "~/components/forms/template";
import { toast } from "~/components/ui/toast";
import { useTabInstance } from "~/contexts/tab-manager";
import { api } from "~/trpc/react";

/**
 * Create template's tab
 */
export const TemplateTab = () => {
  const t = useTranslations("pages.template");
  const { closeSelf } = useTabInstance();
  const getTablesQuery = api.template.tables.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const createTemplateMutation = api.template.create.useMutation({
    onSuccess: async () => {
      toast.success(t("toasts.create.success"));
      closeSelf();
    },
    onError: () => {
      toast.error(t("toasts.create.error"));
    },
  });

  if (!getTablesQuery.data) return null;

  return (
    <TemplateForm
      loading={createTemplateMutation.isPending}
      tables={getTablesQuery.data}
      onSubmit={createTemplateMutation.mutate}
    />
  );
};
