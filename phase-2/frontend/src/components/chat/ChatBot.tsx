/**
 * ChatBot Component
 *
 * Full-featured chat interface for AI-powered todo management.
 * Uses the useChatClient hook for state management and API communication.
 * Integrates Web Speech API for voice input and output.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatClient, type ChatMessage } from "@/lib/chat-client";
import { VoiceInput } from "./VoiceInput";
import { VoiceSettings } from "./VoiceSettings";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface ChatBotProps {
  userId: string | undefined;
}

export function ChatBot({ userId }: ChatBotProps) {
  const {
    messages,
    isLoading,
    isLoadingHistory,
    error,
    sendMessage,
    startNewConversation,
  } = useChatClient(userId);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Voice settings state
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  const [recognitionLanguage, setRecognitionLanguage] = useState("en-US");
  const [synthesisEnabled, setSynthesisEnabled] = useState(false);
  const [synthesisLanguage, setSynthesisLanguage] = useState("en-US");
  const [voiceGender, setVoiceGender] = useState<"male" | "female" | "any">("any");

  // Speech synthesis
  const { speak, isSpeaking } = useSpeechSynthesis({
    language: synthesisLanguage,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-speak AI responses when enabled
  useEffect(() => {
    if (synthesisEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.content) {
        speak(lastMessage.content);
      }
    }
  }, [messages, synthesisEnabled, speak]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    await sendMessage(trimmed);

    // Stop any ongoing speech when user sends new message
    if (isSpeaking) {
      speak(""); // This will cancel via the cancel call in useSpeechSynthesis
    }

    inputRef.current?.focus();
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    // Optionally auto-send after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              TaskFlow AI Assistant
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage your tasks with natural language
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceSettingsOpen(true)}
            className={cn(
              "gap-1.5 relative",
              synthesisEnabled &&
                "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
            )}
            title="Voice settings"
          >
            {synthesisEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <Settings className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={startNewConversation}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            <span className="ml-2 text-neutral-500">Loading conversation...</span>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={msg.id || idx} message={msg} />
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-neutral-100 dark:bg-neutral-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-neutral-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or use voice input... (e.g., 'Add a task to buy groceries')"
            className={cn(
              "flex-1 resize-none rounded-xl border border-neutral-300 dark:border-neutral-700",
              "bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm",
              "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              "min-h-[42px] max-h-[120px]"
            )}
            rows={1}
            disabled={isLoading || !userId}
          />

          {/* Voice Input */}
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            language={recognitionLanguage}
            onLanguageChange={setRecognitionLanguage}
            disabled={isLoading || !userId}
          />

          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !userId}
            className="h-[42px] w-[42px] shrink-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {synthesisEnabled && (
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Volume2 className="h-3 w-3" />
              Voice enabled
            </span>
          )}
        </p>
      </div>

      {/* Voice Settings Dialog */}
      <VoiceSettings
        open={voiceSettingsOpen}
        onOpenChange={setVoiceSettingsOpen}
        recognitionLanguage={recognitionLanguage}
        onRecognitionLanguageChange={setRecognitionLanguage}
        synthesisEnabled={synthesisEnabled}
        onSynthesisEnabledChange={setSynthesisEnabled}
        synthesisLanguage={synthesisLanguage}
        onSynthesisLanguageChange={setSynthesisLanguage}
        voiceGender={voiceGender}
        onVoiceGenderChange={setVoiceGender}
      />
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
        <Bot className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        TaskFlow AI Assistant
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
        I can help you manage your tasks using natural language. Try saying:
      </p>
      <div className="grid gap-2 max-w-sm w-full">
        {[
          "Add a task to buy groceries",
          "Show me all my pending tasks",
          "Mark task 1 as complete",
          "What have I completed so far?",
        ].map((suggestion) => (
          <div
            key={suggestion}
            className="text-left text-sm px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
          >
            &quot;{suggestion}&quot;
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-neutral-200 dark:bg-neutral-700"
            : "bg-gradient-to-br from-blue-500 to-purple-600"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "rounded-tl-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="mt-2 pt-2 border-t border-neutral-200/30 dark:border-neutral-700/30">
            <p className="text-xs opacity-70 mb-1">Tools used:</p>
            {message.tool_calls.map((tc, i) => (
              <span
                key={i}
                className="inline-block text-xs px-2 py-0.5 rounded-full bg-white/20 dark:bg-black/20 mr-1 mb-1"
              >
                {tc.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
