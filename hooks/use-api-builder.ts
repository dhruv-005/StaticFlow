"use client";

import { useBuilderStore } from "@/stores/builder-store";
import { useChatStore } from "@/stores/chat-store";
import { generateId } from "@/lib/utils";

export function useApiBuilder() {
  const {
    activeFile,
    files,
    isGenerating,
    selectedLanguage,
    selectedDatabase,
    setActiveFile,
    updateFileContent,
    setIsGenerating,
    setLanguage,
    setDatabase,
  } = useBuilderStore();

  const { addMessage, setTyping } = useChatStore();

  const generateApiFromPrompt = async (prompt: string) => {
    setIsGenerating(true);
    setTyping(true);

    addMessage({
      id: generateId("msg"),
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language: selectedLanguage,
          database: selectedDatabase,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();

      addMessage({
        id: generateId("msg"),
        role: "assistant",
        content: data.summary || "API scaffolding successfully generated!",
        codeBlocks: data.codeBlocks,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      addMessage({
        id: generateId("msg"),
        role: "assistant",
        content: "An error occurred during API generation. Please try again.",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsGenerating(false);
      setTyping(false);
    }
  };

  return {
    activeFile,
    files,
    isGenerating,
    selectedLanguage,
    selectedDatabase,
    setActiveFile,
    updateFileContent,
    setLanguage,
    setDatabase,
    generateApiFromPrompt,
  };
}
