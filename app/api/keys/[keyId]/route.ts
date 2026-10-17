import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import prisma from "@/lib/db/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = await prisma.apiKey.findFirst({
      where: { id: params.keyId, userId: session.user.id },
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await prisma.apiKey.update({
      where: { id: params.keyId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Key revoked" });
  } catch (error) {
    console.error("[API] DELETE /keys/:keyId error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = await prisma.apiKey.findFirst({
      where: { id: params.keyId, userId: session.user.id },
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    // Rotate: deactivate old, create new
    await prisma.apiKey.update({
      where: { id: params.keyId },
      data: { isActive: false },
    });

    const { generateApiKey } = await import("@/lib/utils");
    const { hashPassword } = await import("@/lib/security/encryption");

    const newFullKey = generateApiKey();
    const newKey = await prisma.apiKey.create({
      data: {
        projectId: key.projectId,
        userId: session.user.id,
        keyName: `${key.keyName} (rotated)`,
        keyPrefix: newFullKey.slice(0, 10) + "...",
        apiKeyHash: hashPassword(newFullKey),
        permissions: key.permissions,
      },
    });

    return NextResponse.json({
      key: { id: newKey.id, keyPrefix: newKey.keyPrefix },
      fullKey: newFullKey,
    });
  } catch (error) {
    console.error("[API] POST /keys/:keyId/rotate error:", error);
    return NextResponse.json({ error: "Rotation failed" }, { status: 500 });
  }
}
