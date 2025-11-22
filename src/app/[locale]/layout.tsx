import "~/styles/globals.css";

import type { Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { isRtlLang } from "rtl-detect";

import { ThemeProvider } from "~/components/ui/theme";
import { Toaster } from "~/components/ui/toast";
import { TooltipProvider } from "~/components/ui/tooltip";
import { ConfirmationProvider } from "~/contexts/confirmation";
import { DirectionProvider } from "~/contexts/direction";
import { DndProvider } from "~/contexts/dnd";
import { NetworkProvider } from "~/contexts/network";
import { SessionProvider } from "~/contexts/session";
import { TabProvider } from "~/contexts/tab-manager";
import { TouchProvider } from "~/hooks/touch";
import { cn } from "~/lib/utils";
import { local } from "~/utils/fonts";
import { formats } from "~/utils/formats";

export const generateMetadata = async () => {
  const t = await getTranslations("pages.index");

  return {
    title: t("title"),
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const direction = isRtlLang(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn("text-[0.9rem]", local.className)}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <DirectionProvider dir={direction}>
          <main className="h-screen">
            <TouchProvider>
              <TooltipProvider>
                <DndProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                  >
                    <NextIntlClientProvider
                      locale={locale}
                      messages={messages}
                      formats={formats}
                    >
                      <TooltipProvider>
                        <SessionProvider>
                          <ConfirmationProvider>
                            <TabProvider limit={20}>{children}</TabProvider>
                          </ConfirmationProvider>
                        </SessionProvider>
                      </TooltipProvider>
                      <NetworkProvider />
                    </NextIntlClientProvider>
                    <Toaster richColors closeButton />
                  </ThemeProvider>
                </DndProvider>
              </TooltipProvider>
            </TouchProvider>
          </main>
        </DirectionProvider>
      </body>
    </html>
  );
}
