"use client";

import * as React from "react";
import { EditIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { PasswordForm } from "~/components/forms/password";
import { ProfileForm } from "~/components/forms/profile";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export type ProfileProps = {
  className?: string;
};

export const Profile = ({ className }: ProfileProps) => {
  const t = useTranslations("pages.index.header.profile");
  const session = useSession();
  const [open, setOpen] = React.useState(false);
  const updateUserMutation = api.auth.update.useMutation({
    onSuccess: async (data) => {
      setOpen(false);
      await session.update({
        user: {
          name: data.name,
          position: data.position,
          image: data.avatar ? `/api/attachments/${data.avatar.id}` : undefined,
        },
      });
    },
  });
  const changePasswordMutation = api.auth.password.useMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!session.data?.user}
        className={cn(
          "group relative flex w-full items-center gap-4",
          className,
        )}
      >
        <Avatar className="size-12 shrink-0 border">
          <AvatarImage
            src={session.data?.user.image ?? undefined}
            alt="avatar"
          />
          <AvatarFallback className="bg-scrollbar">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1 text-start">
          {session.data ? (
            <>
              <p className="text-sm font-light">{session.data.user.position}</p>
              <p>{session.data.user.name}</p>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-4 w-1/3 rounded" />
            </>
          )}
        </div>
        <EditIcon className="absolute end-2 top-1/2 size-6 -translate-y-1/2 stroke-2 text-muted-foreground opacity-0 duration-500 group-hover:opacity-100" />
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="truncate">{t("title")}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">{t("account")}</TabsTrigger>
            <TabsTrigger value="password">{t("password")}</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardContent className="p-6">
                {session.data && (
                  <ProfileForm
                    defaultValues={{
                      name: session.data.user.name ?? "",
                      username: session.data.user.username,
                      position: session.data.user.position,
                      avatar: session.data.user.image
                        ? { id: session.data.user.image.split("/").at(-1) }
                        : undefined,
                    }}
                    onSubmit={(values) => {
                      updateUserMutation.mutate(values);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardContent className="p-6">
                <PasswordForm
                  onSubmit={(values) => {
                    changePasswordMutation.mutate(values);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
