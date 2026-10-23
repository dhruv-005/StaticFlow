import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, createAuditLog } from "@/lib/auth";
import {
  getEntityById,
  updateEntity,
  deleteEntity,
} from "@/lib/render-client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const { role } = await req.json();

    if (params.id === admin.id && role === "USER") {
      return NextResponse.json(
        { error: "Cannot demote yourself" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (role !== undefined) data.role = role;

    const user = await updateEntity("users", params.id, data);

    await createAuditLog(
      admin.id,
      "ADMIN_USER_UPDATED",
      `Updated role for user ${params.id}`,
      req
    );

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);

    if (params.id === admin.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    let email = "unknown";
    try {
      const user = await getEntityById("users", params.id);
      email = user?.email || user?.name || "unknown";
    } catch {}

    await deleteEntity("users", params.id);

    await createAuditLog(
      admin.id,
      "ADMIN_USER_DELETED",
      `Deleted user ${email}`,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
