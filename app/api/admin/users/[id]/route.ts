import { NextRequest, NextResponse } from "next/server";
import {
  requireSuperAdmin,
  isSuperAdmin,
  createAuditLog,
} from "@/lib/auth";
import {
  getEntityById,
  getEntities,
  updateEntity,
  deleteEntity,
} from "@/lib/render-client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireSuperAdmin(req);
    const { role } = await req.json();

    const res = await getEntities("users", 10000);
    const targetUser = res.data.find(
      (u: any) => String(u.id) === String(params.id)
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (isSuperAdmin(targetUser.email || "")) {
      return NextResponse.json(
        { error: "Cannot change role of a super admin" },
        { status: 400 }
      );
    }

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
      `Super admin updated role for ${targetUser.email} to ${role}`,
      req
    );

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json(
        { error: "Super admin access required" },
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
    const admin = await requireSuperAdmin(req);

    const res = await getEntities("users", 10000);
    const targetUser = res.data.find(
      (u: any) => String(u.id) === String(params.id)
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (isSuperAdmin(targetUser.email || "")) {
      return NextResponse.json(
        { error: "Cannot delete a super admin" },
        { status: 400 }
      );
    }

    if (params.id === admin.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    await deleteEntity("users", params.id);

    await createAuditLog(
      admin.id,
      "ADMIN_USER_DELETED",
      `Super admin deleted user ${targetUser.email}`,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error.message === "FORBIDDEN")
      return NextResponse.json(
        { error: "Super admin access required" },
        { status: 403 }
      );
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
