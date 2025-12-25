/**
 * Dashboard Page
 *
 * Main task management interface with:
 * - Task list display
 * - Filter tabs (All/Active/Completed)
 * - Add/Edit/Delete tasks
 * - Loading and empty states
 * - Real-time task completion toggle
 */

"use client";

import * as React from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Header } from "@/components/layout/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskCreate,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type FilterType = "all" | "pending" | "completed";

export default function DashboardPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  // Load tasks on mount
  React.useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      setTasks(response.tasks);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error("Load tasks error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (data: TaskCreate) => {
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      setIsDialogOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleEditTask = async (data: TaskCreate) => {
    if (!editingTask) return;

    try {
      const updatedTask = await updateTask(editingTask.id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setIsDialogOpen(false);
      setEditingTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
      throw error;
    }
  };

  const handleToggleComplete = async (taskId: string, isComplete: boolean) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, is_complete: isComplete } : task
        )
      );

      const updatedTask = await updateTask(taskId, { is_complete: isComplete });

      // Update with server response
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );

      toast.success(
        isComplete ? "Task completed!" : "Task marked as incomplete"
      );
    } catch (error) {
      toast.error("Failed to update task");
      // Revert optimistic update
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      throw error;
    }
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  // Calculate task counts
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.is_complete).length,
    completed: tasks.filter((t) => t.is_complete).length,
  };

  return (
    <>
      <Header onAddTask={() => handleOpenDialog()} />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {taskCounts.all === 0
                ? "No tasks yet. Create one to get started!"
                : `${taskCounts.pending} pending, ${taskCounts.completed} completed`}
            </p>
          </div>

          {/* Mobile Add Task Button */}
          <Button
            onClick={() => handleOpenDialog()}
            className="sm:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Add Task
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "pending", "completed"] as const).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? "default" : "outline"}
              onClick={() => setFilter(filterOption)}
              className={cn(
                "relative",
                filter === filterOption &&
                  "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              )}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              <Badge
                variant={filter === filterOption ? "secondary" : "outline"}
                className={cn(
                  "ml-2",
                  filter === filterOption
                    ? "bg-white/20 text-white border-white/30"
                    : ""
                )}
              >
                {taskCounts[filterOption]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEdit={handleOpenDialog}
          onAddTask={() => handleOpenDialog()}
        />
        </div>
      </main>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl dark:bg-neutral-900/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription className="text-neutral-600 dark:text-neutral-400">
              {editingTask
                ? "Update the task details below."
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={editingTask ? handleEditTask : handleAddTask}
            onCancel={handleCloseDialog}
            initialData={editingTask || undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
