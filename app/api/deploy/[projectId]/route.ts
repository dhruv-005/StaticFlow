import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deployments = await prisma.deployment.findMany({
      where: {
        projectId: params.projectId,
        project: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ deployments });
  } catch (error) {
    console.error("[API] GET /deploy/:projectId error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
