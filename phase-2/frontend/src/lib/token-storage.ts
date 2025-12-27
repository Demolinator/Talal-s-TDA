/**
 * JWT Token Storage Utility
 *
 * Provides secure token storage for cross-domain authentication.
 * Uses memory storage (session-based) for maximum security.
 */

let authToken: string | null = null;

/**
 * Store JWT token in memory
 * @param token - JWT token from login response
 */
export function setAuthToken(token: string): void {
  authToken = token;

  // Also store in sessionStorage as backup (cleared when tab closes)
  if (typeof window !== "undefined") {
    sessionStorage.setItem("auth_token", token);
  }
}

/**
 * Get current JWT token
 * @returns JWT token or null if not authenticated
 */
export function getAuthToken(): string | null {
  // Try memory first
  if (authToken) {
    return authToken;
  }

  // Fallback to sessionStorage
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      authToken = token; // Restore to memory
      return token;
    }
  }

  return null;
}

/**
 * Clear JWT token (logout)
 */
export function clearAuthToken(): void {
  authToken = null;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("auth_token");
  }
}

/**
 * Check if user has valid token
 */
export function hasAuthToken(): boolean {
  return getAuthToken() !== null;
}
