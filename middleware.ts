import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "session_token";

const protectedRoutes: Array<{
  prefix: string;
  role: "customer" | "installer" | "officer";
}> = [
  { prefix: "/customer", role: "customer" },
  { prefix: "/installer", role: "installer" },
  { prefix: "/officer", role: "officer" },
];

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matched = protectedRoutes.find(({ prefix }) =>
    pathname.startsWith(prefix)
  );

  if (!matched) {
    return NextResponse.next();
  }

  const jwt = request.cookies.get(SESSION_COOKIE)?.value;

  if (!jwt) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify JWT token (works in Edge Runtime)
    const { payload } = await jwtVerify(jwt, getSecret());
    const role = payload.role as string;

    if (role !== matched.role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid or expired JWT
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/customer/:path*", "/installer/:path*", "/officer/:path*"],
};
