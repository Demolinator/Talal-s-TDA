/**
 * Tasks Page
 *
 * Main page for viewing and managing tasks.
 * Server Component that fetches initial tasks, then Client Components handle interactions.
 */

import { cookies } from "next/headers";
import { Task } from "@/types/task";
import { TasksPageClient } from "./TasksPageClient";

async function getTasks(): Promise<Task[]> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return [];
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
      {
        headers: {
          Cookie: `auth_token=${authToken.value}`,
        },
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch tasks:", response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export default async function TasksPage() {
  const initialTasks = await getTasks();

  return <TasksPageClient initialTasks={initialTasks} />;
}
