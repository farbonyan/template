"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export const NetworkProvider = () => {
  const t = useTranslations("pages.error");
  const toastRef = React.useRef<ReturnType<(typeof toast)["error"]>>();
  const [_, setIsOnline] = React.useState(
    typeof window !== "undefined" ? window.navigator.onLine : false,
  );

  React.useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      toast.dismiss(toastRef.current);
      toast.success(t("online"), {
        position: "bottom-center",
      });
    };

    const goOffline = () => {
      setIsOnline(false);
      toastRef.current = toast.error(t("offline"), {
        position: "bottom-center",
        duration: Number.POSITIVE_INFINITY,
        closeButton: false,
        dismissible: false,
      });
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [t]);

  return null;
};
