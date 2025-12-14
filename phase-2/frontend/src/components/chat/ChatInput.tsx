"use client";

/**
 * ChatInput Component
 *
 * Textarea input for composing messages.
 * Submits on Ctrl+Enter, grows with content.
 */

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({ onSend, disabled = false, isLoading = false }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        200
      ) + "px";
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || disabled || isSending || isLoading) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(content);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Error is handled by parent component
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-300 bg-white p-4"
    >
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Ctrl+Enter to send)"
          disabled={disabled || isSending || isLoading}
          rows={1}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
        />
        <button
          type="submit"
          disabled={disabled || !content.trim() || isSending || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSending || isLoading ? (
            <span className="inline-block animate-spin">↻</span>
          ) : (
            "Send"
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Try: "Add task: Buy groceries" or "Show my incomplete tasks"
      </p>
    </form>
  );
}
