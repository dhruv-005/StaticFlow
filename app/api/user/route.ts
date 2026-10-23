import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEntities, updateEntity } from "@/lib/render-client";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);

    const res = await getEntities("users", 10000);
    const user = res.data.find(
      (u: any) =>
        u.email === session.email ||
        u.id === session.id ||
        String(u.id) === String(session.id)
    );

    if (!user) {
      return NextResponse.json(
        {
          user: {
            id: session.id,
            name: session.name,
            email: session.email,
            role: session.role || "USER",
            createdAt: new Date().toISOString(),
          },
        }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email || session.email,
        role: (user.role || "USER").toUpperCase(),
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const res = await getEntities("users", 10000);
    const user = res.data.find(
      (u: any) =>
        u.email === session.email ||
        u.id === session.id ||
        String(u.id) === String(session.id)
    );

    if (user) {
      const updated = await updateEntity("users", user.id, {
        name: body.name,
      });
      return NextResponse.json({
        user: {
          id: user.id,
          name: body.name,
          email: user.email || session.email,
          role: (user.role || "USER").toUpperCase(),
        },
      });
    }

    return NextResponse.json({
      user: {
        id: session.id,
        name: body.name,
        email: session.email,
        role: session.role || "USER",
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
