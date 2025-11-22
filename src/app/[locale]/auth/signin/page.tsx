"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { LoginForm } from "~/components/forms/login";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useRouter } from "~/i18n/routing";

export default function Signin() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const params = useSearchParams();

  React.useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-primary to-primary/40 to-80%">
      <div
        dir="ltr"
        className="absolute space-y-4 text-white ~bottom-8/16 ~left-8/16"
      >
        <Image
          src="/img/app-logo-dark.png"
          alt="logo"
          priority
          width={200}
          height={200}
          className="~w-24/32"
        />
      </div>
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-[600px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/img/mascot-files.png"
          alt="mascot"
          priority
          width={400}
          height={400}
          className="absolute right-1/2 -translate-y-1/2 translate-x-3/4 ~w-[30rem]/[40rem] sm:right-1/3 lg:right-1/4"
        />
        <div className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-neutral-200 to-transparent p-2 shadow-lg backdrop-blur-sm">
          <Card className="z-10 h-full w-full rounded-2xl bg-transparent bg-gradient-to-br from-neutral-400 to-transparent text-white ~p-4/8">
            <VisuallyHidden>
              <CardHeader>
                <CardTitle>{t("pages.login.title")}</CardTitle>
              </CardHeader>
            </VisuallyHidden>
            <CardContent>
              <Image
                src="/img/logo.png"
                alt="logo"
                width="200"
                height="100"
                className="mx-auto w-auto object-cover ~h-28/36"
                priority
                unoptimized
              />
              <LoginForm
                loading={loading}
                onSubmit={async (values) => {
                  try {
                    setLoading(true);
                    const res = await signIn("credentials", {
                      ...values,
                      redirect: false,
                      callbackUrl: params.get("callbackUrl") ?? "/",
                    });
                    if (res?.ok) {
                      router.push(res.url ?? "/");
                      return;
                    }
                    toast.error(t("pages.login.invalid-credentials"));
                    setLoading(false);
                  } catch {
                    toast.error(t("pages.login.invalid-credentials"));
                    setLoading(false);
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
