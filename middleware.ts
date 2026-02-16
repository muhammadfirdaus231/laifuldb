import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (path.startsWith("/createakun")) {
      if (!["developers","owners","resellers"].includes(user.role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (path.startsWith("/dasbordevs") && user.role !== "developers")
      return NextResponse.redirect(new URL("/", req.url));

    if (path.startsWith("/dasborowners") && user.role !== "owners")
      return NextResponse.redirect(new URL("/", req.url));

    if (path.startsWith("/dasborResellers") && user.role !== "resellers")
      return NextResponse.redirect(new URL("/", req.url));

    if (path.startsWith("/dasborUser") && user.role !== "members")
      return NextResponse.redirect(new URL("/", req.url));

  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
