import { NextRequest, NextResponse } from "next/server";

interface CodeFile { name: string; language: string; content: string }
interface GenerateResult {
  success: boolean; files: CodeFile[]; model: string;
  apiUrl?: string; apiKey?: string; error?: string;
}

const BACKEND = process.env.BACKEND_URL || "https://staticflow.onrender.com";

const ENTITY_MAP: Record<string, {
  plural: string;
  fields: Record<string, string>;
  seed: (i: number) => Record<string, unknown>;
}> = {
  student: {
    plural: "students",
    fields: { id: "Int", name: "String", email: "String", grade: "String", gpa: "Float", major: "String", year: "String" },
    seed: (i) => ({
      id: i, name: `Student ${i}`, email: `student${i}@university.edu`,
      grade: ["A","B","C","D"][i % 4], gpa: +(2.5 + Math.random() * 1.5).toFixed(2),
      major: ["CS","Math","Physics","Biology"][i % 4],
      year: ["Freshman","Sophomore","Junior","Senior"][i % 4],
      marks: { Math: 60 + (i * 7) % 40, Physics: 55 + (i * 11) % 45, Chemistry: 50 + (i * 13) % 50 },
      subjects: ["Math", "Physics", "Chemistry", "English", "CS"],
    }),
  },
  product: {
    plural: "products",
    fields: { id: "Int", name: "String", description: "String", price: "Float", category: "String", inStock: "Boolean" },
    seed: (i) => ({ id: i, name: `Product ${i}`, description: `Desc ${i}`, price: +(9.99 + Math.random() * 90).toFixed(2), category: ["Electronics","Clothing","Food","Books"][i % 4], inStock: i % 3 !== 0 }),
  },
  order: {
    plural: "orders",
    fields: { id: "Int", customerId: "Int", total: "Float", status: "String" },
    seed: (i) => ({ id: i, customerId: (i % 20) + 1, total: +(19.99 + Math.random() * 200).toFixed(2), status: ["pending","shipped","delivered","cancelled"][i % 4] }),
  },
  user: {
    plural: "users",
    fields: { id: "Int", name: "String", email: "String", role: "String", isActive: "Boolean" },
    seed: (i) => ({ id: i, name: `User ${i}`, email: `user${i}@example.com`, role: ["admin","editor","viewer"][i % 3], isActive: i % 5 !== 0 }),
  },
  post: {
    plural: "posts",
    fields: { id: "Int", title: "String", body: "String", authorId: "Int", published: "Boolean" },
    seed: (i) => ({ id: i, title: `Post ${i}`, body: `Content ${i}`, authorId: (i % 10) + 1, published: i % 2 === 0 }),
  },
  task: {
    plural: "tasks",
    fields: { id: "Int", title: "String", description: "String", status: "String", priority: "String" },
    seed: (i) => ({ id: i, title: `Task ${i}`, description: `Details ${i}`, status: ["todo","in-progress","done"][i % 3], priority: ["low","medium","high"][i % 3] }),
  },
  employee: {
    plural: "employees",
    fields: { id: "Int", name: "String", email: "String", department: "String", position: "String", salary: "Float" },
    seed: (i) => ({ id: i, name: `Employee ${i}`, email: `emp${i}@company.com`, department: ["Engineering","Marketing","Sales","HR"][i % 4], position: ["Junior","Mid","Senior","Lead"][i % 4], salary: +(45000 + Math.random() * 80000).toFixed(0) }),
  },
  patient: {
    plural: "patients",
    fields: { id: "Int", name: "String", age: "Int", gender: "String", diagnosis: "String" },
    seed: (i) => ({ id: i, name: `Patient ${i}`, age: 20 + (i % 60), gender: i % 2 === 0 ? "M" : "F", diagnosis: ["Flu","Fracture","Allergy","Checkup"][i % 4] }),
  },
  book: {
    plural: "books",
    fields: { id: "Int", title: "String", author: "String", isbn: "String", genre: "String", pages: "Int" },
    seed: (i) => ({ id: i, title: `Book ${i}`, author: `Author ${i}`, isbn: `978-${String(i).padStart(10, "0")}`, genre: ["Fiction","Science","History","Fantasy"][i % 4], pages: 100 + (i * 37) % 400 }),
  },
  comment: {
    plural: "comments",
    fields: { id: "Int", postId: "Int", authorName: "String", body: "String" },
    seed: (i) => ({ id: i, postId: (i % 10) + 1, authorName: `Commenter ${i}`, body: `Comment ${i}` }),
  },
  item: {
    plural: "items",
    fields: { id: "Int", name: "String", description: "String", value: "Float" },
    seed: (i) => ({ id: i, name: `Item ${i}`, description: `Description ${i}`, value: +(5 + Math.random() * 95).toFixed(2) }),
  },
};

function parsePrompt(prompt: string) {
  const lower = prompt.toLowerCase();

  // Detect entity
  let entity = "item";
  for (const key of Object.keys(ENTITY_MAP)) {
    if (lower.includes(key)) { entity = key; break; }
  }

  // Detect count — matches ANY number before any word
  const countMatch = lower.match(/(\d+)/);
  const count = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 1), 10000) : 100;

  // Detect extra fields
  const fieldMatch = lower.match(/(?:with|having|including|fields?:?)\s+(.+)/);
  const extraFields = fieldMatch
    ? fieldMatch[1].split(/,\s*|\s+and\s+/).map(f => f.trim().replace(/[^a-zA-Z]/g, "")).filter(Boolean)
    : [];

  return { entity, count, extraFields };
}

function makeKey(): string {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return "sf_live_" + Array.from({ length: 32 }, () => c[Math.floor(Math.random() * 62)]).join("");
}

function generateLocal(prompt: string): GenerateResult {
  const { entity, count, extraFields } = parsePrompt(prompt);
  const cfg = ENTITY_MAP[entity];
  const Name = entity.charAt(0).toUpperCase() + entity.slice(1);
  const plural = cfg.plural;
  const allFields = { ...cfg.fields };
  for (const f of extraFields) if (!allFields[f]) allFields[f] = "String";

  const prismaFields = Object.entries(allFields)
    .map(([n, t]) => `  ${n} ${t}${n === "id" ? " @id @default(autoincrement())" : ""}`)
    .join("\n");

  const prisma = `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel ${Name} {\n${prismaFields}\n}\n`;

  const seedArr = Array.from({ length: Math.min(count, 20) }, (_, i) => cfg.seed(i + 1));

  // ★ URL limit matches the exact count from the prompt
  const liveUrl = `${BACKEND}/api/v1/${plural}?limit=${count}`;

  const main = `// ${entity}.api.ts — Generated by StaticFlow
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.STATICFLOW_API_KEY || "${makeKey()}";
app.use("/api", (req, res, next) => {
  const key = req.headers["x-api-key"] as string;
  if (key !== API_KEY) return res.status(401).json({ error: "Invalid API key" });
  next();
});

app.get("/api/${plural}", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || ${count};
  const offset = parseInt(req.query.offset as string) || 0;
  const items = await prisma.${entity}.findMany({ take: limit, skip: offset });
  const total = await prisma.${entity}.count();
  res.json({ data: items, total, limit, offset });
});

app.get("/api/${plural}/:id", async (req, res) => {
  const item = await prisma.${entity}.findUnique({ where: { id: +req.params.id } });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ data: item });
});

app.post("/api/${plural}", async (req, res) => {
  const item = await prisma.${entity}.create({ data: req.body });
  res.status(201).json({ data: item });
});

app.put("/api/${plural}/:id", async (req, res) => {
  const item = await prisma.${entity}.update({ where: { id: +req.params.id }, data: req.body });
  res.json({ data: item });
});

app.delete("/api/${plural}/:id", async (req, res) => {
  await prisma.${entity}.delete({ where: { id: +req.params.id } });
  res.json({ message: "Deleted" });
});

app.post("/api/seed", async (_req, res) => {
  const data = ${JSON.stringify(seedArr, null, 2)};
  await prisma.${entity}.createMany({ data, skipDuplicates: true });
  res.json({ seeded: data.length });
});

app.listen(PORT, () => console.log(\`🚀 ${Name} API → http://localhost:\${PORT}/api/${plural}\`));
`;

  const pkg = `{\n  "name": "staticflow-${entity}-api",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "npx tsx watch ${entity}.api.ts",\n    "db:push": "npx prisma db push",\n    "seed": "curl -X POST http://localhost:3000/api/seed"\n  },\n  "dependencies": {\n    "@prisma/client": "^5.20.0",\n    "cors": "^2.8.5",\n    "express": "^4.21.0"\n  },\n  "devDependencies": {\n    "prisma": "^5.20.0",\n    "tsx": "^4.19.0",\n    "typescript": "^5.6.0"\n  }\n}\n`;

  const readme = `# ${Name} API\n\n## Live URL\n\`${liveUrl}\`\n\n## Endpoints\n| Method | Path |\n|--------|------|\n| GET | /api/${plural}?limit=${count} |\n| GET | /api/${plural}/:id |\n| POST | /api/${plural} |\n| PUT | /api/${plural}/:id |\n| DELETE | /api/${plural}/:id |\n\n*Generated by StaticFlow*\n`;

  return {
    success: true,
    files: [
      { name: `${entity}.api.ts`, language: "typescript", content: main },
      { name: "prisma/schema.prisma", language: "prisma", content: prisma },
      { name: "package.json", language: "json", content: pkg },
      { name: "README.md", language: "markdown", content: readme },
    ],
    model: "smart-engine-v4",
    apiUrl: liveUrl,
    apiKey: makeKey(),
  };
}

async function tryGroq(prompt: string): Promise<GenerateResult | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: 'Generate a REST API. Return ONLY JSON: {"files":[{"name":"f","language":"l","content":"c"}]}. Include Express main file, Prisma schema, package.json.' },
          { role: "user", content: prompt },
        ],
        temperature: 0.3, max_tokens: 4000,
      }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const m = d.choices?.[0]?.message?.content?.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const p = JSON.parse(m[0]);
    if (!p.files?.length) return null;
    const { entity, count } = parsePrompt(prompt);
    const plural = ENTITY_MAP[entity]?.plural || "items";
    return { success: true, files: p.files, model: "groq/llama-3.1", apiUrl: `${BACKEND}/api/v1/${plural}?limit=${count}`, apiKey: makeKey() };
  } catch { return null; }
}

async function tryGemini(prompt: string): Promise<GenerateResult | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Generate REST API for: "${prompt}". Return ONLY JSON: {"files":[{"name":"f","language":"l","content":"c"}]}` }] }] }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const m = d.candidates?.[0]?.content?.parts?.[0]?.text?.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const p = JSON.parse(m[0]);
    if (!p.files?.length) return null;
    const { entity, count } = parsePrompt(prompt);
    const plural = ENTITY_MAP[entity]?.plural || "items";
    return { success: true, files: p.files, model: "gemini-1.5-flash", apiUrl: `${BACKEND}/api/v1/${plural}?limit=${count}`, apiKey: makeKey() };
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ success: false, files: [], error: "Prompt required" }, { status: 400 });

    for (const fn of [tryGroq, tryGemini]) {
      try {
        const r = await fn(prompt);
        if (r?.success) return NextResponse.json(r);
      } catch { /* next */ }
    }

    return NextResponse.json(generateLocal(prompt));
  } catch (e: unknown) {
    return NextResponse.json({ success: false, files: [], error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}