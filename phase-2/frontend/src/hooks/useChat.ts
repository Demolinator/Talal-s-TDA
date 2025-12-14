/**
 * useChat Hook
 *
 * Manages chat state including conversations, messages, and loading states.
 * Provides methods for conversation management and messaging.
 */

import { useState, useCallback } from "react";
import { Conversation, Message } from "@/types/chat";
import * as chatApi from "@/lib/chatApi";

interface UseChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface UseChatActions {
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  createNewConversation: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatState & UseChatActions {
  const [state, setState] = useState<UseChatState>({
    conversations: [],
    activeConversation: null,
    messages: [],
    isLoading: false,
    error: null,
  });

  /**
   * Load all conversations for the current user
   */
  const loadConversations = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const conversations = await chatApi.listConversations();
      setState((prev) => ({
        ...prev,
        conversations,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load conversations";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Select a conversation and load its messages
   */
  const selectConversation = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [conversation, messages] = await Promise.all([
        chatApi.getConversation(id),
        chatApi.getMessages(id),
      ]);

      setState((prev) => ({
        ...prev,
        activeConversation: conversation,
        messages,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load conversation";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Create a new conversation
   */
  const createNewConversation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const conversation = await chatApi.createConversation();

      setState((prev) => ({
        ...prev,
        conversations: [conversation, ...prev.conversations],
        activeConversation: conversation,
        messages: [],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create conversation";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Send a message to the chat agent
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.activeConversation) {
        setState((prev) => ({
          ...prev,
          error: "No active conversation",
        }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await chatApi.sendMessage(
          state.activeConversation.id,
          content
        );

        // Convert response to message objects
        const userMessage: Message = {
          id: response.user_message.id,
          conversation_id: state.activeConversation.id,
          user_id: state.activeConversation.user_id, // We'll use the conversation's user_id
          role: "user",
          content: response.user_message.content,
          tool_calls: null,
          created_at: response.user_message.created_at,
        };

        const assistantMessage: Message = {
          id: response.assistant_message.id,
          conversation_id: state.activeConversation.id,
          user_id: state.activeConversation.user_id,
          role: "assistant",
          content: response.assistant_message.content,
          tool_calls: response.assistant_message.tool_calls?.length
            ? { tool_calls: response.assistant_message.tool_calls as any }
            : null,
          created_at: response.assistant_message.created_at,
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMessage, assistantMessage],
          activeConversation: prev.activeConversation
            ? {
                ...prev.activeConversation,
                message_count: prev.activeConversation.message_count + 2,
                updated_at: new Date().toISOString(),
              }
            : null,
          isLoading: false,
        }));

        // Update conversation in list
        setState((prev) => ({
          ...prev,
          conversations: prev.conversations.map((conv) =>
            conv.id === state.activeConversation!.id
              ? {
                  ...conv,
                  message_count: conv.message_count + 2,
                  updated_at: new Date().toISOString(),
                }
              : conv
          ),
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [state.activeConversation]
  );

  /**
   * Delete a conversation
   */
  const deleteConversation = useCallback(async (id: string) => {
    try {
      await chatApi.deleteConversation(id);

      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.filter((conv) => conv.id !== id),
        activeConversation:
          prev.activeConversation?.id === id ? null : prev.activeConversation,
        messages: prev.activeConversation?.id === id ? [] : prev.messages,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete conversation";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    conversations: state.conversations,
    activeConversation: state.activeConversation,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    loadConversations,
    selectConversation,
    createNewConversation,
    sendMessage,
    deleteConversation,
    clearError,
  };
}
