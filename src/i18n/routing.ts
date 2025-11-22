import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { locales } from "~/utils/types";

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "fa",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
