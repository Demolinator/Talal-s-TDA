"use client";

import { Task } from "@/types/task";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, isComplete: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id, !task.is_complete);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      setIsDeleting(false);
      alert(error instanceof Error ? error.message : "Failed to delete task");
    }
  };

  const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 transition-all ${
        task.is_complete
          ? "border-green-500 opacity-75"
          : "border-blue-500"
      } ${isDeleting ? "opacity-50 scale-95" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling || isDeleting}
          className="mt-1 flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          aria-label={task.is_complete ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.is_complete && (
            <svg className="w-full h-full text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium ${
              task.is_complete
                ? "line-through text-gray-500 dark:text-gray-400"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Created on {formattedDate}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 transition-colors"
              aria-label="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting || isToggling}
            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50 transition-colors"
            aria-label="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
