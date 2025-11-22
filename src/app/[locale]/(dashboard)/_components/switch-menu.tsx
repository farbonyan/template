"use client";

import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useSetting } from "~/contexts/settings";

/** Switch between menu display modes component */
export const SwitchMenu = () => {
  const t = useTranslations("pages.index.header.customize.menu");
  const [displayMenu, setDisplayMenu] = useSetting("displayMenu");

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant={displayMenu === "sticky" ? "outline" : "ghost"}
        className="w-full"
        onClick={() => setDisplayMenu("sticky")}
      >
        {t("sticky")}
      </Button>
      <Button
        variant={displayMenu === "slider" ? "outline" : "ghost"}
        className="w-full"
        onClick={() => setDisplayMenu("slider")}
      >
        {t("slider")}
      </Button>
    </div>
  );
};
