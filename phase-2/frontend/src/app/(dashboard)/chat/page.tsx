"use client";

/**
 * Chat Page
 *
 * Main chat interface for Phase III AI-Powered Todo Chatbot.
 * Protected route - requires authentication.
 */

import { useEffect } from "react";
import { useSession } from "@/lib/auth";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    loadConversations,
    selectConversation,
    createNewConversation,
    sendMessage,
    deleteConversation,
    clearError,
  } = useChat();

  // Load conversations on mount and when session changes
  useEffect(() => {
    if (status === "authenticated") {
      loadConversations();
    }
  }, [status, loadConversations]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🤖</div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please log in
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be authenticated to use the chat feature
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Authenticated - Show chat
  return (
    <>
      <ChatLayout
        conversations={conversations}
        activeConversation={activeConversation}
        messages={messages}
        onSelectConversation={selectConversation}
        onCreateConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        error={error}
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm z-50">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm">{error}</p>
            <button
              onClick={clearError}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
