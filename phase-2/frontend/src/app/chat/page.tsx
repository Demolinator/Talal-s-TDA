/**
 * Chat Page - AI-Powered Todo Assistant
 *
 * Phase III: Conversational interface for managing tasks via natural language.
 * Uses OpenAI Agents SDK on the backend with MCP tools for task operations.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatBot } from "@/components/chat/ChatBot";
import { Header } from "@/components/layout/Header";
import { authClient } from "@/lib/auth";

export default function ChatPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await authClient.getSession();
        const sessionData = (session as any)?.data;
        if (sessionData?.user?.id) {
          setUserId(sessionData.user.id);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <ChatBot userId={userId} />
    </>
  );
}
