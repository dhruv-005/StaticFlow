"use client";

import { useChatStore } from "@/stores/chat-store";
import { generateId } from "@/lib/utils";

export function useAIChat() {
  const { messages, isTyping, addMessage, setTyping, clearChat } = useChatStore();

  const sendMessage = async (content: string) => {
    const userMsg = {
      id: generateId("msg"),
      role: "user" as const,
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    setTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (res.ok) {
        const data = await res.json();
        addMessage({
          id: generateId("msg"),
          role: "assistant",
          content: data.reply,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
}
