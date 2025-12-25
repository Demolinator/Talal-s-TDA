/**
 * TaskForm Component
 *
 * Form for creating and editing tasks with:
 * - React Hook Form for form management
 * - Zod validation
 * - Error handling
 * - Loading states
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Task, TaskCreate } from "@/types/task";

// Validation schema
const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (taskData: TaskCreate) => Promise<void>;
  onCancel?: () => void;
  initialData?: Task;
  isLoading?: boolean;
}

export function TaskForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  const title = watch("title") || "";
  const description = watch("description") || "";

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit({
        title: data.title.trim(),
        description: data.description?.trim() || null,
      });

      // Reset form if creating new task (no initialData)
      if (!initialData) {
        reset();
      }
    } catch (error) {
      // Error is handled by parent component via toast
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          {...register("title")}
          disabled={isLoading || isSubmitting}
          placeholder="e.g., Buy groceries"
          maxLength={200}
          className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
        />
        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {title.length}/200 characters
        </p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isLoading || isSubmitting}
          placeholder="e.g., Milk, eggs, bread..."
          rows={4}
          maxLength={2000}
          className="resize-none bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
        />
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {description.length}/2000 characters
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isLoading || isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Task"
            : "Add Task"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isSubmitting}
            className="px-6"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
