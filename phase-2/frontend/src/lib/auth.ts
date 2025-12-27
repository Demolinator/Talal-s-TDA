/**
 * Better Auth Client Configuration
 *
 * Configures the Better Auth client for frontend authentication
 * with JWT token management and cross-domain support.
 *
 * @see frontend/CLAUDE.md for authentication patterns
 */

import { createAuthClient } from "better-auth/react";
import { setAuthToken as storeToken, clearAuthToken } from "./token-storage";

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
 * - POST /api/auth/sign-up/email → Better Auth POST /api/auth/sign-up
 * - POST /api/auth/sign-in/email → Better Auth POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out → Clears auth_token cookie
 * - GET /api/auth/get-session → Better Auth GET /api/auth/get-session
 */
// CRITICAL: Must use BACKEND URL (not auth server URL) so cookies are set on backend domain
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tda-backend-production.up.railway.app";

// Debug logging to verify the URL being used
if (typeof window !== "undefined") {
  console.log("🔍 AUTH CLIENT DEBUG:");
  console.log("  process.env.NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("  BACKEND_URL:", BACKEND_URL);
}

// Local development: set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local

export const authClient = createAuthClient({
  // CRITICAL: Use BACKEND URL (not auth server) so auth_token cookie is set on backend domain
  baseURL: BACKEND_URL,

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
  const result = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });

  // Debug: Log the full response structure
  console.log("🔐 SIGNIN RESULT:", JSON.stringify(result, null, 2));

  // Extract and store JWT token from response
  // Better Auth client may return token in different structures
  let token = null;

  // Try multiple possible response structures
  if (result.data?.session?.token) {
    token = result.data.session.token;
    console.log("✅ Token found at result.data.session.token");
  } else if ((result as any).session?.token) {
    token = (result as any).session.token;
    console.log("✅ Token found at result.session.token");
  } else if ((result as any).data?.token) {
    token = (result as any).data.token;
    console.log("✅ Token found at result.data.token");
  } else if ((result as any).token) {
    token = (result as any).token;
    console.log("✅ Token found at result.token");
  }

  if (token) {
    storeToken(token);
    console.log("✅ Token stored successfully");
  } else {
    console.error("❌ No token found in response!");
  }

  return result;
}

/**
 * Sign out the current user
 * Clears auth tokens and redirects to login page
 */
export async function signOut() {
  // Clear stored token
  clearAuthToken();

  // Also call Better Auth signOut to clear cookies
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
