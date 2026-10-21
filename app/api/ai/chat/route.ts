import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are StaticFlow AI, a helpful assistant inside an API builder platform. You help users:
- Design and plan API endpoints
- Write and debug code (Python, JavaScript, TypeScript)
- Understand API concepts (REST, GraphQL, webhooks)
- Optimize database queries and data models
- Set up authentication and security
Keep responses concise, practical, and code-focused. Use code blocks when showing examples.`;

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

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
          messages: groqMessages,
          temperature: 0.4,
          max_tokens: 2048,
        }),
      }
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Groq chat error:", errText);
      return NextResponse.json(
        { error: "AI chat failed. Please try again." },
        { status: 502 }
      );
    }

    const aiData = await aiRes.json();
    const reply = aiData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      reply,
      provider: "groq",
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[API] POST /ai/chat error:", error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
