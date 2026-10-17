import { AI_PROVIDERS } from "./providers";

export async function queryHuggingFace(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const config = AI_PROVIDERS.huggingface;
  if (!config.apiKey) throw new Error("Hugging Face API key not configured");

  const model = options.model || config.models[0];
  const url = `${config.baseUrl}/${model}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: options.temperature ?? 0.3,
          max_new_tokens: options.maxTokens ?? 2048,
          return_full_text: false,
          do_sample: true,
          top_p: 0.9,
        },
      }),
    });

    if (!response.ok) {
      // Handle model loading (HF cold start)
      if (response.status === 503) {
        const data = await response.json();
        const waitTime = data.estimated_time || 20;
        throw new Error(
          `Model is loading. Estimated wait: ${Math.ceil(waitTime)}s. Try again shortly.`
        );
      }
      const err = await response.text();
      throw new Error(`Hugging Face error: ${response.status} - ${err}`);
    }

    const data = await response.json();

    // Handle different response formats
    if (Array.isArray(data)) {
      return data[0]?.generated_text || data[0]?.text || "";
    }

    return data.generated_text || data.text || "";
  } catch (error) {
    console.error("[HuggingFace] Error:", error);
    throw error;
  }
}

export async function queryHuggingFaceChat(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
  } = {}
): Promise<string> {
  const config = AI_PROVIDERS.huggingface;
  if (!config.apiKey) throw new Error("Hugging Face API key not configured");

  const model = options.model || "mistralai/Mistral-7B-Instruct-v0.2";

  // Format messages for instruct models
  let formattedPrompt = "";
  for (const msg of messages) {
    if (msg.role === "system") {
      formattedPrompt += `<s>[INST] ${msg.content} [/INST]</s>`;
    } else if (msg.role === "user") {
      formattedPrompt += `[INST] ${msg.content} [/INST]`;
    } else if (msg.role === "assistant") {
      formattedPrompt += ` ${msg.content}</s>`;
    }
  }

  return queryHuggingFace(formattedPrompt, options);
}

export async function isHuggingFaceModelReady(
  model?: string
): Promise<boolean> {
  const config = AI_PROVIDERS.huggingface;
  if (!config.apiKey) return false;

  const modelName = model || config.models[0];

  try {
    const res = await fetch(`${config.baseUrl}/${modelName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: "test" }),
      signal: AbortSignal.timeout(5000),
    });

    return res.status !== 503;
  } catch {
    return false;
  }
}
