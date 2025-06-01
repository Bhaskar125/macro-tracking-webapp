import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the session token from cookies
  const sessionToken = request.cookies.get('authjs.session-token')?.value || 
                      request.cookies.get('__Secure-authjs.session-token')?.value

  // Check if user is accessing protected routes
  if (pathname.startsWith("/dashboard")) {
    // If not authenticated, redirect to signin
    if (!sessionToken) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (sessionToken && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
} 