import { NextRequest, NextResponse } from "next/server";
import {
  requireAdmin,
  createAuditLog,
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { role, verified } = await req.json();

    // Prevent self-demotion
    if (
      params.id === admin.id &&
      role === "USER"
    ) {
      return NextResponse.json(
        { error: "Cannot demote yourself" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (role !== undefined) data.role = role;
    if (verified !== undefined)
      data.verified = verified;

    const user = await db.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await createAuditLog({
      action: "ADMIN_USER_UPDATED",
      entity: "user",
      entityId: params.id,
      details: "Updated " + user.email,
      userId: admin.id,
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();

    // Prevent self-deletion
    if (params.id === admin.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      select: { email: true },
    });

    await db.user.delete({
      where: { id: params.id },
    });

    await createAuditLog({
      action: "ADMIN_USER_DELETED",
      entity: "user",
      entityId: params.id,
      details: "Deleted " + user?.email,
      userId: admin.id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
