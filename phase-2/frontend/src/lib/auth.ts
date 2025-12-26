/**
 * Better Auth Client Configuration
 *
 * Configures the Better Auth client for frontend authentication
 * with JWT token management and cookie-based session storage.
 *
 * @see frontend/CLAUDE.md for authentication patterns
 */

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance
 *
 * Configuration:
 * - baseURL: Points to FastAPI backend (which proxies to Better Auth server)
 * - credentials: Include cookies in cross-origin requests
 *
 * ARCHITECTURE FLOW:
 * Frontend → FastAPI Backend (/api/auth/*) → Better Auth Server
 *
 * The FastAPI backend acts as a proxy to the Better Auth server:
 * - POST /api/auth/signup → Better Auth POST /api/auth/sign-up
 * - POST /api/auth/login → Better Auth POST /api/auth/sign-in/email
 * - POST /api/auth/logout → Clears auth_token cookie
 * - GET /api/auth/me → Better Auth GET /api/auth/get-session
 */
// CRITICAL: ALWAYS USE HTTPS - NO EXCEPTIONS
// This URL is used in ALL environments
const AUTH_SERVER_URL = "https://auth-server-production-8251.up.railway.app";

// Uncomment for local development only:
// const AUTH_SERVER_URL = "http://localhost:3001";

export const authClient = createAuthClient({
  // ALWAYS use HTTPS auth server URL - no conditional logic
  baseURL: AUTH_SERVER_URL,

  // Include credentials (cookies) in requests
  fetchOptions: {
    credentials: "include", // Required for HttpOnly cookies
  },
});

/**
 * Auth helper functions for common operations
 */

/**
 * Sign up a new user
 * @param name - User's full name
 * @param email - User's email address
 * @param password - User's password (min 8 characters)
 */
export async function signUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  return authClient.signUp.email({
    name: data.name,
    email: data.email,
    password: data.password,
  });
}

/**
 * Sign in an existing user
 * @param email - User's email address
 * @param password - User's password
 */
export async function signIn(data: { email: string; password: string }) {
  return authClient.signIn.email({
    email: data.email,
    password: data.password,
  });
}

/**
 * Sign out the current user
 * Clears auth cookies and redirects to login page
 */
export async function signOut() {
  return authClient.signOut();
}

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  return authClient.getSession();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentUser();
  const sessionData = (session as any)?.data;
  return !!sessionData?.user;
}

/**
 * Type exports for TypeScript support
 *
 * Note: User type is defined in @/types/user.ts
 */
export type Session = Awaited<ReturnType<typeof getCurrentUser>>;
