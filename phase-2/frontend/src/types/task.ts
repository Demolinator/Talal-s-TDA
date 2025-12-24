/**
 * Task Type Definitions
 *
 * MUST match backend TaskResponse model exactly.
 * See: backend/src/models/task.py
 */

/**
 * Task model (matches backend TaskResponse)
 */
export interface Task {
  id: string; // UUID
  title: string;
  description: string | null;
  is_complete: boolean;
  user_id: string; // UUID
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

/**
 * Task creation payload
 */
export interface TaskCreate {
  title: string;
  description?: string | null;
}

/**
 * Task update payload
 */
export interface TaskUpdate {
  title?: string;
  description?: string | null;
  is_complete?: boolean;
}

/**
 * Task list response (paginated)
 */
export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
}
