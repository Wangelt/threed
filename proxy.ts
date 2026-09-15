import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/cart", "/orders", "/profile", "/wishlist"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !request.cookies.get("firebaseSession")?.value) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/orders/:path*", "/profile", "/wishlist"],
};
