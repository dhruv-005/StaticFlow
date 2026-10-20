"use client";

import { useState, useCallback } from "react";

export function useStreaming() {
  const [data, setData] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async (endpoint: string, body: unknown) => {
    setIsStreaming(true);
    setData("");
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream connection failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setData((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Streaming error");
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { data, isStreaming, error, startStream };
}
