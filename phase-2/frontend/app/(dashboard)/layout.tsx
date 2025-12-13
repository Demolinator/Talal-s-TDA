/**
 * Dashboard Layout
 *
 * Server Component that fetches current user and renders Header.
 * Wraps all dashboard pages with consistent layout.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import type { User } from "@/types/user";

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return null;
  }

  try {
    // Fetch current user from backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        headers: {
          Cookie: `auth_token=${authToken.value}`,
        },
        cache: "no-store", // Always fetch fresh user data
      }
    );

    if (!response.ok) {
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user.name} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
