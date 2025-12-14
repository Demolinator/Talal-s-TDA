/**
 * Chat Types for Phase III AI Chatbot
 *
 * TypeScript interfaces matching backend responses exactly
 */

export interface UUID {
  [key: string]: any;
}

export interface Conversation {
  id: string; // UUID
  user_id: string; // UUID
  title: string | null;
  message_count: number;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Message {
  id: string; // UUID
  conversation_id: string; // UUID
  user_id: string; // UUID
  role: "user" | "assistant";
  content: string;
  tool_calls: Record<string, any> | null;
  created_at: string; // ISO 8601
}

export interface SendMessageResponse {
  success: boolean;
  conversation_id: string;
  user_message: {
    id: string;
    role: "user";
    content: string;
    created_at: string;
  };
  assistant_message: {
    id: string;
    role: "assistant";
    content: string;
    tool_calls: Array<{
      id: string;
      name: string;
      result: Record<string, any>;
    }>;
    created_at: string;
  };
}

export interface CreateConversationRequest {
  title?: string | null;
}

export interface SendMessageRequest {
  content: string;
}

export interface ToolCall {
  id: string;
  name: string;
  result: Record<string, any>;
}
