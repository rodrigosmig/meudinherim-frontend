import { AUTH_COOKIE_NAME, AUTH_PUBLIC_ROUTES, AUTH_REDIRECT_WHEN_AUTHENTICATED, AUTH_REDIRECT_WHEN_UNAUTHENTICATED, } from "@/helpers/constants";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isPublicRoute(pathname: string) {
  return AUTH_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);
  const isPublic = isPublicRoute(pathname);

  if (!isAuthenticated && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_REDIRECT_WHEN_UNAUTHENTICATED;
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_REDIRECT_WHEN_AUTHENTICATED;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
