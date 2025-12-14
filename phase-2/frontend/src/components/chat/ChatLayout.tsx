"use client";

/**
 * ChatLayout Component
 *
 * Main container for the chat interface.
 * Manages conversation selection, message display, and input.
 */

import { useEffect, useRef } from "react";
import { Conversation, Message } from "@/types/chat";
import { ConversationList } from "./ConversationList";
import { MessageDisplay } from "./MessageDisplay";
import { ChatInput } from "./ChatInput";

interface ChatLayoutProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  onSelectConversation: (id: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (id: string) => Promise<void>;
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function ChatLayout({
  conversations,
  activeConversation,
  messages,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onSendMessage,
  isLoading = false,
  error = null,
}: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div className="w-64 hidden md:flex flex-col border-r border-gray-300">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={onSelectConversation}
          onCreateConversation={onCreateConversation}
          onDeleteConversation={onDeleteConversation}
          isLoading={isLoading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 bg-gray-50">
          {activeConversation ? (
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {activeConversation.title || "Chat"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeConversation.message_count} message
                {activeConversation.message_count !== 1 ? "s" : ""}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <p className="text-lg font-medium">No conversation selected</p>
              <p className="text-sm mt-2">Create a new chat to get started</p>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {!activeConversation ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">👋 Welcome!</p>
                <p className="text-sm mb-6">
                  Create a new conversation to start chatting with the AI assistant
                </p>
                <button
                  onClick={onCreateConversation}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + Start Chat
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm text-gray-500">
                  Send a message to begin chatting with the AI
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageDisplay key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        {activeConversation ? (
          <ChatInput
            onSend={onSendMessage}
            disabled={!activeConversation}
            isLoading={isLoading}
          />
        ) : (
          <div className="p-4 bg-gray-50 border-t border-gray-300 text-center text-gray-500 text-sm">
            Select or create a conversation to start messaging
          </div>
        )}
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <button className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
          ☰
        </button>
      </div>
    </div>
  );
}
