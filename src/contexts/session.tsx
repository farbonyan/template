"use client";

import { SessionProvider as __SessionProvider } from "next-auth/react";

/** SSR friendly session provider */
export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <__SessionProvider>{children}</__SessionProvider>;
};
