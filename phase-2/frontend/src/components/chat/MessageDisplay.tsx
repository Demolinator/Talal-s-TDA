"use client";

/**
 * MessageDisplay Component
 *
 * Renders individual messages in the chat conversation.
 * Different styling for user vs assistant messages.
 */

import { Message, ToolCall } from "@/types/chat";
import { formatMessageTime } from "@/lib/chatApi";

interface MessageDisplayProps {
  message: Message;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {/* Message content */}
        <p className="text-sm md:text-base break-words">{message.content}</p>

        {/* Tool calls (if present) */}
        {message.tool_calls && (
          <div className="mt-3 pt-3 border-t border-opacity-30 border-current">
            <p className="text-xs font-semibold opacity-75 mb-2">Tool Calls:</p>
            <div className="space-y-2">
              {message.tool_calls.tool_calls?.map(
                (toolCall: { id: string; function: any }, index: number) => (
                  <div
                    key={toolCall.id}
                    className="bg-opacity-20 bg-black rounded p-2 text-xs"
                  >
                    <p className="font-mono font-bold">
                      {toolCall.function.name}
                    </p>
                    {toolCall.function.result && (
                      <p className="text-opacity-75 mt-1 font-mono">
                        ✓ {typeof toolCall.function.result === "string"
                          ? toolCall.function.result
                          : JSON.stringify(toolCall.function.result).substring(0, 60) + "..."}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-xs mt-2 ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatMessageTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}
