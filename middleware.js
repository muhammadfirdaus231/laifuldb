import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req) {
  const token = req.cookies.get("token")?.value

  if (!token && req.nextUrl.pathname.startsWith("/dasbor")) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (
        req.nextUrl.pathname === "/dasboradmins" &&
        decoded.role !== "owners"
      ) {
        return NextResponse.redirect(new URL("/dasborUser", req.url))
      }

      if (
        req.nextUrl.pathname === "/dasborUser" &&
        decoded.role !== "members"
      ) {
        return NextResponse.redirect(new URL("/dasboradmins", req.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dasborUser", "/dasboradmins"]
}
