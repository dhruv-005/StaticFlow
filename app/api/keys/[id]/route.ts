import { NextRequest, NextResponse } from "next/server";
import { requireAuth, createAuditLog } from "@/lib/auth";
import { db } from "@/lib/db/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);

    await db.apiKey.deleteMany({
      where: { id: params.id, userId: session.id },
    });

    await createAuditLog(
      session.id,
      "APIKEY_REVOKED",
      `Revoked API key ${params.id}`,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
