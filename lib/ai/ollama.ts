import { AI_PROVIDERS } from "./providers";

interface OllamaRequest {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
  };
}

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

export async function queryOllama(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const config = AI_PROVIDERS.ollama;
  const model = options.model || config.models[0];

  const body: OllamaRequest = {
    model,
    prompt,
    system: options.system,
    stream: false,
    options: {
      temperature: options.temperature ?? 0.3,
      top_p: 0.9,
      num_predict: options.maxTokens ?? 4096,
    },
  };

  try {
    const response = await fetch(`${config.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error("[Ollama] Error:", error);
    throw error;
  }
}

export async function streamOllama(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
  } = {}
): Promise<ReadableStream<string>> {
  const config = AI_PROVIDERS.ollama;
  const model = options.model || config.models[0];

  const body: OllamaRequest = {
    model,
    prompt,
    system: options.system,
    stream: true,
    options: {
      temperature: options.temperature ?? 0.3,
    },
  };

  const response = await fetch(`${config.baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama stream error: ${response.status}`);
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
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const data = JSON.parse(line) as OllamaResponse;
          if (data.response) {
            controller.enqueue(data.response);
          }
          if (data.done) {
            controller.close();
            return;
          }
        } catch {
          // skip malformed lines
        }
      }
    },
  });
}

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${AI_PROVIDERS.ollama.baseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getOllamaModels(): Promise<string[]> {
  try {
    const res = await fetch(`${AI_PROVIDERS.ollama.baseUrl}/api/tags`);
    const data = await res.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}
