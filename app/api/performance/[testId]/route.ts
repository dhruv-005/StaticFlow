import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const test = await prisma.performanceTest.findUnique({
      where: { id: params.testId },
      include: {
        project: { select: { userId: true } },
      },
    });

    if (!test || test.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({ test });
  } catch (error) {
    console.error("[API] GET /performance/:testId error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
