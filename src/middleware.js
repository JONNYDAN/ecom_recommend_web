import { NextResponse } from "next/server";
import {
  TOKEN_KEY,
  USER_KEY,
  parseEncodedUser,
  validateTokenBasic,
} from "./utils/storageUtils";

const routeMap = {
  "/authen/sign-in": {
    isRedirect: (isLoggedIn) => !!isLoggedIn,
    redirectUrl: "/",
  },
  "/authen/sign-up": {
    isRedirect: (isLoggedIn) => !!isLoggedIn,
    redirectUrl: "/",
  },
  "/profile": {
    isRedirect: (isLoggedIn) => !isLoggedIn,
    redirectUrl: "/authen/sign-in",
  },
};

// TODO: enhance authen for dynamic pages, reference: https://nextjs.org/docs/messages/middleware-request-page

export default function middleware(req) {
  const pathName = req.nextUrl.pathname;
  const routeRule = routeMap[pathName];

  const response = NextResponse.next();

  const hasValidToken = validateTokenBasic(req.cookies.get(TOKEN_KEY)?.value);
  const encodedUser = req.cookies.get(USER_KEY)?.value;
  const user = parseEncodedUser(encodedUser);
  const isLoggedIn = hasValidToken && !!user?.id;

  if (!isLoggedIn) {
    // Delete user and token in cookies
    response.cookies.delete(TOKEN_KEY);
    response.cookies.delete(USER_KEY);
  }

  if (routeRule && routeRule.isRedirect(isLoggedIn)) {
    return NextResponse.redirect(new URL(routeRule.redirectUrl, req.url));
  }

  // continue the flow
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
