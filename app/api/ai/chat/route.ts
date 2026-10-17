import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { queryAI } from "@/lib/ai/fallback-router";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const conversationContext = messages
      .slice(-6)
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n\n");

    const result = await queryAI(conversationContext, {
      system: SYSTEM_PROMPTS.apiGenerator,
      temperature: 0.4,
      maxTokens: 2048,
    });

    return NextResponse.json({
      reply: result.content,
      provider: result.provider,
    });
  } catch (error) {
    console.error("[API] POST /ai/chat error:", error);
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
