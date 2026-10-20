import { queryOllama, isOllamaAvailable } from "./ollama";
import { queryGroq } from "./groq";
import { queryGemini } from "./gemini";
import { getEnabledProviders, type AIProvider } from "./providers";

interface QueryOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
  preferredProvider?: AIProvider;
}

interface QueryResult {
  content: string;
  provider: AIProvider;
  model: string;
  duration: number;
}

export async function queryAI(
  prompt: string,
  options: QueryOptions = {}
): Promise<QueryResult> {
  const providers = getEnabledProviders();

  if (providers.length === 0) {
    throw new Error("No AI providers available. Please configure at least one provider.");
  }

  // If preferred provider specified, try it first
  if (options.preferredProvider) {
    const preferred = providers.find((p) => p.id === options.preferredProvider);
    if (preferred) {
      try {
        const result = await executeQuery(prompt, preferred.id, options);
        return result;
      } catch (error) {
        console.warn(`[AI Router] Preferred provider ${preferred.id} failed, trying fallbacks...`);
      }
    }
  }

  // Try each provider in priority order
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const result = await executeQuery(prompt, provider.id, options);
      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`${provider.id}: ${msg}`);
      console.warn(`[AI Router] ${provider.id} failed: ${msg}`);
      continue;
    }
  }

  throw new Error(
    `All AI providers failed:\n${errors.join("\n")}`
  );
}

async function executeQuery(
  prompt: string,
  provider: AIProvider,
  options: QueryOptions
): Promise<QueryResult> {
  const start = Date.now();
  let content = "";

  switch (provider) {
    case "ollama": {
      const available = await isOllamaAvailable();
      if (!available) throw new Error("Ollama server not running");
      content = await queryOllama(prompt, {
        system: options.system,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
      break;
    }
    case "groq":
      content = await queryGroq(prompt, {
        system: options.system,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
      break;
    case "gemini":
      content = await queryGemini(prompt, {
        system: options.system,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      });
      break;
    default:
      throw new Error(`Provider ${provider} not implemented yet`);
  }

  return {
    content,
    provider,
    model: "default",
    duration: Date.now() - start,
  };
}

export async function streamAI(
  prompt: string,
  options: QueryOptions = {}
): Promise<{ stream: ReadableStream<string>; provider: AIProvider }> {
  const providers = getEnabledProviders();

  for (const provider of providers) {
    try {
      let stream: ReadableStream<string>;

      switch (provider.id) {
        case "ollama": {
          const { streamOllama } = await import("./ollama");
          const available = await isOllamaAvailable();
          if (!available) continue;
          stream = await streamOllama(prompt, {
            system: options.system,
            temperature: options.temperature,
          });
          break;
        }
        case "groq": {
          const { streamGroq } = await import("./groq");
          stream = await streamGroq(prompt, {
            system: options.system,
            temperature: options.temperature,
          });
          break;
        }
        case "gemini": {
          const { streamGemini } = await import("./gemini");
          stream = await streamGemini(prompt, {
            system: options.system,
            temperature: options.temperature,
          });
          break;
        }
        default:
          continue;
      }

      return { stream, provider: provider.id };
    } catch {
      continue;
    }
  }

  throw new Error("All AI providers failed for streaming");
}
