import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_API = ["/api/user", "/api/transactions", "/api/rewards/redeem"];
const PROTECTED_PAGES = ["/portfel", "/nagrody", "/menu", "/qr", "/chat"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("kq_session")?.value;

  const isProtectedApi = PROTECTED_API.some((p) => pathname.startsWith(p));
  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));

  if (isProtectedApi && !userId) {
    return Response.json({ error: "Wymagane logowanie" }, { status: 401 });
  }

  if (isProtectedPage && !userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/portfel/:path*", "/nagrody/:path*", "/menu/:path*", "/qr/:path*", "/chat/:path*"],
};
