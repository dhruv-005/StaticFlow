import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";
import { queryAI } from "@/lib/ai/fallback-router";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: { id: params.projectId, userId: session.user.id },
      include: { endpoints: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const codeString = JSON.stringify(project.code);
    const endpointsString = JSON.stringify(project.endpoints);

    const result = await queryAI(
      `Generate OpenAPI 3.1 documentation for this API:\n\nCode:\n${codeString}\n\nEndpoints:\n${endpointsString}`,
      {
        system: SYSTEM_PROMPTS.docGenerator,
        temperature: 0.2,
        maxTokens: 4096,
      }
    );

    return NextResponse.json({
      openapi: result.content,
      provider: result.provider,
    });
  } catch (error) {
    console.error("[API] GET /docs/:projectId error:", error);
    return NextResponse.json({ error: "Doc generation failed" }, { status: 500 });
  }
}
