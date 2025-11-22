import type { ZodType } from "zod";
import i18next from "i18next";
import { z, ZodError } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/fa/zod.json";

i18next
  .init({
    lng: "fa",
    resources: {
      fa: { zod: translation },
    },
  })
  .catch((e: Error) => Promise.reject(e));
z.setErrorMap(zodI18nMap);

export { z, ZodError, type ZodType };
