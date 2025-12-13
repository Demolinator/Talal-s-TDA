/**
 * TaskList Component
 *
 * Displays list of tasks with filtering and state management.
 * Client component handling all task operations.
 */

"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { api } from "@/lib/api";

interface TaskListProps {
  initialTasks: Task[];
  filter?: "all" | "active" | "completed";
  onEdit?: (task: Task) => void;
}

export function TaskList({ initialTasks, filter = "all", onEdit }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<
    "all" | "active" | "completed"
  >(filter);

  const fetchTasks = async (filterType: "all" | "active" | "completed") => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filterType === "active") {
        params.append("is_complete", "false");
      } else if (filterType === "completed") {
        params.append("is_complete", "true");
      }

      const data = await api.get<{ tasks: Task[] }>(`/api/tasks?${params.toString()}`);
      setTasks(data.tasks);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string, isComplete: boolean) => {
    // Optimistic update: Update UI immediately
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, is_complete: isComplete, updated_at: new Date().toISOString() }
          : task
      )
    );

    try {
      const updatedTask = await api.patch<Task>(`/api/tasks/${taskId}/complete`, {
        is_complete: isComplete,
      });

      // Update with server response
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );

      // If filtering and task no longer matches filter, refetch
      if (currentFilter !== "all") {
        await fetchTasks(currentFilter);
      }
    } catch (err) {
      // Rollback on error
      console.error("Error toggling task:", err);
      setTasks(previousTasks);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleEdit = (task: Task) => {
    if (onEdit) {
      onEdit(task);
    } else {
      console.log("Edit task:", task);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleFilterChange = (filterType: "all" | "active" | "completed") => {
    setCurrentFilter(filterType);
    fetchTasks(filterType);
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.is_complete).length,
    completed: tasks.filter((t) => t.is_complete).length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
        <button
          onClick={() => handleFilterChange("all")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            currentFilter === "all"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-pressed={currentFilter === "all"}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => handleFilterChange("active")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            currentFilter === "active"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-pressed={currentFilter === "active"}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            currentFilter === "completed"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-pressed={currentFilter === "completed"}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading tasks...</span>
        </div>
      )}

      {/* Task List */}
      {!isLoading && tasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="Empty task list illustration"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {currentFilter === "all"
              ? "Get started by creating your first task."
              : `No ${currentFilter} tasks. Try a different filter.`}
          </p>
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          role="list"
          aria-label="Task list"
        >
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
