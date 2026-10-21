import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, createAuditLog, trackUsage } from "@/lib/auth";
import crypto from "crypto";

/* ── helpers ── */

function parseRecordCount(prompt: string): number {
  const patterns = [
    /(\d+)\s*(?:records?|entries|items|rows|objects|documents|results|students|products|users|employees|books|posts)/i,
    /(\d+)\s*(?:\w+\s+){0,2}(?:records?|entries|items)/i,
    /(?:with|having|containing|about|around|approximately)\s+(\d+)/i,
  ];
  for (const p of patterns) {
    const m = prompt.match(p);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= 10000) return n;
    }
  }
  return 10;
}

function extractCode(text: string): string {
  const fence = text.match(/```(?:python|js|javascript|ts|typescript|json)?\s*\n([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  return text.trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "api";
}

/* ── POST /api/generate ── */

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const body = await req.json();
    const prompt = (body.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be under 2000 characters." },
        { status: 400 }
      );
    }

    const recordCount = parseRecordCount(prompt);
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json(
        { error: "AI service not configured." },
        { status: 500 }
      );
    }

    /* ── call Groq ── */
    const systemPrompt = `You are an expert API developer. Generate a complete, production-ready Python FastAPI endpoint based on the user's description.

RULES:
1. Generate EXACTLY ${recordCount} realistic, varied records of data — never fewer, never more.
2. The data must be SPECIFIC to the user's description — not generic placeholder data.
3. Include proper field names, realistic values, varied data types (strings, numbers, booleans, dates).
4. Use FastAPI with a single GET endpoint that returns JSON.
5. Include CORS middleware.
6. Include a health check endpoint at /.
7. The response must be a JSON array of objects.
8. Add realistic field variations — no two records should be identical.
9. Include proper type hints and docstrings.
10. Output ONLY the Python code, no explanations.`;

    const aiRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      }
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Groq error:", errText);
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await aiRes.json();
    const rawCode =
      aiData.choices?.[0]?.message?.content || "No code generated.";
    const code = extractCode(rawCode);

    /* ── save to DB ── */
    const slug = slugify(prompt);
    const projectId = crypto.randomUUID().slice(0, 8);
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://staticflow.onrender.com";
    const endpoint = `${baseUrl}/api/v1/${slug}-${projectId}/data`;
    const apiKeyValue = `sf_live_${crypto.randomBytes(24).toString("hex")}`;

    const project = await prisma.project.create({
      data: {
        name: prompt.slice(0, 80),
        description: prompt,
        endpoint,
        code,
        userId: session.userId,
      },
    });

    const apiKey = await prisma.apiKey.create({
      data: {
        key: apiKeyValue,
        name: `${project.name} Key`,
        userId: session.userId,
        projectId: project.id,
      },
    });

    await createAuditLog(
      session.userId,
      "GENERATE",
      `Generated API: ${project.name} (${recordCount} records)`,
      req
    );

    await trackUsage(session.userId, "/api/generate", "POST", 200, 0);

    return NextResponse.json({
      code,
      endpoint,
      apiKey: apiKeyValue,
      projectId: project.id,
      message: `API generated with ${recordCount} records. Your live endpoint is ready!`,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
