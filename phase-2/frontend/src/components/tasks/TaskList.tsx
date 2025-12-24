"use client";

import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, isComplete: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit?: (task: Task) => void;
  filter?: "all" | "pending" | "completed";
}

export function TaskList({ tasks, onToggleComplete, onDelete, onEdit, filter = "all" }: TaskListProps) {
  // Filter tasks based on the filter prop
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.is_complete;
    if (filter === "completed") return task.is_complete;
    return true; // "all"
  });

  if (filteredTasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
