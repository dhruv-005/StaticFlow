export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  codeBlocks?: Array<{
    fileName: string;
    language: string;
    code: string;
  }>;
  createdAt: string;
}

export interface PromptIntent {
  entities: string[];
  features: string[];
  suggestedStack: {
    language: string;
    database: string;
  };
  complexity: "simple" | "medium" | "complex";
}
