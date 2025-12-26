/**
 * API Client for Backend Requests
 *
 * Centralized fetch wrapper with authentication and error handling.
 * Uses HttpOnly cookies for authentication (set by Better Auth server).
 *
 * @see frontend/CLAUDE.md for API integration patterns
 *
 * CACHE BUST: v3.0 - HTTPS ENFORCED - NO HTTP ALLOWED
 * Last updated: 2025-12-26 00:30 UTC
 */

// Use environment variable from Vercel, fallback to production URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tda-backend-production.up.railway.app";

// Debug logging to verify the URL being used
if (typeof window !== "undefined") {
  console.log("🔍 API CLIENT DEBUG:");
  console.log("  process.env.NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("  API_BASE_URL:", API_BASE_URL);
}

// Local development: set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Centralized fetch wrapper with authentication
 *
 * Features:
 * - Automatic cookie inclusion (auth_token)
 * - JSON request/response handling
 * - Error parsing and type-safe errors
 * - Automatic redirect on 401 (session expired)
 *
 * @param endpoint - API endpoint path (e.g., "/api/tasks")
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws APIError on HTTP error status
 */
export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include HttpOnly cookies (auth_token)
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    // Handle 401 Unauthorized (session expired)
    if (response.status === 401) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new APIError("Session expired. Please log in again.", 401);
    }

    // Handle other HTTP errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: "Unknown error occurred",
      }));
      throw new APIError(
        error.detail || `Request failed: ${response.statusText}`,
        response.status,
        error
      );
    }

    // Handle 204 No Content (e.g., DELETE requests)
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse and return JSON response
    return response.json();
  } catch (error) {
    // Re-throw APIError as-is
    if (error instanceof APIError) {
      throw error;
    }

    // Wrap network errors
    if (error instanceof Error) {
      throw new APIError(
        `Network error: ${error.message}`,
        0,
        error
      );
    }

    // Unknown error
    throw new APIError("An unexpected error occurred", 0, error);
  }
}

// ==============================================================================
// Type Definitions
// ==============================================================================

/**
 * Task model (matches backend TaskResponse)
 */
export interface Task {
  id: string; // UUID
  title: string;
  description: string | null;
  is_complete: boolean;
  user_id: string; // UUID
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * Task creation input
 */
export interface TaskCreate {
  title: string;
  description?: string | null;
}

/**
 * Task update input (all fields optional)
 */
export interface TaskUpdate {
  title?: string;
  description?: string | null;
  is_complete?: boolean;
}

/**
 * Task list response
 */
export interface TaskListResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Task list query parameters
 */
export interface TaskListParams {
  is_complete?: boolean; // Filter by completion status
  limit?: number; // Max tasks to return (1-100)
  offset?: number; // Skip first N tasks (pagination)
}

// ==============================================================================
// Task API Functions
// ==============================================================================

/**
 * Get all tasks for authenticated user
 *
 * @param params - Optional filter and pagination params
 * @returns List of tasks with pagination metadata
 * @throws APIError on failure
 *
 * @example
 * ```typescript
 * // Get all tasks
 * const { tasks, total } = await getTasks();
 *
 * // Get incomplete tasks only
 * const { tasks } = await getTasks({ is_complete: false });
 *
 * // Get tasks with pagination
 * const { tasks } = await getTasks({ limit: 10, offset: 0 });
 * ```
 */
export async function getTasks(
  params?: TaskListParams
): Promise<TaskListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.is_complete !== undefined) {
    searchParams.set("is_complete", String(params.is_complete));
  }
  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  if (params?.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  const query = searchParams.toString();
  return fetchAPI<TaskListResponse>(`/api/tasks${query ? `?${query}` : ""}`);
}

/**
 * Get a single task by ID
 *
 * @param taskId - Task UUID
 * @returns Task details
 * @throws APIError if not found or unauthorized
 *
 * @example
 * ```typescript
 * const task = await getTask("550e8400-e29b-41d4-a716-446655440000");
 * console.log(task.title);
 * ```
 */
export async function getTask(taskId: string): Promise<Task> {
  return fetchAPI<Task>(`/api/tasks/${taskId}`);
}

/**
 * Create a new task
 *
 * @param data - Task creation data
 * @returns Created task
 * @throws APIError on validation error or failure
 *
 * @example
 * ```typescript
 * const newTask = await createTask({
 *   title: "Buy groceries",
 *   description: "Milk, eggs, bread"
 * });
 * ```
 */
export async function createTask(data: TaskCreate): Promise<Task> {
  return fetchAPI<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing task
 *
 * @param taskId - Task UUID
 * @param data - Fields to update (partial update)
 * @returns Updated task
 * @throws APIError if not found or unauthorized
 *
 * @example
 * ```typescript
 * // Mark task as complete
 * const updated = await updateTask(taskId, { is_complete: true });
 *
 * // Update title and description
 * const updated = await updateTask(taskId, {
 *   title: "New title",
 *   description: "Updated description"
 * });
 * ```
 */
export async function updateTask(
  taskId: string,
  data: TaskUpdate
): Promise<Task> {
  return fetchAPI<Task>(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a task
 *
 * @param taskId - Task UUID
 * @throws APIError if not found or unauthorized
 *
 * @example
 * ```typescript
 * await deleteTask("550e8400-e29b-41d4-a716-446655440000");
 * ```
 */
export async function deleteTask(taskId: string): Promise<void> {
  return fetchAPI<void>(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}

/**
 * Toggle task completion status
 *
 * Convenience function to toggle is_complete field.
 *
 * @param task - Task to toggle
 * @returns Updated task
 * @throws APIError on failure
 *
 * @example
 * ```typescript
 * const task = { id: "...", is_complete: false, ... };
 * const toggled = await toggleTaskComplete(task);
 * console.log(toggled.is_complete); // true
 * ```
 */
export async function toggleTaskComplete(task: Task): Promise<Task> {
  return updateTask(task.id, { is_complete: !task.is_complete });
}
