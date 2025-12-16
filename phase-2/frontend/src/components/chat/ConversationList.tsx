"use client";

/**
 * ConversationList Component
 *
 * Displays list of conversations in a sidebar.
 * Allows selection, creation, and deletion of conversations.
 */

import { useState } from "react";
import { Conversation } from "@/types/chat";
import { formatDate } from "@/lib/chatApi";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isLoading = false,
}: ConversationListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (!confirm("Delete this conversation?")) {
      return;
    }

    setDeletingId(id);
    try {
      await onDeleteConversation(id);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      alert("Failed to delete conversation");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <button
          onClick={onCreateConversation}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
        >
          + New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-2">Click "New Chat" to start</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                  activeConversationId === conversation.id
                    ? "bg-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title || "Untitled Chat"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.message_count} message
                      {conversation.message_count !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(conversation.updated_at)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, conversation.id)}
                    disabled={deletingId === conversation.id}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                    title="Delete conversation"
                  >
                    {deletingId === conversation.id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <span>×</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-300 bg-gray-100 text-xs text-gray-600">
        <p>💡 Tip: Use natural language to manage your tasks</p>
      </div>
    </div>
  );
}
