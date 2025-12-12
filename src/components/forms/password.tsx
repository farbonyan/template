import * as React from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { PasswordInput } from "~/components/ui/password-input";
import { SubmitButton } from "~/components/ui/submit-button";
import { cn } from "~/lib/utils";
import { z } from "~/lib/zod";

export const passwordTextSchemas = {
  minLength: z.string().min(6),
  lowerChars: z.string().regex(/[a-z]/),
  upperChars: z.string().regex(/[A-Z]/),
  numbers: z.string().regex(/[0-9]/),
  specialChars: z.string().regex(/[#?!@$%^&*-]/),
};

export const passwordTextSchema = z
  .string()
  .trim()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/);

export type PasswordTextSchema = z.infer<typeof passwordTextSchema>;

export const passwordSchema = z
  .object({
    current: z.string().trim().min(1),
    password: passwordTextSchema,
    confirm: z.string().trim(),
  })
  .refine((data) => data.password === data.confirm, {
    params: { key: "invalid_confirmation" },
    path: ["confirm"],
  });

export type PasswordSchema = z.infer<typeof passwordSchema>;

export type PasswordFormProps = {
  /** Form loading state */
  loading?: boolean;

  /** Submit handler function */
  onSubmit: (values: PasswordSchema) => void;

  /** Cancel handler function */
  onCancel?: () => void;
};

/**
 * Password form component
 */
export const PasswordForm = ({
  loading,
  onSubmit,
  onCancel,
}: PasswordFormProps) => {
  const t = useTranslations("forms.password");
  const form = useForm({
    schema: passwordSchema,
    defaultValues: {
      current: "",
      password: "",
      confirm: "",
    },
  });

  const password = form.watch("password");
  const hints = {
    "min-length": passwordTextSchemas.minLength.safeParse(password).success,
    "lower-chars": passwordTextSchemas.lowerChars.safeParse(password).success,
    "upper-chars": passwordTextSchemas.upperChars.safeParse(password).success,
    numbers: passwordTextSchemas.numbers.safeParse(password).success,
    "special-chars":
      passwordTextSchemas.specialChars.safeParse(password).success,
  };

  return (
    <Form {...form} disabled={loading}>
      <form
        className="m-1 space-y-4"
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("current-password.label")}</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder={t("current-password.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password.label")}</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder={t("password.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirm-password.label")}</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder={t("confirm-password.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ul className="space-y-0.5 text-sm">
          {Object.entries(hints).map(([name, passed]) => {
            return (
              <li
                key={name}
                className={cn(
                  "flex items-center gap-1",
                  passed ? "text-success" : "text-destructive",
                )}
              >
                {passed ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <XIcon className="size-4" />
                )}
                {t(`password.hints.${name as keyof typeof hints}`)}
              </li>
            );
          })}
        </ul>
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="destructive" onClick={onCancel}>
              {t("cancel")}
            </Button>
          )}
          <SubmitButton variant="default">{t("submit")}</SubmitButton>
        </div>
      </form>
    </Form>
  );
};
