"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useRouter } from "~/i18n/routing";

export default function Error({ reset }: { reset: () => void; error: Error }) {
  const t = useTranslations("pages.error");
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-12 p-4">
      <Image
        src="/img/error-500.png"
        alt="error code 500"
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
        <div className="flex items-center justify-center gap-2">
          <Button size="lg" variant="default" onClick={() => router.back()}>
            {t("return")}
          </Button>
          <Button size="lg" variant="outline" onClick={() => reset()}>
            {t("try-again")}
          </Button>
        </div>
      </div>
    </div>
  );
}
