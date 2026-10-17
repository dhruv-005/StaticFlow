export type AIProvider = "ollama" | "groq" | "gemini" | "huggingface" | "openrouter";

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  baseUrl: string;
  apiKey?: string;
  models: string[];
  rateLimit: number;
  priority: number;
  enabled: boolean;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  ollama: {
    id: "ollama",
    name: "Ollama (Local)",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    models: ["deepseek-coder:6.7b", "codellama:7b", "mistral:7b"],
    rateLimit: Infinity,
    priority: 1,
    enabled: true,
  },
  groq: {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    models: ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    rateLimit: 30,
    priority: 2,
    enabled: !!process.env.GROQ_API_KEY,
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: process.env.GEMINI_API_KEY,
    models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"],
    rateLimit: 60,
    priority: 3,
    enabled: !!process.env.GEMINI_API_KEY,
  },
  huggingface: {
    id: "huggingface",
    name: "Hugging Face",
    baseUrl: "https://api-inference.huggingface.co/models",
    apiKey: process.env.HUGGINGFACE_API_KEY,
    models: ["codellama/CodeLlama-7b-Instruct-hf", "mistralai/Mistral-7B-Instruct-v0.2"],
    rateLimit: 20,
    priority: 4,
    enabled: !!process.env.HUGGINGFACE_API_KEY,
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    models: ["meta-llama/llama-3.1-8b-instruct:free", "mistralai/mistral-7b-instruct:free"],
    rateLimit: 10,
    priority: 5,
    enabled: !!process.env.OPENROUTER_API_KEY,
  },
};

export function getEnabledProviders(): AIProviderConfig[] {
  return Object.values(AI_PROVIDERS)
    .filter((p) => p.enabled)
    .sort((a, b) => a.priority - b.priority);
}

export function getDefaultModel(provider: AIProvider): string {
  return AI_PROVIDERS[provider].models[0];
}
