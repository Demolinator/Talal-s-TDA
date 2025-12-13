/**
 * Database Connection for Better Auth
 *
 * Uses postgres.js client to connect to Neon PostgreSQL.
 * This is the recommended client for serverless PostgreSQL.
 */

import postgres from "postgres";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * PostgreSQL connection instance
 * Configured for Neon Serverless PostgreSQL
 */
export const sql = postgres(DATABASE_URL, {
  max: 10, // Connection pool size
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  ssl: "require", // Neon requires SSL
});

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT NOW() as time`;
    console.log("✅ Database connected successfully:", result[0].time);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
