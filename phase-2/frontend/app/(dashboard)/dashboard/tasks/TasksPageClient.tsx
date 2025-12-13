/**
 * TasksPageClient Component
 *
 * Client-side logic for tasks page with create/edit modal and task management.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task, TaskCreate, TaskUpdate } from "@/types/task";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { api } from "@/lib/api";

interface TasksPageClientProps {
  initialTasks: Task[];
}

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleSubmitTask = async (data: TaskCreate | TaskUpdate) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await api.put<Task>(`/api/tasks/${editingTask.id}`, data);
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
        );
        setEditingTask(null);
      } else {
        // Create new task
        const newTask = await api.post<Task>("/api/tasks", data);
        setTasks((prev) => [newTask, ...prev]);
        setIsCreating(false);
      }
      router.refresh();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-gray-600">
            Manage your tasks and track your progress
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Create Task Form (Modal) */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskForm
              onSubmit={handleSubmitTask}
              onCancel={() => setIsCreating(false)}
              submitLabel="Create Task"
            />
          </div>
        </div>
      )}

      {/* Edit Task Form (Modal) */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmitTask}
              onCancel={() => setEditingTask(null)}
              submitLabel="Update Task"
            />
          </div>
        </div>
      )}

      {/* Task List */}
      <TaskList
        initialTasks={tasks}
        filter="all"
        onEdit={setEditingTask}
      />
    </div>
  );
}
