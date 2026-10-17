export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}

export interface ApiTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  database: string;
  stars: number;
  downloads: number;
  author: {
    name: string;
    avatarUrl?: string;
  };
  promptTemplate: string;
  createdAt: string;
}

export const initialTemplates: ApiTemplate[] = [
  {
    id: "tpl-ecommerce-pro",
    title: "E-Commerce Microservice Suite",
    description: "Production-ready store backend with Stripe Checkout, cart sessions, inventory reservation, and webhooks.",
    category: "E-Commerce",
    language: "node-express",
    database: "postgresql",
    stars: 4.9,
    downloads: 3820,
    author: { name: "StaticFlow Core Team" },
    promptTemplate: "Build an enterprise e-commerce API with product catalogs, Stripe payments, cart checkout, and inventory webhooks.",
    createdAt: "2024-09-12",
  },
  {
    id: "tpl-saas-multitenant",
    title: "Multi-Tenant SaaS Starter",
    description: "Tenant isolation by schema, organization roles, team invitations, and Stripe recurring subscription billing.",
    category: "SaaS",
    language: "node-express",
    database: "postgresql",
    stars: 4.8,
    downloads: 2940,
    author: { name: "Alex Rivera" },
    promptTemplate: "Generate a multi-tenant B2B SaaS API with team hierarchies, RBAC roles, and subscription tier billing.",
    createdAt: "2024-09-20",
  },
  {
    id: "tpl-chat-webrtc",
    title: "Real-Time Chat & Signaling",
    description: "High-throughput WebSocket messaging, direct channels, typing indicators, and WebRTC peer connection signaling.",
    category: "Real-Time",
    language: "go-gin",
    database: "mongodb",
    stars: 4.9,
    downloads: 1850,
    author: { name: "GoStream Labs" },
    promptTemplate: "Create a Go Gin WebSocket real-time chat API with rooms, message history in MongoDB, and online presence.",
    createdAt: "2024-09-25",
  },
  {
    id: "tpl-healthcare-hipaa",
    title: "HIPAA Compliant Health Records",
    description: "Encrypted Patient Health Information (PHI), audit access logs, doctor appointment schedules, and prescriptions.",
    category: "Healthcare",
    language: "java-spring",
    database: "postgresql",
    stars: 4.7,
    downloads: 920,
    author: { name: "MedTech Core" },
    promptTemplate: "Design a HIPAA-compliant medical records REST API with AES encrypted patient fields and access audit logs.",
    createdAt: "2024-10-01",
  },
  {
    id: "tpl-ai-rag-pipeline",
    title: "AI RAG Vector Retrieval API",
    description: "Document ingestion, text chunking, OpenAI embeddings vector search with pgvector, and streaming completions.",
    category: "AI & ML",
    language: "python-fastapi",
    database: "postgresql",
    stars: 5.0,
    downloads: 4100,
    author: { name: "NeuralVector" },
    promptTemplate: "Build a Python FastAPI vector search RAG pipeline API with pgvector, document upload, and streaming chat.",
    createdAt: "2024-10-05",
  },
  {
    id: "tpl-fintech-ledger",
    title: "Double-Entry Financial Ledger",
    description: "Immutable transaction ledgers, multi-currency wallets, balance holds, and idempotent transfer endpoints.",
    category: "FinTech",
    language: "python-fastapi",
    database: "postgresql",
    stars: 4.9,
    downloads: 1420,
    author: { name: "LedgerSafe" },
    promptTemplate: "Create a double-entry financial ledger API with ACID transactions, wallet balances, and transfer idempotency keys.",
    createdAt: "2024-10-10",
  },
];
