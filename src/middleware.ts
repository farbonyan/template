import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const publicPages = ["/auth/signin"];

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  (req) => intlMiddleware(req),
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/auth/signin",
    },
  },
);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  const locale =
    routing.locales.find((loc) => pathname.startsWith(`/${loc}`)) ??
    routing.defaultLocale;

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  const token =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
    // signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  return (authMiddleware as any)(req);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
