import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { scanId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scan = await prisma.securityScan.findUnique({
      where: { id: params.scanId },
      include: {
        project: {
          select: { userId: true, name: true },
        },
      },
    });

    if (!scan || scan.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    return NextResponse.json({ scan });
  } catch (error) {
    console.error("[API] GET /security/:scanId error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
