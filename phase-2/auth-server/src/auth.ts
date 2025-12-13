/**
 * Better Auth Configuration
 *
 * Configures Better Auth with:
 * - Email/password authentication
 * - PostgreSQL database (shared with FastAPI)
 * - JWT tokens (compatible with FastAPI validation)
 * - Cookie-based session storage
 */

import { betterAuth } from "better-auth";
import { sql } from "./db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const REQUIRED_ENV_VARS = ["BETTER_AUTH_SECRET", "DATABASE_URL"];
for (const envVar of REQUIRED_ENV_VARS) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

/**
 * Better Auth Instance
 *
 * This configuration:
 * 1. Uses the same database as FastAPI (Neon PostgreSQL)
 * 2. Generates JWT tokens compatible with FastAPI validation
 * 3. Sets cookies with name 'auth_token' (matches existing implementation)
 * 4. Uses email/password authentication
 */
export const auth = betterAuth({
  /**
   * Application Configuration
   */
  appName: "Phase II Todo Application",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",

  /**
   * Secret for JWT token signing
   * CRITICAL: Must match backend JWT_SECRET for token validation
   */
  secret: process.env.BETTER_AUTH_SECRET!,

  /**
   * Database Configuration
   * Uses PostgreSQL adapter with postgres.js client
   */
  database: {
    provider: "postgres",
    client: sql,

    /**
     * Table name mapping
     * Better Auth uses singular table names by default
     * Our database will have: user, session, account, verification
     */
  },

  /**
   * Email and Password Authentication
   */
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,

    /**
     * Email verification
     * Start with false, enable later with SMTP configuration
     */
    requireEmailVerification: false,

    /**
     * Auto sign-in after signup
     * User is automatically logged in after creating account
     */
    autoSignIn: true,
  },

  /**
   * Session Configuration
   * Matches existing FastAPI implementation (15 minutes)
   */
  session: {
    /**
     * Session duration: 15 minutes (900 seconds)
     * Matches ACCESS_TOKEN_EXPIRE_MINUTES in backend
     */
    expiresIn: 60 * 15,

    /**
     * Update session if older than 5 minutes
     * Sliding window for active users
     */
    updateAge: 60 * 5,

    /**
     * Cookie name: 'auth_token'
     * CRITICAL: Must match backend cookie extraction
     */
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache session data for 5 minutes
    },
  },

  /**
   * Advanced Cookie Configuration
   */
  advanced: {
    /**
     * Cookie prefix: empty string
     * Results in cookie name 'auth_token' (not 'better_auth.auth_token')
     */
    cookiePrefix: "",

    /**
     * Cookie security settings
     */
    cookieOptions: {
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      path: "/", // Available to all routes
    },
  },

  /**
   * CORS Configuration
   * Allow frontend to make authenticated requests
   */
  trustedOrigins: process.env.CORS_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],

  /**
   * Rate Limiting
   * Prevent brute-force attacks
   */
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds
    max: 10, // Max 10 requests per window
  },

  /**
   * Plugins
   * Can add later: twoFactor, passkey, organization, etc.
   */
  plugins: [
    // Future: Add plugins here
    // twoFactor({ issuer: "Todo App" }),
    // passkey({ rpID: "example.com", rpName: "Todo App" }),
  ],
});

/**
 * Type exports for TypeScript support
 */
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
