import * as React from "react";
import { CheckIcon, ImagePlusIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { FixedCropperRef } from "~/components/ui/cropper";
import type { DefaultValues } from "~/components/ui/form";
import { FormWrapper } from "~/components/forms/form-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { FixedCropper } from "~/components/ui/cropper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { TextInput } from "~/components/ui/text-input";
import { useFileUpload } from "~/hooks/file-upload";
import { cn } from "~/lib/utils";
import { z } from "~/lib/zod";
import { dataUrlToFile } from "~/utils/file";

export const userSchema = z.object({
  name: z.string().trim().min(1),
  avatar: z.object({ id: z.string().uuid() }).nullish(),
  username: z.string().trim().min(1),
  position: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

export type UserSchema = z.infer<typeof userSchema>;

export type UserFormProps = {
  /** Form mode */
  mode: "create" | "update";

  /** Form loading state */
  loading?: boolean;

  /** Default values of the form */
  defaultValues?: DefaultValues<UserSchema> | null;

  /** Submit handler function */
  onSubmit: (values: UserSchema) => void;
};

/**
 * User form component
 */
export const UserForm = ({
  mode,
  loading,
  defaultValues,
  onSubmit,
}: UserFormProps) => {
  const t = useTranslations("forms.user");
  const form = useForm({
    schema: userSchema,
    defaultValues: defaultValues ? { ...defaultValues, password: "*****" } : {},
  });
  const [avatar, setAvatar] = React.useState<File>();
  const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);
  const cropperRef = React.useRef<FixedCropperRef>(null);
  const { upload } = useFileUpload({
    onChange: (attachment) => {
      setAvatar(undefined);
      form.setValue("avatar", attachment);
    },
  });

  return (
    <Form {...form} disabled={loading}>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem className="col-span-full mt-4 flex items-center justify-center">
              <FormControl>
                {(field.value ?? !avatar) ? (
                  <div>
                    <Input
                      ref={inputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        field.onChange(null);
                        setAvatar(file);
                      }}
                    />
                    <Avatar
                      className="relative size-20 cursor-pointer"
                      onClick={() => inputRef.current?.click()}
                    >
                      <AvatarImage
                        src={
                          field.value
                            ? `/api/attachments/${field.value.id}`
                            : undefined
                        }
                      />
                      <AvatarFallback>
                        <UserIcon className="size-4" />
                      </AvatarFallback>
                      <div className="group absolute inset-0 z-10 bg-muted/20">
                        <ImagePlusIcon
                          className={cn(
                            "absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 group-hover:size-10",
                            field.value ? "text-white" : "text-primary",
                          )}
                        />
                      </div>
                    </Avatar>
                  </div>
                ) : (
                  <div className="relative">
                    <FixedCropper
                      ref={cropperRef}
                      src={URL.createObjectURL(avatar)}
                      circle
                      className="aspect-square size-56 rounded-md"
                      stencilSize={{ width: 150, height: 150 }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="action"
                      className="absolute -end-2 -top-2 rounded-full"
                      onClick={async () => {
                        const dataUrl = cropperRef.current
                          ?.getCanvas({ height: 400, width: 400 })
                          ?.toDataURL("image/jpg");
                        if (!dataUrl) return;
                        const file = dataUrlToFile(dataUrl, avatar.name);
                        await upload(file);
                      }}
                    >
                      <CheckIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name.label")}</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder={t("name.placeholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username.label")}</FormLabel>
              <FormControl>
                <TextInput
                  {...field}
                  disabled={mode === "update"}
                  placeholder={t("username.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("position.label")}</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder={t("position.placeholder")} />
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
                <TextInput
                  {...field}
                  disabled={mode === "update"}
                  placeholder={t("password.placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormWrapper>
    </Form>
  );
};
