"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/auth";
import { type User } from "@/types/user";
import { getTasks, createTask, updateTask, deleteTask, type Task, type TaskCreate } from "@/lib/api";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";

type FilterType = "all" | "pending" | "completed";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadUserAndTasks() {
      try {
        const session = await getCurrentUser();
        // Better Auth returns { data: { user, session } } or { error }
        const sessionData = (session as any)?.data;
        if (!sessionData?.user) {
          router.push("/login");
          return;
        }
        setUser(sessionData.user as User);

        // Load tasks
        const tasksData = await getTasks();
        setTasks(tasksData.tasks);
      } catch (error) {
        console.error("Failed to load data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserAndTasks();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleCreateTask = async (taskData: TaskCreate) => {
    setIsCreating(true);
    try {
      const newTask = await createTask(taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (taskId: string, isComplete: boolean) => {
    try {
      const updatedTask = await updateTask(taskId, { is_complete: isComplete });
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.is_complete).length,
    pending: tasks.filter((t) => !t.is_complete).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user.name}!
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "completed"] as FilterType[]).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              + Add New Task
            </button>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Create New Task
              </h2>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowForm(false)}
                isLoading={isCreating}
              />
            </div>
          )}
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}
