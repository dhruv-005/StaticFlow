import { AI_PROVIDERS } from "./providers";

export async function queryGemini(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const config = AI_PROVIDERS.gemini;
  if (!config.apiKey) throw new Error("Gemini API key not configured");

  const model = options.model || config.models[0];
  const url = `${config.baseUrl}/models/${model}:generateContent?key=${config.apiKey}`;

  const fullPrompt = options.system
    ? `${options.system}\n\n${prompt}`
    : prompt;

  const body = {
    contents: [
      {
        parts: [{ text: fullPrompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.3,
      maxOutputTokens: options.maxTokens ?? 4096,
      topP: 0.9,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("[Gemini] Error:", error);
    throw error;
  }
}

export async function streamGemini(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
  } = {}
): Promise<ReadableStream<string>> {
  const config = AI_PROVIDERS.gemini;
  if (!config.apiKey) throw new Error("Gemini API key not configured");

  const model = options.model || config.models[0];
  const url = `${config.baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;

  const fullPrompt = options.system
    ? `${options.system}\n\n${prompt}`
    : prompt;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.3,
      },
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Gemini stream error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          controller.close();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) controller.enqueue(text);
        } catch {
          // skip
        }
      }
    },
  });
}
