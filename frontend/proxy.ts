import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
      headers: {
        cookie,
      },
      cache: "no-store",
    });
    const session = await res.json();

    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/onboarding/:path*"],
};
