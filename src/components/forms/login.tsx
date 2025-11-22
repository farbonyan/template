import { useTranslations } from "next-intl";

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
import { TextInput } from "~/components/ui/text-input";
import { z } from "~/lib/zod";

const authSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type AuthSchema = z.infer<typeof authSchema>;

type LoginFormProps = {
  loading?: boolean;
  onSubmit: (values: AuthSchema) => void;
};

export const LoginForm = ({ loading, onSubmit }: LoginFormProps) => {
  const t = useTranslations("forms.login");
  const form = useForm({
    schema: authSchema,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-1 space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-bold text-tab-active-foreground">
                {t("username")}
              </FormLabel>
              <FormControl>
                <TextInput {...field} className="text-foreground" />
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
              <FormLabel className="text-base font-bold text-tab-active-foreground">
                {t("password")}
              </FormLabel>
              <FormControl>
                <PasswordInput {...field} className="text-foreground" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton variant="default" loading={loading} className="w-full">
          {t("submit")}
        </SubmitButton>
      </form>
    </Form>
  );
};
