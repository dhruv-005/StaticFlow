import { AI_PROVIDERS } from "./providers";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export async function queryGroq(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const config = AI_PROVIDERS.groq;
  if (!config.apiKey) throw new Error("Groq API key not configured");

  const model = options.model || config.models[0];

  const messages: GroqMessage[] = [];
  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }
  messages.push({ role: "user", content: prompt });

  const body: GroqRequest = {
    model,
    messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 4096,
    stream: false,
  };

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("[Groq] Error:", error);
    throw error;
  }
}

export async function streamGroq(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
  } = {}
): Promise<ReadableStream<string>> {
  const config = AI_PROVIDERS.groq;
  if (!config.apiKey) throw new Error("Groq API key not configured");

  const model = options.model || config.models[0];

  const messages: GroqMessage[] = [];
  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.3,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Groq stream error: ${response.status}`);
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
