import { NextResponse } from "next/server"

export function middleware(req) {
  const token = req.cookies.get("token")?.value

  if (!token && req.nextUrl.pathname.startsWith("/dasbor")) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dasborUser", "/dasboradmins"],
}  matcher: ["/dasborUser", "/dasboradmins"]
}
