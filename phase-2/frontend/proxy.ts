/**
 * Authentication Proxy
 *
 * Protects dashboard routes and enforces authentication.
 * Redirects unauthenticated users to /login.
 * Checks JWT token expiration and handles expired sessions.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Validates JWT token and checks expiration
 * @param token - JWT token string
 * @returns Object with isValid flag and isExpired flag
 */
function validateToken(token: string): {
  isValid: boolean;
  isExpired: boolean;
} {
  try {
    // Decode JWT payload (format: header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { isValid: false, isExpired: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    // Check if token has expiration claim
    if (payload.exp && typeof payload.exp === "number") {
      // Token is expired if exp is less than current time
      if (payload.exp < now) {
        return { isValid: false, isExpired: true };
      }
    }

    return { isValid: true, isExpired: false };
  } catch (error) {
    // Invalid token format
    return { isValid: false, isExpired: false };
  }
}

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // Protected route: /dashboard and all sub-routes
  if (pathname.startsWith("/dashboard")) {
    if (!authToken) {
      // Redirect unauthenticated users to login
      const loginUrl = new URL("/login", request.url);
      // Preserve intended destination for post-login redirect
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate token and check expiration
    const { isValid, isExpired } = validateToken(authToken.value);

    if (!isValid) {
      if (isExpired) {
        // Token expired - clear cookies and redirect with expired flag
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("expired", "true");
        loginUrl.searchParams.set("redirect", pathname);

        const response = NextResponse.redirect(loginUrl);
        // Clear expired auth cookies
        response.cookies.delete("auth_token");
        response.cookies.delete("refresh_token");
        return response;
      } else {
        // Invalid token format - redirect to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);

        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("auth_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    }

    // Authenticated and valid token - allow access
    return NextResponse.next();
  }

  // Public auth routes: /login and /signup
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (authToken) {
      // Check if token is still valid before redirecting
      const { isValid } = validateToken(authToken.value);

      if (isValid) {
        // Redirect authenticated users away from auth pages
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        // Invalid/expired token - clear cookies and allow access to auth pages
        const response = NextResponse.next();
        response.cookies.delete("auth_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    }

    // Not authenticated - allow access to auth pages
    return NextResponse.next();
  }

  // All other routes are public
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
