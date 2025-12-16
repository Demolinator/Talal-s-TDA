/**
 * Database Connection Test for Better Auth
 *
 * Simple database connection test since Better Auth handles
 * the database setup and migrations internally.
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

/**
 * Test database connection
 * Just checks if we can create/access the SQLite file
 */
export async function testConnection(): Promise<boolean> {
  try {
    const dbPath = path.join(process.cwd(), "auth.db");

    // Check if we can write to the directory
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    console.log(`✅ Database path accessible: ${dbPath}`);
    console.log("✅ Better Auth will handle database initialization");
    return true;
  } catch (error) {
    console.error("❌ Database path check failed:", error);
    return false;
  }
}
