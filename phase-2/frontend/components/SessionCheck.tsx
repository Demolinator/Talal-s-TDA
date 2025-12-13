/**
 * Session Persistence Check Component
 *
 * Client component that validates authentication on initial page load.
 * Checks for auth_token cookie on protected routes and validates JWT expiration.
 * Redirects to login if session is invalid or expired.
 */

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Validates JWT token expiration
 * @param token - JWT token string
 * @returns true if token is valid and not expired
 */
function isTokenValid(token: string): boolean {
  try {
    // Decode JWT payload (format: header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    // Check if token has expiration claim
    if (payload.exp && typeof payload.exp === "number") {
      // Token is expired if exp is less than current time
      return payload.exp >= now;
    }

    // No expiration claim - consider valid
    return true;
  } catch (error) {
    // Invalid token format
    return false;
  }
}

/**
 * Gets cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

interface SessionCheckProps {
  children: React.ReactNode;
}

/**
 * SessionCheck component
 *
 * Wraps application content and performs client-side session validation
 * on initial page load for protected routes.
 */
export function SessionCheck({ children }: SessionCheckProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only check on client-side
    if (typeof window === "undefined") {
      return;
    }

    // Define protected routes that require authentication
    const isProtectedRoute =
      pathname.startsWith("/dashboard") || pathname.startsWith("/tasks");

    // Skip check for public routes
    if (!isProtectedRoute) {
      return;
    }

    // Check for auth_token cookie
    const authToken = getCookie("auth_token");

    if (!authToken) {
      // No auth token - redirect to login
      router.push("/login");
      return;
    }

    // Verify token is not expired
    if (!isTokenValid(authToken)) {
      // Token expired or invalid - redirect to login with expired flag
      router.push("/login?expired=true");
      return;
    }

    // Token is valid - continue rendering
  }, [pathname, router]);

  return <>{children}</>;
}
