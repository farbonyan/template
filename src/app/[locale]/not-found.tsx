"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useRouter } from "~/i18n/routing";

export default function NotFound() {
  const t = useTranslations("pages.not-found");
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-12 p-4">
      <Image
        src="/img/error-404.png"
        alt="error code 404"
        width={800}
        height={600}
        priority
        className="h-auto ~w-[20rem]/[30rem]"
      />
      <div className="space-y-10 text-center">
        <h1 className="font-extrabold text-primary ~text-3xl/7xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground ~text-base/xl">
          {t("description")}
        </p>
        <Button size="lg" variant="default" onClick={() => router.back()}>
          {t("return")}
        </Button>
      </div>
    </div>
  );
}
