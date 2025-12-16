/**
 * Simple Express Auth Server
 *
 * Basic JWT authentication server that works with the FastAPI backend.
 * Provides signup, login, logout endpoints without complex dependencies.
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { join } from "path";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);
const JWT_SECRET = process.env.BETTER_AUTH_SECRET || "your-super-secret-jwt-key";
const DB_PATH = join(process.cwd(), "auth.db");

// Initialize SQLite database
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "simple-auth-server",
    version: "1.0.0",
  });
});

// Signup endpoint
app.post("/auth/sign-up", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const insertUser = db.prepare(`
      INSERT INTO users (email, password_hash, name)
      VALUES (?, ?, ?)
    `);

    const result = insertUser.run(email, passwordHash, name || null);
    const userId = result.lastInsertRowid;

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: userId,
        email: email,
        sub: userId.toString(),
        exp: Math.floor(Date.now() / 1000) + (60 * 15) // 15 minutes
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    // Set httpOnly cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: userId,
        email: email,
        name: name || null,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Login endpoint
app.post("/auth/sign-in/email", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user
    const user = db
      .prepare("SELECT id, email, password_hash, name FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        sub: user.id.toString(),
        exp: Math.floor(Date.now() / 1000) + (60 * 15) // 15 minutes
      },
      JWT_SECRET,
      { algorithm: "HS256" }
    );

    // Set httpOnly cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Logout endpoint
app.post("/auth/sign-out", (req: Request, res: Response) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.json({
    message: "Logout successful",
  });
});

// Get session endpoint
app.get("/auth/get-session", (req: Request, res: Response) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({
        error: "No authentication token",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get user from database
    const user = db
      .prepare("SELECT id, email, name FROM users WHERE id = ?")
      .get(decoded.user_id) as any;

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      session: {
        token: token,
        expires_at: new Date(decoded.exp * 1000).toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    console.error("Session error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      "GET /health",
      "POST /auth/sign-up",
      "POST /auth/sign-in/email",
      "POST /auth/sign-out",
      "GET /auth/get-session",
    ],
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

// Start server
async function startServer() {
  try {
    console.log("🔌 Testing database connection...");

    // Test database
    const testQuery = db.prepare("SELECT datetime('now') as time");
    const result = testQuery.get() as { time: string };
    console.log("✅ Database connected successfully:", result.time);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✅ Simple Auth server started successfully\n`);
      console.log(`   Port: ${PORT}`);
      console.log(`   Base URL: http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   Database: ${DB_PATH}`);
      console.log(`\n📋 Available Endpoints:`);
      console.log(`   GET  /health                 - Health check`);
      console.log(`   POST /auth/sign-up           - Create account`);
      console.log(`   POST /auth/sign-in/email     - Login`);
      console.log(`   POST /auth/sign-out          - Logout`);
      console.log(`   GET  /auth/get-session       - Current user\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n⚠️  SIGTERM received, shutting down gracefully...");
  db.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT received, shutting down gracefully...");
  db.close();
  process.exit(0);
});

// Start the server
startServer();
