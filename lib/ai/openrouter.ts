import { AI_PROVIDERS } from "./providers";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function queryOpenRouter(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const config = AI_PROVIDERS.openrouter;
  if (!config.apiKey) throw new Error("OpenRouter API key not configured");

  const model = options.model || config.models[0];

  const messages: OpenRouterMessage[] = [];
  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }
  messages.push({ role: "user", content: prompt });

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "StaticFlow",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("[OpenRouter] Error:", error);
    throw error;
  }
}

export async function streamOpenRouter(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
  } = {}
): Promise<ReadableStream<string>> {
  const config = AI_PROVIDERS.openrouter;
  if (!config.apiKey) throw new Error("OpenRouter API key not configured");

  const model = options.model || config.models[0];

  const messages: OpenRouterMessage[] = [];
  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "StaticFlow",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.3,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`OpenRouter stream error: ${response.status}`);
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
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) controller.enqueue(content);
        } catch {
          // skip
        }
      }
    },
  });
}

export async function getOpenRouterModels(): Promise<
  Array<{ id: string; name: string; pricing: { prompt: string; completion: string } }>
> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    const data = await res.json();
    return (
      data.data?.map(
        (m: { id: string; name: string; pricing: { prompt: string; completion: string } }) => ({
          id: m.id,
          name: m.name,
          pricing: m.pricing,
        })
      ) || []
    );
  } catch {
    return [];
  }
}
