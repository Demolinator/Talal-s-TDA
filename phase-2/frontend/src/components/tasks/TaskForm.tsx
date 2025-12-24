"use client";

import { useState, FormEvent } from "react";
import { Task, TaskCreate } from "@/types/task";

interface TaskFormProps {
  onSubmit: (taskData: TaskCreate) => Promise<void>;
  onCancel?: () => void;
  initialData?: Task;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, onCancel, initialData, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 200) {
      setError("Title must be 200 characters or less");
      return;
    }

    if (description && description.length > 2000) {
      setError("Description must be 2000 characters or less");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
      });

      // Reset form if creating new task (no initialData)
      if (!initialData) {
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 disabled:opacity-50"
          placeholder="e.g., Buy groceries"
          maxLength={200}
          required
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {title.length}/200 characters
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 disabled:opacity-50 resize-none"
          placeholder="e.g., Milk, eggs, bread..."
          rows={3}
          maxLength={2000}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description.length}/2000 characters
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : initialData ? "Update Task" : "Add Task"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
